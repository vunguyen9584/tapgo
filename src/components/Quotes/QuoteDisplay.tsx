import React from 'react';
import type { Quote } from '../../types/quotes';

interface QuoteDisplayProps {
  quote: Quote;
  className?: string;
}

export default function QuoteDisplay({ quote, className = '' }: QuoteDisplayProps) {
  return (
    <div className={`text-center space-y-4 ${className}`}>
      <blockquote className="relative">
        <svg
          className="absolute -top-2 -left-2 h-8 w-8 text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        
        <p className="text-lg font-medium text-gray-800 italic pl-6 pr-8 leading-relaxed">
          {quote.text}
        </p>
        
        <svg
          className="absolute -bottom-2 -right-2 h-8 w-8 text-gray-300 transform rotate-180"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </blockquote>
      
      {(quote.author || quote.source) && (
        <div className="text-sm text-gray-600 space-y-1">
          {quote.author && (
            <div className="font-medium">
              — {quote.author}
            </div>
          )}
          {quote.source && (
            <div className="text-xs text-gray-500">
              {quote.source}
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
        <span className="flex items-center">
          <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
            quote.difficulty === 'easy' ? 'bg-green-500' :
            quote.difficulty === 'medium' ? 'bg-yellow-500' :
            'bg-red-500'
          }`} />
          {quote.difficulty}
        </span>
        <span>•</span>
        <span>{quote.length} chars</span>
        {quote.category && (
          <>
            <span>•</span>
            <span>{quote.category}</span>
          </>
        )}
      </div>
    </div>
  );
}
