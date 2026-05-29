import { NextRequest } from 'next/server';
import { settingsService } from '@/lib/services/settings.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { requireAdminAuth } from '@/lib/utils/auth.middleware';
import { validate, settingsSchema } from '@/lib/utils/validation';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const settings = await settingsService.getSettings();
    return apiResponse.success(settings, 'Settings loaded successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const body = await request.json();
    const validation = validate(settingsSchema, body);
    if (!validation.success) {
      return apiResponse.validationError(validation.error!);
    }

    const settings = await settingsService.saveSettings(validation.data);
    return apiResponse.success(settings, 'Settings saved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
