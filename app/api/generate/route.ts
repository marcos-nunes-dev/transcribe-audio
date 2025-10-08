import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { readFile } from 'fs/promises';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface Utterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function formatTranscriptionWithTimestamps(utterances: Utterance[]): string {
  return utterances
    .map((utt) => {
      const timestamp = formatTimestamp(utt.start);
      return `[${timestamp}] ${utt.speaker}: ${utt.text}`;
    })
    .join('\n\n');
}

export async function POST(request: NextRequest) {
  try {
    const { utterances } = await request.json();

    if (!utterances || !Array.isArray(utterances) || utterances.length === 0) {
      return NextResponse.json(
        { error: 'No transcription utterances provided' },
        { status: 400 }
      );
    }

    // Load the template
    const templatePath = path.join(process.cwd(), 'templates', 'interview-debrief.txt');
    const template = await readFile(templatePath, 'utf-8');

    // Format transcription with timestamps
    const formattedTranscription = formatTranscriptionWithTimestamps(utterances);
    
    // Calculate total interview duration
    const totalDuration = utterances[utterances.length - 1].end;
    const totalMinutes = Math.floor(totalDuration / 60);

    // Create the prompt
    const prompt = `You are an expert at analyzing technical interview transcriptions and creating structured interview debriefs.

Below is a transcription of a technical interview with speaker labels and ACTUAL TIMESTAMPS. The interview lasted approximately ${totalMinutes} minutes in total.

IMPORTANT: Use the timestamps [MM:SS] to calculate ACCURATE time estimates for each section. Do not guess the durations - use the actual timestamps to determine when topics change and how long each section lasted.

Pay special attention to:
- The overall tone and atmosphere of the interview
- Technical topics discussed and depth of knowledge assessed
- Specific technologies, frameworks, and tools mentioned
- Behavioral and situational questions asked
- Any coding challenges or technical exercises discussed
- Key skills and competencies the interviewer was evaluating
- The structure and flow of the interview
- ACCURATE time calculations based on timestamps

TEMPLATE:
${template}

INTERVIEW TRANSCRIPTION WITH TIMESTAMPS:
${formattedTranscription}

Please create a detailed, professional interview debrief following the template structure. 

CRITICAL: For the "Structure of the Interview" section, analyze the timestamps to identify when topics changed and calculate the ACTUAL duration of each section. For example:
- If the introduction starts at [0:00] and technical questions start at [5:30], the introduction was ≈5-6 min
- Use the timestamps to be accurate, not estimated

Extract all relevant information from the transcription and organize it appropriately. Be thorough and capture all important details. Use bullet points (●) as shown in the template examples. Include specific quotes when listing situational questions.`;

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical recruiter and interview analyst. You specialize in analyzing technical interview transcriptions and creating detailed, structured debriefs that help candidates prepare for similar interviews and help hiring teams assess performance.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const generatedDocument = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ document: generatedDocument });
  } catch (error) {
    console.error('Generate document error:', error);
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    );
  }
}


