import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'No job ID provided' },
        { status: 400 }
      );
    }

    // Check transcription status
    const response = await fetch(
      `https://api.assemblyai.com/v2/transcript/${jobId}`,
      {
        headers: {
          'authorization': process.env.ASSEMBLYAI_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('AssemblyAI status error:', error);
      return NextResponse.json(
        { error: 'Failed to check transcription status' },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Return based on status
    if (data.status === 'completed') {
      // Parse utterances with speaker labels
      const utterances = data.utterances?.map((utt: any) => ({
        speaker: utt.speaker,
        text: utt.text,
        start: utt.start / 1000, // Convert ms to seconds
        end: utt.end / 1000,
      })) || [];

      return NextResponse.json({
        status: 'completed',
        data: {
          utterances,
          fullText: data.text,
        },
      });
    } else if (data.status === 'error') {
      return NextResponse.json({
        status: 'error',
        error: data.error || 'Transcription failed',
      });
    } else {
      // queued or processing
      return NextResponse.json({
        status: data.status,
      });
    }
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}


