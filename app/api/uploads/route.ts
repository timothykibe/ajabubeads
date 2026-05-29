import { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get('file') as any;
    if (!file) return new Response(JSON.stringify({ success: false, error: 'No file provided' }), { status: 400 });

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const originalName = file.name || `upload-${Date.now()}`;
    const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadsDir, safeName);
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${safeName}`;
    return new Response(JSON.stringify({ success: true, url }), { status: 201 });
  } catch (error) {
    console.error('Upload error', error);
    return new Response(JSON.stringify({ success: false, error: 'Upload failed' }), { status: 500 });
  }
}
