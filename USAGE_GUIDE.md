# Usage Guide: Interview Transcription & Debrief Generator

## Quick Start

### 1. Record Your Interview

**Best Practices:**
- Use a good quality microphone
- Record in a quiet environment
- Ensure all speakers are audible
- Save in any audio format (MP3, WAV, M4A recommended)

**Recording Options:**
- Zoom/Google Meet/Teams built-in recording
- OBS Studio (free, open-source)
- Audacity (free, open-source)
- Your phone's voice recorder
- Dedicated audio recording software

### 2. Upload the Recording

1. Go to [http://localhost:3000](http://localhost:3000) (or your deployed URL)
2. Drag and drop your audio file, or click to browse
3. Click "Start Transcription"

**Note:** No file size limits! The app uses streaming technology to handle even very long interviews (2+ hours).

### 3. Wait for Processing

- Short interviews (< 10 min): ~1-2 minutes
- Medium interviews (30 min): ~5-10 minutes  
- Long interviews (1+ hour): ~30-60 minutes

**Tips:**
- Don't close the processing page
- AssemblyAI processes at roughly real-time speed
- You'll see status updates as it progresses

### 4. Review Transcription

Once processing completes, you'll see:

**Audio Player:**
- Play/pause controls
- Seekable timeline
- Current time display

**Transcription View:**
- Color-coded speakers (Speaker A, Speaker B, etc.)
- Timestamps for each utterance
- Full text of what was said

**Tip:** Use this to verify accuracy before generating the debrief.

### 5. Generate Debrief

Click "Generate Interview Debrief" to create an AI-powered analysis that includes:

- **General Comments:** Interview atmosphere and interviewer attitude
- **Structure:** Breakdown of interview sections with time estimates
- **Platform:** Technical setup (Zoom, screen sharing, etc.)
- **Key Points to Hit:** Critical skills and topics assessed
- **Live Coding Challenge:** Details about any coding exercises
- **Tech Questions:** Technologies and frameworks discussed
- **Situational Questions:** Behavioral questions asked
- **Next Steps:** What comes next in the process

### 6. Use the Debrief

**Copy Button:** Copy to clipboard for quick sharing  
**Download Button:** Save as `interview-debrief.txt`

**Use Cases:**
- Share with candidates for preparation
- Review before similar interviews
- Document interview process for team
- Track trends across multiple interviews
- Prepare for next rounds

---

## Common Use Cases

### For Recruiters

**Document Every Interview:**
1. Record all technical interviews
2. Generate debriefs for consistency
3. Share with candidates (approved sections)
4. Build a knowledge base of common questions

**Track Patterns:**
- What questions work best?
- How do interviewers differ?
- What topics trip up candidates?
- Which companies ask what?

### For Candidates

**Interview Preparation:**
1. Get recordings from mock interviews
2. Generate debriefs to see gaps
3. Practice answering documented questions
4. Learn from similar interview experiences

**Post-Interview Review:**
- See what you did well
- Identify areas for improvement
- Prepare better for next rounds
- Share feedback with interview coaches

### For Hiring Managers

**Standardize Interviews:**
- Document your ideal interview structure
- Train new interviewers with examples
- Ensure consistent evaluation criteria
- Reduce bias with structured approach

**Quality Assurance:**
- Review interviewer performance
- Ensure technical depth is adequate
- Verify all required topics are covered
- Maintain professional standards

---

## Tips for Best Results

### Recording Quality

**✅ Do:**
- Use a headset or quality microphone
- Record in a quiet room
- Test recording before the interview
- Speak clearly and at moderate pace
- Keep volume levels consistent

**❌ Don't:**
- Record in noisy environments (coffee shops, etc.)
- Use low-quality phone speakers
- Let audio clip or distort
- Have multiple people talk over each other constantly
- Record at very low volume

### Speaker Separation

AssemblyAI's speaker diarization works best when:
- Speakers take turns (not talking over each other)
- There's a slight pause between speakers
- Each speaker has a distinct voice
- Audio quality is good

**Note:** The AI labels speakers as "A", "B", "C", etc. - not by name. You'll need to identify who is who from context.

### Transcription Accuracy

Factors that improve accuracy:
- Clear speech without heavy accents
- Technical terms pronounced correctly
- Good audio quality (most important!)
- Minimal background noise
- One speaker at a time

**Tip:** If transcription has errors, you can still get good debrief results - the AI is robust to minor transcription mistakes.

### Debrief Quality

For best AI-generated debriefs:
- Longer, more detailed interviews → better debriefs
- Structured interviews → clearer analysis
- Explicit mentions of technologies → better tech sections
- Clear questions → easier to extract situational questions

---

## Troubleshooting

### Audio Won't Upload
- **Check file format:** Most audio formats work, but try MP3 if issues
- **Check internet connection:** Large files need stable connection
- **Try refreshing the page:** Clear browser cache if needed

### Transcription Stuck on "Processing"
- **Be patient:** Long audio takes time (30+ min for 1 hour)
- **Check AssemblyAI status:** Verify service is operational
- **Don't close the page:** Polling will stop if you navigate away

### Poor Transcription Quality
- **Audio quality is key:** Re-record with better microphone
- **Reduce background noise:** Use noise cancellation if available
- **Check speaker separation:** Works best with 2-4 distinct speakers

### Generated Debrief is Incomplete
- **Transcription quality:** Better input = better output
- **Interview structure:** More structured interviews = clearer debriefs
- **Regenerate:** Try generating again - AI output can vary

### Audio Player Not Working
- **Check browser:** Use Chrome, Firefox, or Edge (Safari sometimes has issues)
- **Check format:** Try converting to MP3
- **Check file corruption:** Verify file plays in other players

---

## Advanced Tips

### Customizing the Template

Want different debrief sections? Edit `templates/interview-debrief.txt`:

1. Open the file
2. Modify sections or add new ones
3. Restart the dev server (or redeploy)
4. Generate new debriefs with your custom format

**Example additions:**
- Salary discussion section
- Cultural fit assessment
- Red flags or concerns
- Candidate strengths/weaknesses

### API Cost Management

**AssemblyAI:**
- Free tier: 5 hours/month
- After that: ~$0.65/hour
- Monitor usage in dashboard

**OpenAI:**
- Each debrief: ~$0.001-0.003
- Very affordable for most use cases
- Set spending limits in dashboard

### Batch Processing

Need to process many interviews?
1. Upload and transcribe each
2. Generate debriefs
3. Download all as .txt files
4. Organize in your system

**Tip:** Consider adding interview date/candidate name to filename before downloading.

### Privacy & Security

**Important Considerations:**
- Transcriptions are NOT stored permanently
- Data is lost when you close the browser
- No database = no data retention
- API providers (AssemblyAI, OpenAI) process the data

**For sensitive interviews:**
- Get consent before recording
- Review their privacy policies
- Consider self-hosted alternatives for very sensitive content
- Delete recordings after use

---

## Example Workflow

### Real-World Example: Technical Interview

1. **Morning:** Schedule interview via Zoom
2. **During Interview (45 min):**
   - Start Zoom recording
   - Conduct interview normally
   - End recording, download audio
3. **After Interview (10 min):**
   - Upload audio to app
   - Wait 5-10 min for transcription
   - Review transcription for accuracy
4. **Generate Debrief (2 min):**
   - Click "Generate Interview Debrief"
   - Wait ~30 seconds
   - Review AI-generated debrief
5. **Share (5 min):**
   - Edit/refine if needed
   - Copy relevant sections
   - Share with team or candidate
   - Download for records

**Total time invested:** ~15-20 minutes for complete documentation

---

## FAQ

**Q: Does this work for non-technical interviews?**  
A: Yes! While optimized for technical interviews, it works for any interview type. You may want to customize the template.

**Q: Can it identify speakers by name?**  
A: No, it labels them as Speaker A, B, C. You identify them from context.

**Q: How many speakers can it handle?**  
A: Works best with 2-4 speakers. More than that may reduce accuracy.

**Q: Can I edit the transcription?**  
A: Not in the current version. This is a potential future feature.

**Q: Is the transcription 100% accurate?**  
A: No transcription service is 100% accurate. Expect 90-95% accuracy with good audio.

**Q: Can I use this for video files?**  
A: Currently audio only. Extract audio from video first using tools like VLC or FFmpeg.

**Q: Does it work offline?**  
A: No, it requires internet connection for AssemblyAI and OpenAI APIs.

**Q: Can I use different AI models?**  
A: Yes! Edit `app/api/generate/route.ts` to change the OpenAI model (e.g., to GPT-4).

---

## Support

Having issues? Check:
1. This usage guide
2. `SETUP.md` for installation issues
3. `README.md` for general overview
4. GitHub issues (if using open-source version)

**Common Solutions:**
- Clear browser cache
- Check API keys are set correctly
- Verify services are operational
- Try a different browser
- Restart development server

---

## Next Steps

- Try your first interview transcription!
- Customize the template for your needs
- Share feedback and suggestions
- Consider deploying to production

Happy interviewing! 🎤📝

