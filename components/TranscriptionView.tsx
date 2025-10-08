'use client';

import { TranscriptionUtterance } from '@/context/AppContext';
import { formatTimestamp } from '@/lib/utils';

interface TranscriptionViewProps {
  utterances: TranscriptionUtterance[];
}

export default function TranscriptionView({ utterances }: TranscriptionViewProps) {
  const speakerColors: { [key: string]: string } = {};
  const colorClasses = [
    'bg-orange-100 text-primary border-primary',
    'bg-blue-100 text-blue-700 border-blue-700',
    'bg-green-100 text-green-700 border-green-700',
    'bg-purple-100 text-purple-700 border-purple-700',
    'bg-pink-100 text-pink-700 border-pink-700',
    'bg-indigo-100 text-indigo-700 border-indigo-700',
  ];

  // Assign colors to speakers
  utterances.forEach((utt, index) => {
    if (!speakerColors[utt.speaker]) {
      const colorIndex = Object.keys(speakerColors).length % colorClasses.length;
      speakerColors[utt.speaker] = colorClasses[colorIndex];
    }
  });

  const handleExport = () => {
    // Format transcription as text
    const transcriptionText = utterances
      .map((utt) => {
        const timestamp = formatTimestamp(utt.start);
        return `[${timestamp}] ${utt.speaker}: ${utt.text}`;
      })
      .join('\n\n');

    // Create and download file
    const blob = new Blob([transcriptionText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview-transcription.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-black">Transcription</h2>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-secondary hover:bg-[#3f4d58] text-white text-sm rounded-lg transition-colors shadow"
        >
          ⬇️ Export
        </button>
      </div>
      
      <div className="space-y-3 overflow-y-auto flex-grow pr-2" style={{ maxHeight: 'calc(100vh - 400px)', minHeight: '500px' }}>
        {utterances.map((utterance, index) => (
          <div
            key={index}
            className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <div className="flex-shrink-0">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                  speakerColors[utterance.speaker]
                }`}
              >
                {utterance.speaker}
              </span>
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-secondary font-medium">
                  {formatTimestamp(utterance.start)}
                </span>
              </div>
              <p className="text-black leading-relaxed">
                {utterance.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


