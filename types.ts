export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  avatar?: string;
  timestamp: Date;
}

export interface SupportedLanguage {
  code: string; // e.g., 'en-US', 'fr-FR'
  name: string; // e.g., 'English (US)', 'Français (France)'
}

export interface ChatSessionRecord {
  id: string;
  startTime: Date;
  endTime: Date;
  messages: Message[];
  companyName: string;
  languageCode: string; // Language code for this session e.g. 'en-US'
  languageName: string; // Friendly language name e.g. 'English (US)'
}

// From the user-provided JSON string
export interface BrandColors {
  primary: string;
  secondary: string;
}

export interface BrandLogo {
  title: string;
  favicon: string;
}

export interface BrandChatbot {
  avatar: string;
  face: string;
}

export interface BrandSocialMedia {
  blog: string;
  linkedin: string;
  instagram: string;
  github: string;
  x: string;
  youtube: string;
}

export interface BrandInfoData {
  appName: string;
  organizationShortName: string;
  organizationLongName: string;
  website: string;
  email: string;
  mobile: string;
  slogan: string;
  colors: BrandColors;
  logo: BrandLogo;
  chatbot: BrandChatbot;
  socialMedia: BrandSocialMedia;
}

export interface BrandFile {
  brand: BrandInfoData;
}

export type ThemeName = 'dark' | 'light';
export type FontSize = 'small' | 'medium' | 'large';

export interface AppSettings {
  theme: ThemeName;
  fontSize: FontSize;
  notificationsEnabled: boolean;
  language: string; // Language code, e.g., 'en-US'
}

export interface FAQItem {
  id: string;
  question: string;
}
