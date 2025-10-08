# Interview Transcription & Debrief Generator

A Next.js web application that transcribes interview audio files with speaker separation and generates structured interview debriefs using AI.

## Features

- 🎵 Upload interview recordings in any format (mp3, wav, m4a, flac, etc.)
- 🗣️ Automatic speaker diarization (interviewer/candidate separation)
- 📝 Full transcription with timestamps and speaker labels
- 🤖 AI-powered interview debrief generation
- 📋 Structured output covering: interview atmosphere, key topics, technical questions, and more
- ▶️ Built-in audio player with seekable timeline
- 🚀 No file storage required - everything in-memory
- 🎯 Perfect for technical recruiters, hiring managers, and interview preparation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Transcription**: AssemblyAI (with speaker diarization)
- **AI Generation**: OpenAI GPT
- **Deployment**: Vercel

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file with your API keys:
```bash
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
OPENAI_API_KEY=your_openai_api_key
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## How It Works

1. **Upload**: Upload your interview recording (any size - uses streaming)
2. **Transcribe**: AssemblyAI processes the audio with automatic speaker separation (interviewer/candidate)
3. **Review**: View full transcription with speaker labels, timestamps, and playback
4. **Generate**: AI analyzes the interview and creates a structured debrief covering:
   - Interview atmosphere and structure
   - Key technical topics discussed
   - Technologies and frameworks covered
   - Situational/behavioral questions asked
   - Coding challenges (if applicable)
   - Next steps in the process

## Architecture

- Direct streaming upload to AssemblyAI (no size limits)
- Client-side polling for transcription status
- React Context for state management
- No database or file storage required

## Deployment

Deploy to Vercel with one click:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## API Keys

- **AssemblyAI**: Get your key at [https://www.assemblyai.com/](https://www.assemblyai.com/)
- **OpenAI**: Get your key at [https://platform.openai.com/](https://platform.openai.com/)


