import React, { useState } from 'react';
import TypingEngine from '../components/TypingEngine';
import type { TypingSession, TypingMetrics } from '../types/typing';

export default function TypingEngineDemo() {
  const [sessionResults, setSessionResults] = useState<{
    session: TypingSession | null;
    metrics: TypingMetrics | null;
  }>({ session: null, metrics: null });

  const targetText = "The quick brown fox jumps over the lazy dog.";

  const handleSessionComplete = (session: TypingSession, metrics: TypingMetrics) => {
    console.log('Session completed:', session);
    console.log('Metrics:', metrics);
    setSessionResults({ session, metrics });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">TypingEngine Demo</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Type the following text:</h2>
          <div className="text-lg mb-6 p-4 bg-gray-700 rounded">
            {targetText}
          </div>
          
          <TypingEngine
            targetText={targetText}
            onSessionComplete={handleSessionComplete}
            duration={60}
          />
        </div>

        {sessionResults.session && sessionResults.metrics && (
          <div className="bg-green-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Session Completed!</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Session Data</h3>
                <ul className="text-sm space-y-1">
                  <li>Duration: {sessionResults.session.duration}s</li>
                  <li>Characters Typed: {sessionResults.session.typedText.length}</li>
                  <li>Target Length: {sessionResults.session.targetText.length}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Performance Metrics</h3>
                <ul className="text-sm space-y-1">
                  <li>WPM: {sessionResults.metrics.wpm}</li>
                  <li>Accuracy: {sessionResults.metrics.accuracy}%</li>
                  <li>Net WPM: {sessionResults.metrics.netWpm}</li>
                  <li>Correct Characters: {sessionResults.metrics.correctChars}</li>
                  <li>Incorrect Characters: {sessionResults.metrics.incorrectChars}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
