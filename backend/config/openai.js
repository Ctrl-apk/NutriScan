import dotenv from 'dotenv';
dotenv.config();

export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-3.5-turbo',
  maxTokens: {
    substitution: 800,
    mood: 1000,
    chat: 600,
    risk: 700,
  },
  temperature: 0.7,
  retryAttempts: 3,
  retryDelay: 1000,
};

export const validateOpenAIConfig = () => {
  if (!openaiConfig.apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  if (!openaiConfig.apiKey.startsWith('sk-')) {
    throw new Error('Invalid OPENAI_API_KEY format');
  }
  return true;
};