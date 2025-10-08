import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Interview Transcription & Debrief Generator',
  description: 'Transcribe interview recordings with speaker separation and generate structured AI-powered debriefs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black`}>
        <AppProvider>
          {/* Header with Logo */}
          <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center h-14">
                <div className="flex items-center gap-2">
                  <img src="/logo.svg" alt="Logo" className="h-7 w-auto" />
                  <span className="text-sm font-medium text-secondary flex items-center pt-[5px]">
                    Interview Debrief Generator
                  </span>
                </div>
              </div>
            </div>
          </header>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}


