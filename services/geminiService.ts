import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT_TEMPLATE, GEMINI_CHAT_MODEL_NAME, SUPPORTED_LANGUAGES } from '../constants';

// IMPORTANT: API_KEY is expected to be set in the environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not found. BenefitsBot may not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const startChatSession = async (
  companyName: string, 
  languageCode: string
): Promise<Chat> => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured. Cannot start chat session.");
  }
  
  const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
  if (!selectedLanguage) {
    console.warn(`Unsupported language code: ${languageCode}. Defaulting to English.`);
    // Fallback to English if the language code is somehow invalid
    const english = SUPPORTED_LANGUAGES.find(lang => lang.code === 'en-US') || SUPPORTED_LANGUAGES[0];
    languageCode = english.code;
  }
  const languageName = selectedLanguage?.name || SUPPORTED_LANGUAGES[0].name;


  const systemInstruction = SYSTEM_PROMPT_TEMPLATE(companyName, languageName, languageCode);
  try {
    const chat = ai.chats.create({
      model: GEMINI_CHAT_MODEL_NAME,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, 
      },
    });
    return chat;
  } catch (error) {
    console.error("Error starting chat session with Gemini API:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Invalid Gemini API Key. Please check your configuration.");
    }
    throw new Error("Could not start chat session. There might be an issue with the AI service or network.");
  }
};

export const sendMessageToChat = async (chat: Chat, message: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured. Cannot send message.");
  }
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini API:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Invalid Gemini API Key. Please check your configuration.");
    }
    throw new Error("Failed to get a response from BenefitsBot. There might be an issue with the AI service or network.");
  }
};