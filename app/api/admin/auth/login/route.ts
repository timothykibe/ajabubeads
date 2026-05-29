import { NextRequest } from 'next/server';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { jwtSign } from '@/lib/services/jwt.service';
import { userRepository } from '@/lib/db/user.repository';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'admin@ajabubeads.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// POST /api/admin/auth/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    // Lookup user in DB
    if (!email || !password) {
      return apiResponse.validationError('Email and password are required');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return apiResponse.unauthorized('Invalid credentials');
    }

    const valid = await userRepository.verifyPassword(user.password, password);
    if (!valid) {
      return apiResponse.unauthorized('Invalid credentials');
    }

    const u: any = user as any;
    const isAdmin = !!u.isAdmin;
    const isSuperAdmin = !!u.isSuperAdmin;

    if (!isAdmin) {
      return apiResponse.forbidden('Admin access required');
    }

    const token = jwtSign({ userId: user.id, email: user.email, isAdmin, isSuperAdmin }, { expiresIn: '12h' });
    return apiResponse.success(
      { accessToken: token, user: { id: user.id, email: user.email, name: user.name, isAdmin, isSuperAdmin } },
      'Login successful'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
