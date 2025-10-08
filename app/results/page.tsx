'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import AudioPlayer from '@/components/AudioPlayer';
import TranscriptionView from '@/components/TranscriptionView';
import DocumentGenerator from '@/components/DocumentGenerator';

export default function ResultsPage() {
  const router = useRouter();
  const { audioUrl, transcription, setGeneratedDocument, resetContext } = useAppContext();

  useEffect(() => {
    // Redirect if no transcription data
    if (!transcription || !audioUrl) {
      router.push('/');
    }
  }, [transcription, audioUrl, router]);

  if (!transcription || !audioUrl) {
    return null;
  }

  const handleStartOver = () => {
    resetContext();
    router.push('/');
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-white">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-black">Interview Results</h1>
          <button
            onClick={handleStartOver}
            className="px-6 py-2 bg-secondary hover:bg-[#3f4d58] text-white rounded-lg transition-colors shadow-lg"
          >
            Start Over
          </button>
        </div>

        {/* Audio Player */}
        <div className="mb-8">
          <AudioPlayer audioUrl={audioUrl} />
        </div>

        {/* Two Column Layout: Transcription & Document Generator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Transcription */}
          <div className="flex flex-col">
            <TranscriptionView utterances={transcription.utterances} />
          </div>

          {/* Right Column: Document Generator */}
          <div className="flex flex-col">
            <DocumentGenerator
              utterances={transcription.utterances}
              onGenerated={setGeneratedDocument}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


