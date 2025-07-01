import React from 'react';

interface ErrorMessageProps {
  message: string;
  onClear?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClear }) => {
  if (!message) return null;

  // Standard error colors, generally theme-independent for high visibility
  const errorBgColor = 'bg-red-100';
  const errorBorderColor = 'border-red-500';
  const errorTextColor = 'text-red-700';
  const errorIconColor = 'text-red-500';
  const errorRingColor = 'focus:ring-red-400';
  const errorButtonHoverBg = 'hover:bg-red-200';


  return (
    <div className={`${errorBgColor} border-l-4 ${errorBorderColor} ${errorTextColor} p-4 mb-4 rounded-md shadow-md`} role="alert">
      <div className="flex">
        <div className="py-1">
          <svg className={`fill-current h-6 w-6 ${errorIconColor} mr-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/>
          </svg>
        </div>
        <div>
          <p className="font-bold">Error</p>
          <p className="text-sm">{message}</p>
        </div>
        {onClear && (
          <button 
            onClick={onClear} 
            className={`ml-auto -mx-1.5 -my-1.5 ${errorBgColor} ${errorIconColor} rounded-lg focus:ring-2 ${errorRingColor} p-1.5 ${errorButtonHoverBg} inline-flex h-8 w-8`}
            aria-label="Dismiss"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        )}
      </div>
    </div>
  );
};