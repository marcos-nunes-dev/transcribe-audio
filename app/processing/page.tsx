'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const { setTranscription } = useAppContext();
  
  const [status, setStatus] = useState<string>('queued');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) {
      router.push('/');
      return;
    }

    let intervalId: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/status?jobId=${jobId}`);
        
        if (!response.ok) {
          throw new Error('Failed to check status');
        }

        const data = await response.json();
        setStatus(data.status);

        if (data.status === 'completed') {
          // Save transcription to context
          setTranscription(data.data);
          
          // Stop polling
          clearInterval(intervalId);
          
          // Navigate to results
          setTimeout(() => {
            router.push('/results');
          }, 500);
        } else if (data.status === 'error') {
          setError(data.error || 'Transcription failed');
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error('Status check error:', err);
        setError('Failed to check transcription status');
        clearInterval(intervalId);
      }
    };

    // Initial check
    checkStatus();

    // Poll every 3 seconds
    intervalId = setInterval(checkStatus, 3000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobId, router, setTranscription]);

  const getStatusMessage = () => {
    switch (status) {
      case 'queued':
        return 'Your audio is queued for processing...';
      case 'processing':
        return 'Transcribing audio and separating speakers...';
      case 'completed':
        return 'Processing complete! Redirecting...';
      case 'error':
        return 'An error occurred during processing.';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-8 text-black">Processing Your Audio</h1>
        
        {error ? (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-6 mb-8">
            <p className="text-xl font-semibold mb-2">Error</p>
            <p>{error}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-2 bg-primary hover:bg-[#e55525] text-white rounded-lg transition-colors shadow-lg"
            >
              Start Over
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-8">
              <svg
                className="animate-spin h-16 w-16 text-primary"
                viewBox="0 0 24 24"
              >
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
            </div>

            <p className="text-xl text-secondary mb-4">
              {getStatusMessage()}
            </p>

            <div className="bg-orange-50 border border-primary/30 rounded-lg p-6">
              <p className="text-sm text-black">
                <strong>Status:</strong> {status}
              </p>
              <p className="text-sm text-secondary mt-2">
                This may take a few minutes depending on the length of your audio file.
                Please don't close this page.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-8 text-black">Loading...</h1>
        </div>
      </div>
    }>
      <ProcessingContent />
    </Suspense>
  );
}


