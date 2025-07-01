
import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { ChatMessage } from './ChatMessage';

interface ChatWindowProps {
  messages: Message[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div 
      className="space-y-4" // Simplified: Removed flex-grow, overflow-y-auto, specific height, p-4, shadow-inner, and explicit bg
                          // Parent in App.tsx now handles scrolling, padding, and visual styling of the scroll area.
    >
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
