import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from '../services/jwt.service';
import { apiResponse } from './api.response';

export async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const decoded = jwtVerify(token);

  if (!decoded) {
    return null;
  }

  return decoded;
}

export async function requireAuth(request: NextRequest) {
  const auth = await verifyAuth(request);

  if (!auth) {
    return {
      authenticated: false,
      response: apiResponse.unauthorized('Invalid or missing token'),
    };
  }

  return {
    authenticated: true,
    user: auth,
  };
}

export async function requireAdminAuth(request: NextRequest) {
  const auth = await verifyAuth(request);

  if (!auth) {
    return {
      authenticated: false,
      response: apiResponse.unauthorized('Invalid or missing token'),
    };
  }

  // Check if user is admin (this would need to be extended to check user role in DB)
  if (!auth.isAdmin) {
    return {
      authenticated: false,
      response: apiResponse.forbidden('Admin access required'),
    };
  }

  return {
    authenticated: true,
    user: auth,
  };
}

export async function requireSuperAdminAuth(request: NextRequest) {
  const auth = await verifyAuth(request);

  if (!auth) {
    return {
      authenticated: false,
      response: apiResponse.unauthorized('Invalid or missing token'),
    };
  }

  if (!auth.isSuperAdmin) {
    return {
      authenticated: false,
      response: apiResponse.forbidden('Super admin access required'),
    };
  }

  return {
    authenticated: true,
    user: auth,
  };
}
