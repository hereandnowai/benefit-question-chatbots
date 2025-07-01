import React from 'react';
import type { FAQItem } from '../types';

interface FAQBarProps {
  faqs: FAQItem[];
  onSelectFAQ: (question: string) => void;
  isLoading: boolean;
}

export const FAQBar: React.FC<FAQBarProps> = ({ faqs, onSelectFAQ, isLoading }) => {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div 
      className="px-2 py-2 border-b no-scrollbar"
      style={{ 
        backgroundColor: 'var(--header-bg)', 
        borderColor: 'var(--app-accent)', 
        overflowX: 'auto',
        whiteSpace: 'nowrap', // Ensures items stay in a single line for horizontal scrolling
      }}
      role="toolbar"
      aria-label="Frequently Asked Questions"
    >
      <div className="flex space-x-2">
        {faqs.map((faq) => (
          <button
            key={faq.id}
            onClick={() => onSelectFAQ(faq.question)}
            disabled={isLoading}
            className="py-1.5 px-3 text-xs font-medium rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{
              backgroundColor: 'var(--button-primary-bg)',
              color: 'var(--button-primary-text)',
              opacity: isLoading ? 0.6 : 1,
              // @ts-ignore
              '--tw-ring-color': 'var(--app-accent)',
              // @ts-ignore
              '--tw-ring-offset-color': 'var(--header-bg)',
              flexShrink: 0, // Prevent buttons from shrinking, important for overflowX: 'auto'
            }}
            aria-label={`Ask: ${faq.question}`}
          >
            {faq.question}
          </button>
        ))}
      </div>
    </div>
  );
};
