import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Call OpenAI GPT API from backend
 * @param {string} prompt - The prompt to send
 * @param {number} maxTokens - Max tokens in response
 * @returns {Promise<string>} - GPT response
 */
export const callGPT = async (prompt, maxTokens = 500) => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a nutrition and food safety expert. Provide accurate, helpful information about food ingredients.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('GPT API Error:', error.response?.data || error.message);
    throw new Error('Failed to get AI response');
  }
};