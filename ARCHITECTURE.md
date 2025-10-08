# Application Architecture

## Overview

This is a full-stack Next.js application that transcribes audio files with speaker separation and generates AI-powered documents.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│  React Context (AppContext)                                      │
│  ├── audioFile: File                                            │
│  ├── audioUrl: string (blob URL)                                │
│  ├── transcriptionJobId: string                                 │
│  ├── transcription: { utterances[], fullText }                  │
│  └── generatedDocument: string                                  │
├─────────────────────────────────────────────────────────────────┤
│  Pages:                                                          │
│  ├── / (Upload)                                                 │
│  ├── /processing (Polling)                                      │
│  └── /results (Display)                                         │
└─────────────────────────────────────────────────────────────────┘
                              ▲ │
                              │ │ HTTP Requests
                              │ ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS API ROUTES                          │
├─────────────────────────────────────────────────────────────────┤
│  POST /api/upload                                               │
│    → Streams file to AssemblyAI upload endpoint                 │
│    → Returns upload URL                                         │
├─────────────────────────────────────────────────────────────────┤
│  POST /api/transcribe                                           │
│    → Creates transcription job with speaker_labels=true         │
│    → Returns job ID                                             │
├─────────────────────────────────────────────────────────────────┤
│  GET /api/status?jobId=xxx                                      │
│    → Checks job status                                          │
│    → Returns status + transcription data when complete          │
├─────────────────────────────────────────────────────────────────┤
│  POST /api/generate                                             │
│    → Loads template from templates/meeting-notes.txt            │
│    → Sends to OpenAI with transcription                         │
│    → Returns formatted document                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ External API Calls
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES                          │
├─────────────────────────────────────────────────────────────────┤
│  AssemblyAI                                                      │
│  ├── POST /v2/upload (file upload)                             │
│  ├── POST /v2/transcript (create job)                          │
│  └── GET /v2/transcript/:id (check status)                     │
├─────────────────────────────────────────────────────────────────┤
│  OpenAI                                                          │
│  └── POST /v1/chat/completions (GPT-4o-mini)                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Upload Flow

```
User selects file
    │
    ├─→ Create blob URL (for playback)
    │   └─→ Store in Context
    │
    └─→ Upload to /api/upload
        └─→ Stream to AssemblyAI /v2/upload
            └─→ Get upload URL
                └─→ Call /api/transcribe with URL
                    └─→ Create transcription job
                        └─→ Get job ID
                            └─→ Store in Context
                                └─→ Navigate to /processing
```

### 2. Processing Flow

```
/processing page loads
    │
    └─→ Poll /api/status?jobId=xxx every 3 seconds
        │
        ├─→ Status: "queued" → Continue polling
        │
        ├─→ Status: "processing" → Continue polling
        │
        ├─→ Status: "completed" → Store transcription → Navigate to /results
        │
        └─→ Status: "error" → Show error message
```

### 3. Results & Generation Flow

```
/results page loads
    │
    ├─→ Display audio player (from blob URL)
    │
    ├─→ Display transcription (from Context)
    │
    └─→ User clicks "Generate Document"
        └─→ Call /api/generate with transcription
            └─→ Load template from file system
                └─→ Send to OpenAI GPT-4o-mini
                    └─→ Get formatted document
                        └─→ Display with copy/download options
```

## Component Hierarchy

```
App (layout.tsx)
└── AppProvider (React Context)
    │
    ├── HomePage (/)
    │   └── AudioUploader
    │       ├── File input
    │       └── Drag-drop zone
    │
    ├── ProcessingPage (/processing)
    │   └── Status indicator
    │       └── Polling logic
    │
    └── ResultsPage (/results)
        ├── AudioPlayer
        │   ├── Play/pause button
        │   ├── Progress bar
        │   └── Time display
        │
        ├── TranscriptionView
        │   └── Utterances list
        │       ├── Speaker labels
        │       ├── Timestamps
        │       └── Text content
        │
        └── DocumentGenerator
            ├── Generate button
            └── Document display
                ├── Copy button
                └── Download button
```

## State Management

### React Context (AppContext)

**Purpose**: Share state across pages without prop drilling

**State Variables**:
- `audioFile`: Original file object
- `audioUrl`: Blob URL for audio playback
- `transcriptionJobId`: AssemblyAI job identifier
- `transcription`: Complete transcription data
- `generatedDocument`: AI-generated document

**Why Context?**:
- No page reloads needed
- Data persists during navigation
- Simple for this scale (no Redux needed)

## Key Technical Decisions

### 1. Streaming File Upload

**Problem**: Vercel body size limits (4.5MB free, 50MB pro)

**Solution**: Stream file through API route without loading into memory

```typescript
// API route streams buffer directly to AssemblyAI
const arrayBuffer = await file.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);
await fetch('https://api.assemblyai.com/v2/upload', {
  body: buffer, // Streamed, not stored
});
```

