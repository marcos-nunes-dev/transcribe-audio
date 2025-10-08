'use client';

import { useState, useRef } from 'react';
import { formatFileSize } from '@/lib/utils';

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
}

export default function AudioUploader({ onFileSelect }: AudioUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if it's an audio file
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file');
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-4 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200 bg-white
          ${isDragging 
            ? 'border-primary bg-orange-50' 
            : 'border-gray-300 hover:border-primary'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          
          <div>
            <p className="text-xl font-semibold mb-2 text-black">
              {selectedFile ? 'File Selected!' : 'Drop your audio file here'}
            </p>
            <p className="text-secondary">
              or click to browse
            </p>
          </div>

          {selectedFile && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-medium text-black">{selectedFile.name}</p>
              <p className="text-sm text-secondary mt-1">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          )}

          <p className="text-sm text-secondary mt-2">
            Supports: MP3, WAV, M4A, FLAC, OGG, and more
          </p>
        </div>
      </div>
    </div>
  );
}


