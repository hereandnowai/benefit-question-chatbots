
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { HomePage } from './components/HomePage';
import { SettingsPage } from './components/SettingsPage';
import { HistoryPage } from './components/HistoryPage';
import { FAQBar } from './components/FAQBar'; 
import { QuickQuestionsToggle } from './components/QuickQuestionsToggle'; // Import QuickQuestionsToggle
import type { Message, AppSettings, ChatSessionRecord, SupportedLanguage, FAQItem } from './types';
import * as geminiService from './services/geminiService';
import { 
  BRAND_INFO, 
  INITIAL_BOT_PROMPT_MESSAGE, 
  LOCAL_STORAGE_SETTINGS_KEY, 
  DEFAULT_SETTINGS,
  LOCAL_STORAGE_CHAT_HISTORY_KEY,
  SUPPORTED_LANGUAGES,
  DEFAULT_FAQS 
} from './constants';

type PageName = 'home' | 'chat' | 'settings' | 'history';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentSessionLanguage, setCurrentSessionLanguage] = useState<string>(DEFAULT_SETTINGS.language);
  const [currentPage, setCurrentPage] = useState<PageName>('home');
  const [isFAQBarVisible, setIsFAQBarVisible] = useState<boolean>(false); 
  
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });

  const [chatHistory, setChatHistory] = useState<ChatSessionRecord[]>(() => {
    const savedHistory = localStorage.getItem(LOCAL_STORAGE_CHAT_HISTORY_KEY);
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory) as ChatSessionRecord[];
      return parsed.map(session => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
        languageCode: session.languageCode || DEFAULT_SETTINGS.language, 
        languageName: session.languageName || SUPPORTED_LANGUAGES.find(l => l.code === (session.languageCode || DEFAULT_SETTINGS.language))?.name || SUPPORTED_LANGUAGES[0].name,
        messages: session.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp) 
        }))
      }));
    }
    return [];
  });

  const companyName = BRAND_INFO.brand.organizationShortName || "our company";

  // Effect for mouse position tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x-pos', `${(event.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--mouse-y-pos', `${(event.clientY / window.innerHeight) * 100}%`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);
  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(appSettings));
    const styleElement = document.getElementById('global-app-styles') || document.createElement('style');
    styleElement.id = 'global-app-styles';
    
    const { theme, fontSize } = appSettings;
    let cssVariables = '';
    let gradientStyles = '';

    // Theme-dependent colors for gradient
    let gradientHighlightColorRgba = '';
    let gradientLinearStart = '';
    let gradientLinearMid = '';
    let gradientLinearEnd = '';

    if (theme === 'dark') {
      gradientHighlightColorRgba = '255, 223, 0'; // Golden
      gradientLinearStart = '#002020'; // Very Dark Teal
      gradientLinearMid = BRAND_INFO.brand.colors.secondary; // Dark Teal (#004040)
      gradientLinearEnd = '#001a33'; // Dark Teal/Blueish

      cssVariables = `
        :root {
          /* App Component Specific Backgrounds */
          --app-bg: ${BRAND_INFO.brand.colors.secondary}; /* Solid background for main content areas */
          /* General Theming */
          --app-text: #FFFFFF;
          --app-text-muted: #a0aec0; 
          --app-accent: ${BRAND_INFO.brand.colors.primary};
          --app-accent-text: ${BRAND_INFO.brand.colors.secondary};
          --card-bg: #FFFFFF;
          --card-text: ${BRAND_INFO.brand.colors.secondary};
          --card-border: ${BRAND_INFO.brand.colors.primary};
          --input-bg: #FFFFFF;
          --input-text: #000000;
          --input-border: ${BRAND_INFO.brand.colors.primary};
          --button-primary-bg: ${BRAND_INFO.brand.colors.primary};
          --button-primary-text: ${BRAND_INFO.brand.colors.secondary};
          --header-bg: ${BRAND_INFO.brand.colors.secondary}; /* Solid color for header */
          --header-text: ${BRAND_INFO.brand.colors.primary};
          --footer-bg: ${BRAND_INFO.brand.colors.secondary}; /* Solid color for footer */
          --footer-text: ${BRAND_INFO.brand.colors.primary};
          --chat-bubble-user-bg: var(--input-bg);
          --chat-bubble-user-text: var(--input-text);
          --chat-bubble-bot-bg: var(--input-bg);
          --chat-bubble-bot-text: var(--input-text);
          --scrollbar-track-bg: #002a2a; 
          --scrollbar-thumb-bg: ${BRAND_INFO.brand.colors.primary}; 
          --scrollbar-thumb-hover-bg: #FFEA70; 
          --link-text: ${BRAND_INFO.brand.colors.primary};
          --link-hover-text: #FFFAE0; 
        }
      `;
    } else { // Light theme
      gradientHighlightColorRgba = '0, 64, 64'; // Teal
      gradientLinearStart = '#E0F2F1'; // Very Light Teal/Cyan
      gradientLinearMid = '#B2DFDB'; // Light Teal
      gradientLinearEnd = '#A7FFEB'; // Very Light Green/Off-white

      cssVariables = `
        :root {
          /* App Component Specific Backgrounds */
          --app-bg: #F3F4F6; /* Solid background for main content areas */
          /* General Theming */
          --app-text: ${BRAND_INFO.brand.colors.secondary};
          --app-text-muted: #4a5568; 
          --app-accent: ${BRAND_INFO.brand.colors.secondary}; 
          --app-accent-text: #FFFFFF; 
          --card-bg: #FFFFFF;
          --card-text: ${BRAND_INFO.brand.colors.secondary};
          --card-border: ${BRAND_INFO.brand.colors.secondary};
          --input-bg: #FFFFFF;
          --input-text: #000000;
          --input-border: ${BRAND_INFO.brand.colors.secondary};
          --button-primary-bg: ${BRAND_INFO.brand.colors.secondary};
          --button-primary-text: #FFFFFF;
          --header-bg: ${BRAND_INFO.brand.colors.secondary}; /* Solid color for header */
          --header-text: ${BRAND_INFO.brand.colors.primary};
          --footer-bg: ${BRAND_INFO.brand.colors.secondary}; /* Solid color for footer */
          --footer-text: ${BRAND_INFO.brand.colors.primary};
          --chat-bubble-user-bg: var(--input-bg);
          --chat-bubble-user-text: var(--input-text);
          --chat-bubble-bot-bg: var(--input-bg);
          --chat-bubble-bot-text: var(--input-text);
          --scrollbar-track-bg: #e2e8f0; 
          --scrollbar-thumb-bg: ${BRAND_INFO.brand.colors.secondary}; 
          --scrollbar-thumb-hover-bg: #003333; 
          --link-text: ${BRAND_INFO.brand.colors.secondary};
          --link-hover-text: #003030; 
        }
      `;
    }

    // Dynamic background styles for the body
    gradientStyles = `
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        min-height: 100vh;
        background-image: 
          radial-gradient(circle at var(--mouse-x-pos, 50%) var(--mouse-y-pos, 50%), rgba(${gradientHighlightColorRgba}, 0.15) 0%, transparent 40%),
          linear-gradient(135deg, ${gradientLinearStart} 0%, ${gradientLinearMid} 50%, ${gradientLinearEnd} 100%);
        background-repeat: no-repeat, no-repeat;
        background-size: cover, 200% 200%; /* Radial covers, linear is larger for animation */
        background-position: center center, 0% 50%; /* Initial positions */
        animation: animatedBodyGradient 20s ease infinite;
        transition: background-image 0.5s ease-in-out; /* Smooth theme transitions */
        overflow: hidden; /* Prevent body scrollbars if content fits screen */
      }

      @keyframes animatedBodyGradient {
        0% { background-position: center center, 0% 50%; }
        50% { background-position: center center, 100% 50%; }
        100% { background-position: center center, 0% 50%; }
      }
    `;
    
    let baseFontSize = '16px'; 
    if (fontSize === 'small') baseFontSize = '14px';
    if (fontSize === 'large') baseFontSize = '18px';

    styleElement.innerHTML = `
      ${gradientStyles} /* Gradient styles applied to body */
      ${cssVariables} /* Theme variables for components */
      html {
        font-size: ${baseFontSize};
      }
      /* Ensure scrollbars within components use theme variables */
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: var(--scrollbar-track-bg); }
      ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb-bg); border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-thumb-hover-bg); }

      /* For hiding scrollbar on elements like FAQBar */
      .no-scrollbar::-webkit-scrollbar { display: none; width: 0; height: 0; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(styleElement);

  }, [appSettings]);

  const saveCurrentSessionToHistory = useCallback(() => {
    if (currentSessionId && messages.length > 0) {
      const existingSessionIndex = chatHistory.findIndex(session => session.id === currentSessionId);
      const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === currentSessionLanguage) || SUPPORTED_LANGUAGES[0];
      const sessionRecord: ChatSessionRecord = {
        id: currentSessionId,
        startTime: existingSessionIndex > -1 ? chatHistory[existingSessionIndex].startTime : new Date(),
        endTime: new Date(),
        messages: [...messages], 
        companyName: companyName,
        languageCode: langInfo.code,
        languageName: langInfo.name,
      };

      if (existingSessionIndex > -1) {
        const updatedHistory = [...chatHistory];
        updatedHistory[existingSessionIndex] = sessionRecord;
        setChatHistory(updatedHistory);
      } else {
        setChatHistory(prevHistory => [sessionRecord, ...prevHistory]);
      }
      console.log("Current session saved to history:", currentSessionId, "with language", langInfo.name);
    }
  }, [currentSessionId, messages, chatHistory, companyName, currentSessionLanguage]);

  const initializeChat = useCallback(async (languageCodeForSession: string, isNewSession: boolean = true, existingMessages?: Message[]) => {
    if (isNewSession && !existingMessages) {
      saveCurrentSessionToHistory();
    }
    
    console.log("Attempting to initialize chat. Language:", languageCodeForSession, "Is New Session:", isNewSession, "Has Existing Msgs:", !!existingMessages);
    setIsLoading(true);
    setError(null);

    let newChatSession: Chat | null = null;
    let newSessIdValue: string | null = null;

    try {
        newChatSession = await geminiService.startChatSession(companyName, languageCodeForSession);
        setChatSession(newChatSession);
        
        newSessIdValue = (isNewSession && !existingMessages) || !currentSessionId ? `session_${Date.now()}` : currentSessionId;
        if ((isNewSession && !existingMessages) || !currentSessionId) {
            setCurrentSessionId(newSessIdValue);
        }
        
        setCurrentSessionLanguage(languageCodeForSession);
        console.log("Chat session object created/updated. Session ID:", newSessIdValue, "Language:", languageCodeForSession);

        if (existingMessages && !isNewSession) {
          setMessages(existingMessages);
        } else {
          setMessages([]); 
          if (isNewSession && newChatSession) { 
            const initialBotResponseText = await geminiService.sendMessageToChat(newChatSession, INITIAL_BOT_PROMPT_MESSAGE);
            setMessages([{
                id: `bot_init_${Date.now()}`,
                text: initialBotResponseText,
                sender: 'bot',
                avatar: BRAND_INFO.brand.chatbot.avatar,
                timestamp: new Date(),
            }]);
          } else if (existingMessages) {
             setMessages(existingMessages);
          }
        }
    } catch (err) {
        console.error("Initialization error:", err);
        const errorMessage = (err instanceof Error) ? err.message : "An unknown error occurred during initialization.";
        setError(`Failed to initialize BenefitsBot. ${errorMessage}.`);
        if (isNewSession) {
          setMessages([]);
          setCurrentSessionId(null);
          setChatSession(null);
        }
    } finally {
        setIsLoading(false);
        console.log("Initialization process finished.");
    }
    return { initializedChat: newChatSession, initializedSessionId: newSessIdValue };
  }, [companyName, saveCurrentSessionToHistory, currentSessionId]); // Removed currentSessionLanguage from deps as it's set within


  useEffect(() => {
    if (currentPage === 'chat' && !currentSessionId && !isLoading) { 
      console.log("useEffect: currentPage is chat, no currentSessionId, initializing new chat with global default language", appSettings.language);
      initializeChat(appSettings.language, true); 
    }
  }, [currentPage, currentSessionId, initializeChat, appSettings.language, isLoading]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentPage === 'chat') {
        saveCurrentSessionToHistory();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentPage, saveCurrentSessionToHistory]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    let sessionToUse = chatSession;
    let sessionIdToUse = currentSessionId;
    let sessionLanguageToUse = currentSessionLanguage;


    if (!sessionToUse || !sessionIdToUse) {
      if (!isLoading) { 
        console.warn("handleSendMessage: Chat session not available. Attempting to initialize.");
        try {
          // Use appSettings.language if currentSessionLanguage is not set (e.g. first interaction)
          sessionLanguageToUse = currentSessionLanguage || appSettings.language;
          const { initializedChat, initializedSessionId } = await initializeChat(sessionLanguageToUse, true, []); 
          sessionToUse = initializedChat;
          sessionIdToUse = initializedSessionId;

          if (!sessionToUse || !initializedSessionId) {
            setError("Failed to initialize chat session. Please try again.");
            setIsLoading(false); 
            return;
          }
        } catch (initError) {
          console.error("handleSendMessage: Error during re-initialization:", initError);
          setError("Failed to connect to the bot. Please try again.");
          setIsLoading(false); 
          return;
        }
      } else {
        console.warn("handleSendMessage: Already loading, message dropped.");
        return; 
      }
    }
    
    if (!sessionToUse || !sessionIdToUse) {
        setError("Chat is not ready. Please try again later.");
        console.error("handleSendMessage: Session still not available after init attempt.");
        return;
    }

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const botResponseText = await geminiService.sendMessageToChat(sessionToUse, text);
      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        text: botResponseText,
        sender: 'bot',
        avatar: BRAND_INFO.brand.chatbot.avatar,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage = (err instanceof Error) ? err.message : "An unknown error occurred.";
      setError(`Sorry, I encountered an issue. ${errorMessage}. Please try again.`);
      const errorBotMessage: Message = {
        id: `bot_error_${Date.now()}`,
        text: `I'm having trouble responding right now. Please try again later. Details: ${errorMessage}`,
        sender: 'bot',
        avatar: BRAND_INFO.brand.chatbot.avatar,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChatInputLanguageChange = (newLangCode: string) => {
    if (newLangCode === currentSessionLanguage) return; 

    console.log(`Chat input language changed to: ${newLangCode}. Re-initializing session.`);
    saveCurrentSessionToHistory(); 
    
    // setCurrentSessionLanguage(newLangCode); // This will be set by initializeChat
    setCurrentSessionId(null); 
    setMessages([]); 
    setChatSession(null); 
    
    initializeChat(newLangCode, true); 
  };
  
  const handleSelectFAQ = async (question: string) => {
    if (isLoading && messages.length > 0) { 
        console.warn("Cannot select FAQ while an operation is in progress.");
        return;
    }
    await handleSendMessage(question);
  };

  const toggleFAQBarVisibility = () => {
    setIsFAQBarVisible(prev => !prev);
  };

  const navigateToHome = () => {
    if (currentPage === 'chat') saveCurrentSessionToHistory();
    setCurrentPage('home');
  }

  const navigateToChat = (sessionIdToLoad?: string) => {
    if (currentPage === 'chat' && (!sessionIdToLoad || sessionIdToLoad !== currentSessionId)) {
        saveCurrentSessionToHistory(); 
    }
    
    setCurrentPage('chat');

    if (sessionIdToLoad) {
        const sessionToLoad = chatHistory.find(s => s.id === sessionIdToLoad);
        if (sessionToLoad) {
            console.log("Loading session from history:", sessionIdToLoad, "Language:", sessionToLoad.languageName);
            // setCurrentSessionId(sessionToLoad.id); // Set by initializeChat
            // setCurrentSessionLanguage(sessionToLoad.languageCode); // Set by initializeChat
            setChatSession(null); 
            initializeChat(sessionToLoad.languageCode, false, sessionToLoad.messages)
              .then(({initializedSessionId}) => {
                 if (initializedSessionId) setCurrentSessionId(initializedSessionId);
              });
        } else {
            console.warn("Session ID to load not found in history. Starting a new chat with global default language.");
            setCurrentSessionId(null); 
            setChatSession(null);
            initializeChat(appSettings.language, true);
        }
    } else if (!currentSessionId) { 
        console.log("Navigating to chat for a new session with current language (or global default):", currentSessionLanguage || appSettings.language);
        setCurrentSessionId(null); 
        setChatSession(null);
        initializeChat(currentSessionLanguage || appSettings.language, true); 
    } else {
        // Chat already active, re-initialize to ensure context if language changed globally
        console.log("Re-activating existing chat, ensuring language context for session:", currentSessionLanguage);
        initializeChat(currentSessionLanguage, false, messages); 
    }
  };

  const navigateToSettings = () => {
    if (currentPage === 'chat') saveCurrentSessionToHistory();
    setCurrentPage('settings');
  }
  const navigateToHistory = () => {
    if (currentPage === 'chat') saveCurrentSessionToHistory();
    setCurrentPage('history');
  }

  const handleSaveSettings = (newSettings: AppSettings) => {
    const oldLanguage = appSettings.language;
    setAppSettings(newSettings);
    // If global language setting changed and we are on chat page with a session using old global language, re-initialize
    if (currentPage === 'chat' && newSettings.language !== oldLanguage && currentSessionLanguage === oldLanguage) {
        console.log("Global language setting changed. Re-initializing chat session.");
        saveCurrentSessionToHistory();
        setCurrentSessionId(null);
        setMessages([]);
        setChatSession(null);
        initializeChat(newSettings.language, true);
    } else if (currentSessionLanguage !== newSettings.language) {
      // If global language changed, ensure currentSessionLanguage is updated for next new chat
      setCurrentSessionLanguage(newSettings.language);
    }
  };

  const handleDeleteHistorySession = (sessionId: string) => {
    setChatHistory(prev => prev.filter(session => session.id !== sessionId));
    if (currentSessionId === sessionId) { 
        setCurrentSessionId(null);
        setChatSession(null); 
        initializeChat(appSettings.language, true);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onStartChat={() => navigateToChat()} />; 
      case 'chat':
        return (
          <div className="flex flex-col h-full">
            <div 
              className="flex-grow overflow-y-auto p-4 rounded-lg shadow-inner" 
              style={{ backgroundColor: 'var(--app-bg)' }} // This provides the solid background for chat content area
            >
              {error && <ErrorMessage message={error} onClear={() => setError(null)} />}
              <ChatWindow messages={messages} />
            </div>
            <QuickQuestionsToggle 
              onClick={toggleFAQBarVisibility} 
              isFAQBarVisible={isFAQBarVisible} 
            />
            {isFAQBarVisible && (
              <FAQBar 
                  faqs={DEFAULT_FAQS} 
                  onSelectFAQ={handleSelectFAQ}
                  isLoading={isLoading && messages.length > 0} 
              />
            )}
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
              currentLanguage={currentSessionLanguage || appSettings.language}
              onLanguageChange={handleChatInputLanguageChange}
            />
          </div>
        );
      case 'settings':
        return <SettingsPage 
                  currentSettings={appSettings} 
                  onSaveSettings={handleSaveSettings} 
                  onNavigateHome={navigateToHome}
                />;
      case 'history':
        return <HistoryPage 
                  chatHistory={chatHistory} 
                  onViewSession={(sessionId) => navigateToChat(sessionId)} 
                  onDeleteSession={handleDeleteHistorySession}
                  onNavigateHome={navigateToHome} 
                />;
      default:
        return <HomePage onStartChat={() => navigateToChat()} />;
    }
  };

  return (
    // The main app div is now transparent to the body's dynamic gradient background
    // Its 'color' style ensures text within it adheres to the theme.
    <div 
      className={`flex flex-col h-screen font-['Inter'] overflow-hidden`} // overflow-hidden on main app container
      style={{ color: 'var(--app-text)' }} // No background-color here, lets body background show
    >
      <Header 
        onNavigateHome={navigateToHome} 
        onNavigateToSettings={navigateToSettings}
        onNavigateToHistory={navigateToHistory} 
      />
      <main className="flex-grow overflow-y-auto"> {/* This main area scrolls if content exceeds */}
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
// End of App.tsx file. All syntax should be complete.
