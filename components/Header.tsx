import React from 'react';
import { BRAND_INFO } from '../constants';

interface HeaderProps {
  onNavigateHome: () => void;
  onNavigateToSettings: () => void;
  onNavigateToHistory: () => void; // Added for history navigation
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome, onNavigateToSettings, onNavigateToHistory }) => {
  const buttonBaseClass = "px-3 py-2 rounded-md hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--header-bg)] focus:ring-[var(--app-accent)] text-sm font-medium";
  return (
    <header 
      className="p-4 shadow-md flex items-center justify-between" 
      style={{ backgroundColor: 'var(--header-bg)', color: 'var(--header-text)' }}
    >
      <button onClick={onNavigateHome} className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--header-bg)] focus:ring-[var(--app-accent)] rounded-md p-1">
        <img 
          src={BRAND_INFO.brand.logo.title || 'https://picsum.photos/150/50'} 
          alt={`${BRAND_INFO.brand.appName} Logo`} 
          className="h-10 object-contain" 
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/150/50')}
        />
        <h1 className="text-2xl font-bold">{BRAND_INFO.brand.appName}</h1>
      </button>
      <nav className="flex items-center space-x-2 sm:space-x-4">
        <button 
          onClick={onNavigateToHistory} 
          aria-label="View Chat History"
          className={buttonBaseClass}
          style={{ color: 'var(--header-text)'}}
        >
          History
        </button>
        <button 
          onClick={onNavigateToSettings} 
          aria-label="Open Settings"
          className={buttonBaseClass}
          style={{ color: 'var(--header-text)'}}
        >
          Settings
        </button>
      </nav>
    </header>
  );
};