'use client';

import { useState } from 'react';
import { TranscriptionUtterance } from '@/context/AppContext';

interface DocumentGeneratorProps {
  utterances: TranscriptionUtterance[];
  onGenerated: (document: string) => void;
}

export default function DocumentGenerator({ utterances, onGenerated }: DocumentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          utterances: utterances,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate document');
      }

      const data = await response.json();
      setGeneratedDoc(data.document);
      onGenerated(data.document);
    } catch (err) {
      setError('Failed to generate document. Please try again.');
      console.error('Generate error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedDoc) {
      navigator.clipboard.writeText(generatedDoc);
      alert('Document copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (generatedDoc) {
      const blob = new Blob([generatedDoc], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'interview-debrief.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-lg p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-black">AI Interview Debrief</h2>
      
      {!generatedDoc ? (
        <div className="text-center py-12 flex flex-col items-center justify-center flex-grow">
          <p className="text-secondary mb-6 text-lg">
            Generate a structured interview debrief from the transcription using AI
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-3 bg-primary hover:bg-[#e55525] text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
          >
            {isGenerating ? (
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
                Generating...
              </span>
            ) : (
              'Generate Interview Debrief'
            )}
          </button>
          {error && (
            <p className="text-red-500 mt-4">{error}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col flex-grow">
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-secondary hover:bg-[#3f4d58] text-white rounded-lg transition-colors shadow"
            >
              📋 Copy
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-primary hover:bg-[#e55525] text-white rounded-lg transition-colors shadow"
            >
              ⬇️ Download
            </button>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 overflow-y-auto flex-grow" style={{ maxHeight: 'calc(100vh - 400px)', minHeight: '500px' }}>
            <pre className="whitespace-pre-wrap text-sm text-black leading-relaxed font-sans">
              {generatedDoc}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}


