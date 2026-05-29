import { NextRequest } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

async function verifyGoogleToken(credential: string) {
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to verify Google identity token');
  }
  const data = await response.json();
  return data as { aud: string; email: string; email_verified?: string; name?: string; picture?: string };
}

// POST /api/auth/google
// Supports real Google ID tokens and a fallback demo email/name flow.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const credential = body?.credential;
    let email = body?.email;
    let name = body?.name;
    let image = body?.image;

    if (credential) {
      const tokenInfo = await verifyGoogleToken(credential);
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (clientId && tokenInfo.aud !== clientId) {
        return apiResponse.unauthorized('Google client ID mismatch');
      }
      email = tokenInfo.email;
      name = tokenInfo.name || name;
      image = tokenInfo.picture || image;
    }

    if (!email) {
      return apiResponse.validationError('Email is required for Google sign-in');
    }

    const login = await authService.loginWithGoogle({ email, name, image });
    return apiResponse.success(login, 'Login successful');
  } catch (error) {
    return handleApiError(error);
  }
}
