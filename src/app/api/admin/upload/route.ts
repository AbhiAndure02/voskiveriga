import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check if Vercel Blob token is available
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (blobToken) {
      // Upload using @vercel/blob
      const filename = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const blob = await put(filename, file, {
        access: 'public',
        token: blobToken,
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
        provider: 'vercel-blob',
      });
    }

    // Fallback for local development if BLOB_READ_WRITE_TOKEN is not configured
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);

    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, safeFilename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      provider: 'local-blob',
    });
  } catch (error: any) {
    console.error('Error uploading product photo blob:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload photo' },
      { status: 500 }
    );
  }
}
