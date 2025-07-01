
import React from 'react';

interface QuickQuestionsToggleProps {
  onClick: () => void;
  isFAQBarVisible: boolean;
}

const ArrowDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M9.47 6.03a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 7.81l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z" clipRule="evenodd" />
  </svg>
);


export const QuickQuestionsToggle: React.FC<QuickQuestionsToggleProps> = ({ onClick, isFAQBarVisible }) => {
  return (
    <button
      onClick={onClick}
      className="w-full px-3 py-2.5 text-sm font-medium flex items-center justify-between border-b cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-1"
      style={{
        backgroundColor: 'var(--header-bg)', // Same as FAQBar for consistency
        color: 'var(--app-text)',
        borderColor: 'var(--app-accent)',
        // @ts-ignore
        '--tw-ring-color': 'var(--app-accent)',
      }}
      aria-expanded={isFAQBarVisible}
      aria-controls="faq-bar-section" // Assuming FAQBar will have this id if needed for ARIA
    >
      <span>Quick Questions</span>
      {isFAQBarVisible ? <ArrowUpIcon /> : <ArrowDownIcon />}
    </button>
  );
};
