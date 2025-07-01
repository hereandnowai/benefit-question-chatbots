import React, { useState } from 'react';
import type { ChatSessionRecord, Message } from '../types';
import { ChatMessage } from './ChatMessage'; // Re-use ChatMessage for displaying messages

interface HistoryPageProps {
  chatHistory: ChatSessionRecord[];
  onViewSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNavigateHome: () => void;
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString(undefined, { 
    year: 'numeric', month: 'short', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  });
};

export const HistoryPage: React.FC<HistoryPageProps> = ({ chatHistory, onViewSession, onDeleteSession, onNavigateHome }) => {
  const [selectedSession, setSelectedSession] = useState<ChatSessionRecord | null>(null);

  if (selectedSession) {
    return (
      <div className="p-4 md:p-6" style={{ color: 'var(--app-text)' }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--app-accent)'}}>
              Chat from: {formatDate(selectedSession.startTime)}
            </h2>
            <p className="text-sm" style={{ color: 'var(--app-text-muted)'}}>Language: {selectedSession.languageName}</p>
          </div>
          <button
            onClick={() => setSelectedSession(null)}
            className="py-2 px-4 text-sm font-medium rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
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
            &larr; Back to History List
          </button>
        </div>
        <div 
          className="space-y-4 p-4 rounded-lg shadow-inner overflow-y-auto max-h-[calc(100vh-220px)]" // Adjusted max-h for new line
          style={{ backgroundColor: 'var(--app-bg)' }}
        >
          {selectedSession.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto" style={{ color: 'var(--app-text)'}}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold" style={{ color: 'var(--app-accent)'}}>Chat History</h2>
        <button
            onClick={onNavigateHome}
            className="py-2 px-4 text-sm font-medium rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
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

      {chatHistory.length === 0 ? (
        <p className="text-center text-lg" style={{ color: 'var(--app-text-muted)'}}>No chat history found.</p>
      ) : (
        <ul className="space-y-4">
          {chatHistory.map((session) => (
            <li 
              key={session.id} 
              className="p-4 rounded-lg shadow-md flex justify-between items-center transition-all hover:shadow-xl"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                color: 'var(--card-text)', 
                borderColor: 'var(--card-border)',
                borderWidth: '1px'
              }}
            >
              <div>
                <p className="font-semibold">Chat with {session.companyName}</p>
                <p className="text-sm" style={{ color: 'var(--app-text-muted)'}}>
                  {formatDate(session.startTime)} - {session.messages.length} message(s)
                </p>
                 <p className="text-xs" style={{ color: 'var(--app-text-muted)'}}>Language: {session.languageName}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setSelectedSession(session)}
                  className="py-1.5 px-3 text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1"
                  style={{ 
                    backgroundColor: 'var(--button-primary-bg)', 
                    color: 'var(--button-primary-text)',
                    // @ts-ignore
                    '--tw-ring-color': 'var(--app-accent)',
                    // @ts-ignore
                    '--tw-ring-offset-color': 'var(--card-bg)'
                   }}
                >
                  View
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this chat session?")) {
                      onDeleteSession(session.id);
                    }
                  }}
                  className="py-1.5 px-3 text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1"
                  style={{ 
                    backgroundColor: 'var(--app-text-muted)', 
                    color: 'var(--app-bg)', 
                     // @ts-ignore
                    '--tw-ring-color': 'var(--app-accent)',
                     // @ts-ignore
                    '--tw-ring-offset-color': 'var(--card-bg)'
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};