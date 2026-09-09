import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Encode to base64 Data URL so image displays instantly without server restart
    const mimeType = file.type || 'image/jpeg';
    const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;

    // Also attempt saving to public/uploads/ for static reference
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });
      const ext = path.extname(file.name) || '.jpg';
      const filename = `parfum-${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);
      return NextResponse.json({ success: true, imageUrl: base64Image, filePath: `/uploads/${filename}` });
    } catch (fsErr) {
      // Return base64DataUrl if filesystem write fails
      return NextResponse.json({ success: true, imageUrl: base64Image });
    }
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Gagal mengunggah file' }, { status: 500 });
  }
}
