import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { audio_url } = await request.json();

    if (!audio_url) {
      return NextResponse.json(
        { error: 'No audio URL provided' },
        { status: 400 }
      );
    }

    // Create transcription job with speaker diarization enabled
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'authorization': process.env.ASSEMBLYAI_API_KEY!,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audio_url,
        speaker_labels: true, // Enable speaker diarization
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AssemblyAI transcribe error:', error);
      return NextResponse.json(
        { error: 'Failed to create transcription job' },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({ 
      job_id: data.id,
      status: data.status 
    });
  } catch (error) {
    console.error('Transcribe error:', error);
    return NextResponse.json(
      { error: 'Failed to create transcription' },
      { status: 500 }
    );
  }
}


