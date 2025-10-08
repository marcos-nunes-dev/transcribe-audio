# Setup Guide

## Prerequisites

- Node.js 18+ installed
- AssemblyAI API key ([Get one here](https://www.assemblyai.com/))
- OpenAI API key ([Get one here](https://platform.openai.com/))

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Getting API Keys

### AssemblyAI

1. Go to [https://www.assemblyai.com/](https://www.assemblyai.com/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key
5. Free tier includes 5 hours of transcription per month

### OpenAI

1. Go to [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API keys section
4. Create a new API key
5. Copy the key (you won't be able to see it again)
6. Note: OpenAI requires payment setup, but offers $5 free credits for new users

## Project Structure

```
transcribe-audio/
├── app/
│   ├── page.tsx                 # Upload page
│   ├── processing/
│   │   └── page.tsx             # Processing/polling page
│   ├── results/
│   │   └── page.tsx             # Results display page
│   ├── api/
│   │   ├── upload/route.ts      # File upload to AssemblyAI
│   │   ├── transcribe/route.ts  # Start transcription job
│   │   ├── status/route.ts      # Check transcription status
│   │   └── generate/route.ts    # Generate AI document
│   ├── layout.tsx               # Root layout with context
│   └── globals.css              # Global styles
├── components/
│   ├── AudioUploader.tsx        # Drag-drop file uploader
│   ├── AudioPlayer.tsx          # Audio playback component
│   ├── TranscriptionView.tsx    # Display transcription with speakers
│   └── DocumentGenerator.tsx    # AI document generation UI
├── context/
│   └── AppContext.tsx           # React Context for state management
├── lib/
│   └── utils.ts                 # Utility functions
└── templates/
    └── meeting-notes.txt        # Document template for AI
```

## Features

### 1. Audio Upload
- Supports all audio formats (mp3, wav, m4a, flac, ogg, etc.)
- Drag-and-drop or click to browse
- No file size limits (uses streaming)

### 2. Transcription
- Powered by AssemblyAI
- Automatic speaker diarization (separation)
- Timestamps for each utterance

### 3. AI Document Generation
- Powered by OpenAI GPT-4o-mini
- Generates structured meeting summaries
- Customizable template

### 4. User Interface
- Clean, modern design with Tailwind CSS
- Dark mode support
- Responsive layout

## How It Works

### Flow Diagram

```
1. User uploads audio file
   ↓
2. File streams to AssemblyAI via /api/upload
   ↓
3. Transcription job created via /api/transcribe
   ↓
4. Client polls /api/status every 3 seconds
   ↓
5. When complete, display results
   ↓
6. User can generate AI document
   ↓
7. OpenAI formats transcription using template
```

### Technical Details

- **No Database**: Everything stored in React Context (in-memory)
- **No File Storage**: Audio files never saved permanently
- **Streaming Upload**: Large files handled via streaming to avoid memory issues
- **Client Polling**: Simple status checking without webhooks

## Customizing the Template

Edit `templates/meeting-notes.txt` to change the output format. The AI will use this as a guide for structuring the generated document.

Example sections you can add:
- Financial discussions
- Technical details
- Risk assessment
- Customer feedback
- etc.

## Troubleshooting

### "Failed to upload file"
- Check your AssemblyAI API key in `.env.local`
- Ensure the audio file is a valid format

### "Failed to generate document"
- Check your OpenAI API key in `.env.local`
- Ensure you have credits/billing set up on OpenAI

### Transcription takes forever
- Long audio files can take 10-30+ minutes to transcribe
- AssemblyAI processes at ~1:1 speed (1 hour audio = ~1 hour processing)
- Be patient and don't close the processing page

### Audio won't play
- Ensure your browser supports the audio format
- Try converting to MP3 if issues persist

## Development Tips

### Testing with Sample Audio
1. Use short audio files (< 2 minutes) during development
2. Test with multiple speakers for diarization
3. Clear browser cache if experiencing issues

### Monitoring API Usage
- AssemblyAI: Check usage in your dashboard
- OpenAI: Monitor usage in your account settings

### Hot Reloading
- Next.js automatically reloads on file changes
- API routes require page refresh to update

## Production Considerations

### Before Deploying

1. ✅ Set environment variables in hosting platform
2. ✅ Test with various audio formats
3. ✅ Set up error monitoring (Sentry, etc.)
4. ✅ Add rate limiting to API routes
5. ✅ Consider adding authentication for production use

### Vercel Deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

## Support

- AssemblyAI Docs: [https://www.assemblyai.com/docs](https://www.assemblyai.com/docs)
- OpenAI Docs: [https://platform.openai.com/docs](https://platform.openai.com/docs)
- Next.js Docs: [https://nextjs.org/docs](https://nextjs.org/docs)


