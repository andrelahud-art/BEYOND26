import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/server';

/**
 * POST /api/upload
 * Temporary file upload endpoint for Phase 1
 * In production, this would use Supabase Storage or S3
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file || !type) {
      return NextResponse.json(
        { error: 'Missing file or type' },
        { status: 400 }
      );
    }

    // For now, return a mock URL
    // In production, upload to Supabase Storage:
    // const path = `companions/${user.id}/${type}/${file.name}`;
    // const { data, error } = await supabase.storage.from('documents').upload(path, file);
    const mockUrl = `https://storage.example.com/companions/${user.id}/${type}/${file.name}`;

    return NextResponse.json({
      url: mockUrl,
      filename: file.name,
      size: file.size,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