### 2. Client-Side Polling

**Problem**: AssemblyAI transcription is async (can take minutes to hours)

**Solution**: Client polls status endpoint every 3 seconds

**Why not webhooks?**:
- Simpler implementation
- No webhook endpoint setup needed
- Works well for this use case
- Vercel-friendly (no long-running connections)

### 3. No Database

**Problem**: Need to store transcription data

**Solution**: Use React Context (in-memory)

**Trade-offs**:
- ✅ Simple, no infrastructure needed
- ✅ Free
- ✅ Fast
- ❌ Data lost on page refresh (acceptable for this use case)
- ❌ No history (can add localStorage if needed)

### 4. No File Storage

**Problem**: Need audio file for playback

**Solution**: Create blob URL from original file

```typescript
const audioUrl = URL.createObjectURL(file);
```

**Benefits**:
- No storage costs
- No cleanup needed (auto-revoked)
- Works offline once loaded

## Security Considerations

### API Key Protection

**Problem**: Can't expose API keys in client code

**Solution**: All external API calls go through Next.js API routes

```
Client → Next.js API Route → External API
```

API keys stored in environment variables (server-side only).

### CORS

Not an issue - all requests are same-origin (client → own API routes).

### Rate Limiting

Not implemented in MVP - consider adding for production:
- Limit uploads per IP
- Limit API calls per session
- Use Vercel edge middleware

## Performance Optimizations

### 1. Audio Upload
- Streaming prevents memory issues
- No size limits with this approach

### 2. Polling Interval
- 3 seconds is balanced:
  - Not too aggressive (avoid rate limits)
  - Not too slow (user experience)

### 3. Code Splitting
- Next.js automatically code-splits by page
- Components only loaded when needed

### 4. Image Optimization
- Not applicable (no images in MVP)

## Scalability

### Current Limitations

1. **Concurrent Users**: Limited by Vercel serverless function concurrency
2. **API Costs**: Pay-per-use for AssemblyAI and OpenAI
3. **No Persistence**: Data lost on refresh

### Scaling Options

**For 100+ concurrent users:**
1. Upgrade to Vercel Pro (more concurrency)
2. Add database (Vercel Postgres, Supabase)
3. Add authentication
4. Implement caching
5. Add rate limiting

**For 1000+ users:**
1. Consider dedicated backend (not serverless)
2. Use message queue for transcription jobs
3. Implement Redis caching
4. CDN for static assets
5. Load balancing

## Error Handling

### Client-Side
- Try/catch blocks around all API calls
- User-friendly error messages
- Ability to retry or start over

### Server-Side
- Error responses with appropriate status codes
- Console logging for debugging
- Graceful degradation

### External API Failures
- AssemblyAI timeout → Show error, allow retry
- OpenAI failure → Show error, allow regenerate

## Testing Strategy (Not Implemented Yet)

### Unit Tests
- Component rendering
- Utility functions
- Context state management

### Integration Tests
- API route responses
- File upload flow
- Status polling

### E2E Tests
- Complete user flow
- Multiple audio formats
- Edge cases

## Future Enhancements

### Phase 2
- [ ] Multiple document templates
- [ ] User template customization
- [ ] Transcription editing
- [ ] Export to multiple formats (PDF, DOCX)

### Phase 3
- [ ] User authentication
- [ ] Transcription history
- [ ] Team collaboration
- [ ] Real-time transcription

### Phase 4
- [ ] Custom AI models
- [ ] Multi-language support
- [ ] Video transcription
- [ ] Advanced speaker analytics

## Technology Choices Explained

### Why Next.js?
- Full-stack in one framework
- API routes built-in
- Great developer experience
- Easy Vercel deployment
- TypeScript support

### Why AssemblyAI?
- Best-in-class speaker diarization
- Simple API
- Good free tier
- Reliable accuracy

### Why OpenAI?
- Most powerful LLM
- Good instruction-following
- Affordable (GPT-4o-mini)
- Easy API

### Why Tailwind CSS?
- Rapid development
- Consistent design
- Built-in dark mode
- Small bundle size

### Why React Context (not Redux)?
- Simple app state
- No need for complex state management
- Fewer dependencies
- Easier to understand

## Monitoring & Debugging

### Development
- Next.js dev server console
- Browser DevTools
- React DevTools

### Production (Vercel)
- Function logs
- Analytics
- Speed Insights
- Error tracking (consider adding Sentry)

## Conclusion

This architecture prioritizes:
1. **Simplicity**: Minimal dependencies and infrastructure
2. **Cost-effectiveness**: Free tier friendly
3. **Developer experience**: Fast iteration, clear code structure
4. **User experience**: Smooth flow, clear feedback
5. **Scalability**: Can upgrade as needed

The app is production-ready for small to medium usage and can scale up with additional services as needed.


