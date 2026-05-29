import { NextRequest } from 'next/server';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { mediaService } from '@/lib/services/media.service';
import { requireAdminAuth } from '@/lib/utils/auth.middleware';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function GET() {
  try {
    const data = await mediaService.list({ take: 200 });
    return apiResponse.success(data.items, 'Media listed');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    // Read multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as any;
    if (!file) return apiResponse.validationError('file is required');

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const outPath = path.join(UPLOAD_DIR, safeName);
    await fs.promises.writeFile(outPath, buffer);

    const url = `/uploads/${safeName}`;

    const record = await mediaService.uploadLocal(file.name, url, file.type, buffer.length, auth.user.userId || auth.user.email);

    return apiResponse.created(record, 'File uploaded');
  } catch (error) {
    return handleApiError(error);
  }
}
