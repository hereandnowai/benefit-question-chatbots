
import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const UserIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" style={{ color: 'var(--app-text-muted)'}}>
    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438Z" clipRule="evenodd" />
  </svg>
);


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  // Function to process a single line for bold markdown
  const processLineForBold = (line: string) => {
    // Split the line by the bold markdown pattern, keeping the delimiters.
    // e.g., "Hello **world**!" becomes ["Hello ", "**world**", "!"]
    const parts = line.split(/(\*\*.*?\*\*)/g).filter(part => part.length > 0);

    return parts.map((part, index) => {
      // Check if the part is a bold markdown segment
      if (part.startsWith('**') && part.endsWith('**')) {
        // Extract the content between the asterisks and wrap in <strong>
        return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
      }
      // Otherwise, return the part as plain text
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  // Process the entire message text
  // 1. Split the message by newline characters ('\\n')
  // 2. For each line, process it for bold markdown
  // 3. Join lines with <br /> elements for display
  const formattedTextElements = message.text.split('\\n').map((line, lineIndex, arr) => (
    <React.Fragment key={lineIndex}>
      {processLineForBold(line)}
      {lineIndex < arr.length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div className={`flex items-end space-x-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <img
          src={message.avatar || 'https://picsum.photos/50/50'}
          alt="Bot Avatar"
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/bot/50/50')}
        />
      )}
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg shadow whitespace-pre-wrap break-words ${
          isUser
            ? 'rounded-br-none'
            : 'rounded-bl-none'
        }`}
        style={{ 
          backgroundColor: isUser ? 'var(--chat-bubble-user-bg)' : 'var(--chat-bubble-bot-bg)', 
          color: isUser ? 'var(--chat-bubble-user-text)' : 'var(--chat-bubble-bot-text)'
        }}
      >
        <p className="text-sm">{formattedTextElements}</p>
        <p 
          className={`text-xs mt-1 ${isUser ? 'text-right' : 'text-left'}`}
          style={{ color: 'var(--app-text-muted)' }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isUser && (
        <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--app-text-muted)'}}
        >
         <UserIcon />
        </div>
      )}
    </div>
  );
};
