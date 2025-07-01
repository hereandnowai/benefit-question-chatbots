import React, { useState, useEffect } from 'react';
import type { AppSettings, ThemeName, FontSize, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, DEFAULT_SETTINGS } from '../constants';


interface SettingsPageProps {
  currentSettings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onNavigateHome: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentSettings, onSaveSettings, onNavigateHome }) => {
  const [theme, setTheme] = useState<ThemeName>(currentSettings.theme);
  const [fontSize, setFontSize] = useState<FontSize>(currentSettings.fontSize);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(currentSettings.notificationsEnabled);
  const [language, setLanguage] = useState<string>(currentSettings.language || DEFAULT_SETTINGS.language);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  useEffect(() => {
    setTheme(currentSettings.theme);
    setFontSize(currentSettings.fontSize);
    setNotificationsEnabled(currentSettings.notificationsEnabled);
    setLanguage(currentSettings.language || DEFAULT_SETTINGS.language);
  }, [currentSettings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({ theme, fontSize, notificationsEnabled, language });
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const formControlBaseClass = "block w-full p-2.5 rounded-lg border focus:ring-2 focus:outline-none";
  const labelClass = "block mb-2 text-sm font-medium";
  const radioLabelClass = "ml-2 text-sm font-medium";
  const fieldsetLegendClass = "text-lg font-semibold mb-2";

  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    color: 'var(--input-text)',
    borderColor: 'var(--input-border)',
    accentColor: 'var(--app-accent)' // For radio/checkbox checks
  };
  const focusRingStyle = {
    // @ts-ignore
    '--tw-ring-color': 'var(--app-accent)'
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto" style={{ color: 'var(--app-text)'}}>
      <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--app-accent)'}}>Application Settings</h2>

      {showSuccessMessage && (
        <div 
          className="p-4 mb-4 text-sm rounded-lg" 
          role="alert"
          style={{ backgroundColor: 'var(--app-accent)', color: 'var(--app-accent-text)'}}
        >
          <span className="font-medium">Success!</span> Settings saved.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Language Settings */}
        <fieldset className="p-4 rounded-lg" style={{ borderColor: 'var(--card-border)', borderWidth: '1px' }}>
          <legend className={fieldsetLegendClass} style={{ color: 'var(--app-text)'}}>Language</legend>
          <div>
            <label htmlFor="language-select" className={labelClass} style={{ color: 'var(--app-text)'}}>Preferred Language</label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`${formControlBaseClass}`}
              style={{...inputStyle, ...focusRingStyle}}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </fieldset>
        
        {/* Theme Settings */}
        <fieldset className="p-4 rounded-lg" style={{ borderColor: 'var(--card-border)', borderWidth: '1px' }}>
          <legend className={fieldsetLegendClass} style={{ color: 'var(--app-text)'}}>Theme</legend>
          <div className="flex items-center space-x-4">
            <div>
              <input 
                type="radio" 
                id="theme-light" 
                name="theme" 
                value="light" 
                checked={theme === 'light'} 
                onChange={() => setTheme('light')}
                className="w-4 h-4 focus:ring-2"
                style={{...inputStyle, ...focusRingStyle}}
              />
              <label htmlFor="theme-light" className={radioLabelClass} style={{ color: 'var(--app-text)'}}>Light</label>
            </div>
            <div>
              <input 
                type="radio" 
                id="theme-dark" 
                name="theme" 
                value="dark" 
                checked={theme === 'dark'} 
                onChange={() => setTheme('dark')}
                className="w-4 h-4 focus:ring-2"
                style={{...inputStyle, ...focusRingStyle}}
              />
              <label htmlFor="theme-dark" className={radioLabelClass} style={{ color: 'var(--app-text)'}}>Dark</label>
            </div>
          </div>
        </fieldset>

        {/* Font Size Settings */}
        <fieldset className="p-4 rounded-lg" style={{ borderColor: 'var(--card-border)', borderWidth: '1px' }}>
          <legend className={fieldsetLegendClass} style={{ color: 'var(--app-text)'}}>Font Size</legend>
          <div className="flex items-center space-x-4">
            <div>
              <input 
                type="radio" 
                id="font-small" 
                name="fontSize" 
                value="small" 
                checked={fontSize === 'small'} 
                onChange={() => setFontSize('small')}
                className="w-4 h-4 focus:ring-2"
                style={{...inputStyle, ...focusRingStyle}}
              />
              <label htmlFor="font-small" className={radioLabelClass} style={{ color: 'var(--app-text)'}}>Small</label>
            </div>
            <div>
              <input 
                type="radio" 
                id="font-medium" 
                name="fontSize" 
                value="medium" 
                checked={fontSize === 'medium'} 
                onChange={() => setFontSize('medium')}
                className="w-4 h-4 focus:ring-2"
                style={{...inputStyle, ...focusRingStyle}}
              />
              <label htmlFor="font-medium" className={radioLabelClass} style={{ color: 'var(--app-text)'}}>Medium</label>
            </div>
            <div>
              <input 
                type="radio" 
                id="font-large" 
                name="fontSize" 
                value="large" 
                checked={fontSize === 'large'} 
                onChange={() => setFontSize('large')}
                className="w-4 h-4 focus:ring-2"
                style={{...inputStyle, ...focusRingStyle}}
              />
              <label htmlFor="font-large" className={radioLabelClass} style={{ color: 'var(--app-text)'}}>Large</label>
            </div>
          </div>
        </fieldset>

        {/* Notification Settings */}
        <fieldset className="p-4 rounded-lg" style={{ borderColor: 'var(--card-border)', borderWidth: '1px' }}>
          <legend className={fieldsetLegendClass} style={{ color: 'var(--app-text)'}}>Notifications</legend>
          <div className="flex items-center">
            <input 
              id="notifications-enabled" 
              type="checkbox" 
              checked={notificationsEnabled} 
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 rounded focus:ring-2"
              style={{...inputStyle, ...focusRingStyle}}
            />
            <label htmlFor="notifications-enabled" className={radioLabelClass} style={{ color: 'var(--app-text)'}}>Enable notification sounds (placeholder)</label>
          </div>
        </fieldset>
        
        <div className="flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <button 
            type="submit" 
            className="w-full sm:w-auto py-2.5 px-6 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
            style={{ 
              backgroundColor: 'var(--button-primary-bg)', 
              color: 'var(--button-primary-text)',
              // @ts-ignore
              '--tw-ring-color': 'var(--app-accent)',
              // @ts-ignore
              '--tw-ring-offset-color': 'var(--app-bg)'
            }}
          >
            Save Settings
          </button>
          <button 
            type="button" 
            onClick={onNavigateHome}
            className="w-full sm:w-auto py-2.5 px-6 text-sm font-medium rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
            style={{ 
              backgroundColor: 'transparent',
              color: 'var(--app-text)',
              borderColor: 'var(--input-border)',
              // @ts-ignore
              '--tw-ring-color': 'var(--app-accent)',
              // @ts-ignore
              '--tw-ring-offset-color': 'var(--app-bg)'
            }}
          >
            Back to Home
          </button>
        </div>
      </form>
    </div>
  );
};