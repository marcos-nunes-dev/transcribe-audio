'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface TranscriptionUtterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

interface AppContextType {
  audioFile: File | null;
  audioUrl: string | null;
  transcriptionJobId: string | null;
  transcription: {
    utterances: TranscriptionUtterance[];
    fullText: string;
  } | null;
  generatedDocument: string | null;
  setAudioFile: (file: File | null) => void;
  setAudioUrl: (url: string | null) => void;
  setTranscriptionJobId: (id: string | null) => void;
  setTranscription: (transcription: { utterances: TranscriptionUtterance[]; fullText: string } | null) => void;
  setGeneratedDocument: (doc: string | null) => void;
  resetContext: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcriptionJobId, setTranscriptionJobId] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<{
    utterances: TranscriptionUtterance[];
    fullText: string;
  } | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);

  const resetContext = () => {
    setAudioFile(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setTranscriptionJobId(null);
    setTranscription(null);
    setGeneratedDocument(null);
  };

  return (
    <AppContext.Provider
      value={{
        audioFile,
        audioUrl,
        transcriptionJobId,
        transcription,
        generatedDocument,
        setAudioFile,
        setAudioUrl,
        setTranscriptionJobId,
        setTranscription,
        setGeneratedDocument,
        resetContext,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}


