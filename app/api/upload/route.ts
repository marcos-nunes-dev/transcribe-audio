import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    if (!process.env.ASSEMBLYAI_API_KEY) {
      console.error('ASSEMBLYAI_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error: ASSEMBLYAI_API_KEY not set' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Stream the file directly to AssemblyAI
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Sending to AssemblyAI...');
    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'authorization': process.env.ASSEMBLYAI_API_KEY,
      },
      body: buffer,
    });

    console.log('AssemblyAI response status:', uploadResponse.status);

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error('AssemblyAI upload error:', error);
      console.error('Response status:', uploadResponse.status);
      return NextResponse.json(
        { error: `Failed to upload file to AssemblyAI: ${error}` },
        { status: uploadResponse.status }
      );
    }

    const responseData = await uploadResponse.json();
    console.log('Upload successful, URL received');

    return NextResponse.json({ upload_url: responseData.upload_url });
  } catch (error: any) {
    console.error('Upload error:', error);
    console.error('Error details:', error?.message, error?.stack);
    return NextResponse.json(
      { error: `Failed to upload file: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}


