import React from 'react';
import { useUser } from '../hooks/useUser';
import QuoteMode from '../components/Quotes/QuoteMode';
import type { QuoteSession } from '../types/quotes';

export default function QuotePage() {
  const user = useUser();

  const handleSessionComplete = (session: QuoteSession) => {
    console.log('Quote session completed:', session);
    // Here you could show results, update UI, etc.
  };

  return (
    <div className="min-h-screen bg-[#1A1C29] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Quote Mode</h1>
            <p className="text-gray-400">
              Practice typing with real quotes from various authors and sources.
            </p>
          </div>

          {/* Quote Mode Component */}
          <QuoteMode
            userId={user?.uid}
            onSessionComplete={handleSessionComplete}
            className="bg-[#23263A] rounded-2xl p-6 shadow-xl border border-gray-800"
          />
        </div>
      </div>
    </div>
  );
}
