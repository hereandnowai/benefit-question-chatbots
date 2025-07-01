import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string; // Can be Tailwind color class OR a CSS variable string like 'var(--app-text)'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', color }) => {
  let spinnerSizeClass = 'h-8 w-8';
  if (size === 'small') spinnerSizeClass = 'h-5 w-5';
  if (size === 'large') spinnerSizeClass = 'h-12 w-12';

  // If color is a CSS variable string, use it directly. Otherwise, assume it's for Tailwind or default.
  // For this component, direct style application is more robust for var().
  const spinnerStyle: React.CSSProperties = {
    borderColor: color || 'currentColor', // currentColor will inherit from parent
    borderBottomColor: 'transparent',
  };
  
  // If color is specifically a CSS var, it will be applied directly.
  // If color is a Tailwind class name, it won't apply here directly but might be set by parent.
  // Default to currentColor allows theme to control it easily.

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full ${spinnerSizeClass} border-b-2`}
        style={spinnerStyle}
      ></div>
    </div>
  );
};