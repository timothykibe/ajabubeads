import { NextRequest } from 'next/server';
import { userRepository } from '@/lib/db/user.repository';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { requireAdminAuth } from '@/lib/utils/auth.middleware';

// GET /api/admin/users - list users (admin)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const url = new URL(request.url);
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const take = parseInt(url.searchParams.get('take') || '50');

    const result = await userRepository.getAllUsers({ skip, take });
    return apiResponse.success(result, 'Users retrieved');
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/admin/users - create a new admin user
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const body = await request.json();
    const { email, name, password, isAdmin = false, isSuperAdmin = false } = body;

    if (!email || !password) {
      return apiResponse.error('Email and password are required', 400);
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return apiResponse.error('User with this email already exists', 400);
    }

    const user = await userRepository.create({
      email,
      name,
      password,
      isAdmin,
      isSuperAdmin,
    });

    return apiResponse.success({ user }, 'User created');
  } catch (error) {
    return handleApiError(error);
  }
}
