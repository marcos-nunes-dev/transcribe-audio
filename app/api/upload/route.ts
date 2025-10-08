import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Stream the file directly to AssemblyAI
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'authorization': process.env.ASSEMBLYAI_API_KEY!,
      },
      body: buffer,
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error('AssemblyAI upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload file to AssemblyAI' },
        { status: 500 }
      );
    }

    const { upload_url } = await uploadResponse.json();

    return NextResponse.json({ upload_url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}


