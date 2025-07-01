
import React, { useState, useEffect, useRef } from 'react';
import { LoadingSpinner } from './LoadingSpinner'; 
import { SUPPORTED_LANGUAGES } from '../constants'; // Import supported languages

// Minimal interfaces for SpeechRecognition API to satisfy TypeScript
interface CustomSpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: { transcript: string }; 
  length: number; 
}

interface CustomSpeechRecognitionResultList {
  [index: number]: CustomSpeechRecognitionResult;
  length: number;
  item(index: number): CustomSpeechRecognitionResult;
}

interface CustomSpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: CustomSpeechRecognitionResultList;
}

interface CustomSpeechRecognitionErrorEvent extends Event {
  readonly error: string; 
  readonly message: string;
}

interface ISpeechRecognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((this: ISpeechRecognition, ev: CustomSpeechRecognitionEvent) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: CustomSpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  currentLanguage: string; 
  onLanguageChange: (languageCode: string) => void; // New prop for language change
}

// Mic Icon SVG
const MicIcon: React.FC<{ className?: string; isListening?: boolean }> = ({ className, isListening }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    {isListening ? (
      <path d="M12 18.75a6 6 0 0 0 6-6v-1.5a6 6 0 0 0-12 0v1.5a6 6 0 0 0 6 6ZM12 6.75a4.5 4.5 0 0 1 4.5 4.5v1.5a4.5 4.5 0 0 1-9 0v-1.5a4.5 4.5 0 0 1 4.5-4.5Z" />
    ) : (
      <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
    )}
    <path d="M6 10.5a.75.75 0 0 1 .75.75v.75a4.5 4.5 0 0 0 9 0v-.75a.75.75 0 0 1 1.5 0v.75a6 6 0 1 1-12 0v-.75A.75.75 0 0 1 6 10.5Z" />
  </svg>
);

const SendIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </svg>
);

const LanguageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M12.75 15a.75.75 0 0 0 0-1.5H7.065A4.452 4.452 0 0 18.15 8.397a.75.75 0 0 0 1.1-.976A5.953 5.953 0 0 0 7.065 6.75H12.75a.75.75 0 0 0 0-1.5H6.336a.75.75 0 0 0-.75.75V15c0 .414.336.75.75.75h7.536A4.452 4.452 0 0 116.4 20.603a.75.75 0 0 0-1.1.976A5.953 5.953 0 0 0 16.536 22.5H12a.75.75 0 0 0-.75-.75V15h1.5Z" />
    <path d="M18 6.75h1.835A2.965 2.965 0 0 1 22.5 9.493V15a2.965 2.965 0 0 1-2.665 2.743A2.965 2.965 0 0 1 17.085 15v-1.03a.75.75 0 0 0-.464-.693.75.75 0 0 0-.82.115L15 14.25v-1.5l.801-.801A.75.75 0 0 0 16.5 11.25V9.75a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0 0 1.5h2.25V12l-1.952 1.952a.75.75 0 0 0 .53 1.28L15 15.25v2.25l1.952-1.952a.75.75 0 0 0-.53-1.28L15 14.25V12l1.5-1.5V9a.75.75 0 0 1 .75-.75H18a.75.75 0 0 0 0-1.5Z" />
  </svg>
);


export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, currentLanguage, onLanguageChange }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech Recognition API not supported by this browser.");
      return;
    }

    const recognition: ISpeechRecognition = new SpeechRecognitionAPI();
    recognition.lang = currentLanguage;
    recognition.interimResults = true; 
    recognition.continuous = false; 

    recognition.onresult = (event: CustomSpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }
      setText(prevText => {
        const baseText = finalTranscript ? prevText.substring(0, prevText.length - (interimTranscript.length > 0 ? interimTranscript.length : 0)) + finalTranscript : prevText;
        return baseText + (event.results[event.results.length -1].isFinal ? "" : interimTranscript);
      });
    };

    recognition.onerror = (event: CustomSpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error, event.message);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [currentLanguage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
        alert("Speech recognition is not available in your browser or has not initialized.");
        return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false); 
    } else {
      try {
        setText(''); 
        recognitionRef.current.lang = currentLanguage; 
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Error starting speech recognition:", e);
        setIsListening(false);
        alert("Could not start speech recognition. Please ensure microphone permissions are granted and try again.");
      }
    }
  };
  
  const handleLanguageSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onLanguageChange(event.target.value);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-3 border-t flex items-center space-x-2" // Reduced padding slightly
      style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--app-accent)' }}
    >
      <div className="relative">
        <select
          value={currentLanguage}
          onChange={handleLanguageSelectChange}
          disabled={isLoading}
          className="appearance-none p-3 pr-8 border rounded-lg focus:ring-2 focus:outline-none text-sm" // Added pr-8 for icon space
          style={{ 
            backgroundColor: 'var(--input-bg)', 
            color: 'var(--input-text)',
            borderColor: 'var(--input-border)',
            // @ts-ignore
            '--tw-ring-color': 'var(--app-accent)',
            opacity: isLoading ? 0.6 : 1,
          }}
          aria-label="Select chat language"
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <div 
          className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
          style={{ color: 'var(--input-text)'}}
        >
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 0 1-1.576 0S5.924 9.581 5.516 9.163c-.409-.418-.436-1.17 0-1.615z"/></svg>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleListening}
        disabled={isLoading || !recognitionRef.current}
        className="p-3 rounded-lg flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{ 
          backgroundColor: isListening ? 'var(--app-accent)' : 'var(--button-primary-bg)',
          color: isListening ? 'var(--app-accent-text)' : 'var(--button-primary-text)',
          opacity: (isLoading || !recognitionRef.current) ? 0.6 : 1,
           // @ts-ignore
          '--tw-ring-color': 'var(--app-accent)',
           // @ts-ignore
          '--tw-ring-offset-color': 'var(--header-bg)'
        }}
        aria-label={isListening ? "Stop listening" : "Start voice input"}
        aria-pressed={isListening}
      >
        <MicIcon className="w-6 h-6" isListening={isListening}/>
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isListening ? "Listening..." : "Type or say your benefits question..."}
        className={`flex-grow p-3 border rounded-lg focus:ring-2 focus:outline-none`}
        style={{ 
          backgroundColor: 'var(--input-bg)', 
          color: 'var(--input-text)',
          borderColor: 'var(--input-border)',
          // @ts-ignore
          '--tw-ring-color': 'var(--app-accent)' 
        }}
        disabled={isLoading}
        aria-label="Chat input"
      />
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="p-3 rounded-lg flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{ 
          backgroundColor: 'var(--button-primary-bg)', 
          color: 'var(--button-primary-text)',
          opacity: isLoading || !text.trim() ? 0.6 : 1,
           // @ts-ignore
          '--tw-ring-color': 'var(--app-accent)',
           // @ts-ignore
          '--tw-ring-offset-color': 'var(--header-bg)'
        }}
        aria-label="Send message"
      >
        {isLoading && text.trim() ? <LoadingSpinner size="small" color={'var(--button-primary-text)'} /> : <SendIcon className="w-6 h-6" />}
      </button>
    </form>
  );
};
