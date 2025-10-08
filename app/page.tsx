'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AudioUploader from '@/components/AudioUploader';
import { useAppContext } from '@/context/AppContext';

export default function HomePage() {
  const router = useRouter();
  const { setAudioFile, setAudioUrl, setTranscriptionJobId } = useAppContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Create blob URL for audio playback
      const audioUrl = URL.createObjectURL(selectedFile);
      setAudioFile(selectedFile);
      setAudioUrl(audioUrl);

      // Upload file to AssemblyAI
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const { upload_url } = await uploadResponse.json();

      // Create transcription job
      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audio_url: upload_url }),
      });

      if (!transcribeResponse.ok) {
        throw new Error('Failed to start transcription');
      }

      const { job_id } = await transcribeResponse.json();
      setTranscriptionJobId(job_id);

      // Navigate to processing page
      router.push(`/processing?jobId=${job_id}`);
    } catch (err) {
      setError('Failed to upload and process file. Please try again.');
      console.error('Upload error:', err);
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-black">
            Interview Transcription & Debrief Generator
          </h1>
          <p className="text-xl text-secondary">
            Upload your interview recording to transcribe with speaker separation and generate AI-powered structured debriefs
          </p>
        </div>

        <AudioUploader onFileSelect={handleFileSelect} />

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="px-8 py-4 bg-primary hover:bg-[#e55525] text-white font-semibold text-lg rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </span>
            ) : (
              'Start Transcription'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


