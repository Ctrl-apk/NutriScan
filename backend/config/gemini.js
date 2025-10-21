import dotenv from 'dotenv';
dotenv.config();

export const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-pro',
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  maxTokens: {
    substitution: 2000,
    mood: 2000,
    chat: 1500,
    risk: 2000,
  },
  temperature: 0.7,
  retryAttempts: 3,
  retryDelay: 1000,
};

export const validateGeminiConfig = () => {
  if (!geminiConfig.apiKey) {
    console.warn('⚠️  GEMINI_API_KEY is not configured - AI features will be disabled');
    return false;
  }
  console.log('✓ Gemini API configuration validated');
  return true;
};