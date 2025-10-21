import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1500;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const callGPT = async (prompt, maxTokens = 500, temperature = 0.7) => {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const response = await axios.post(
        GEMINI_API_URL,
        {
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY
          }
        }
      );

      const prediction = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!prediction) throw new Error('No prediction returned from Gemini API.');
      return prediction.trim();
    } catch (error) {
      const status = error.response?.status;
      if (status === 429) {
        attempt++;
        const delay = RETRY_DELAY * 2 ** (attempt - 1);
        console.warn(`Rate limit hit, retrying in ${delay}ms (attempt ${attempt})`);
        await sleep(delay);
      } else {
        console.error('GPT API Error:', error.response?.data || error.message);
        throw new Error(
          `Failed to get AI response. ${status === 401 ? 'Check API key.' : ''}`
        );
      }
    }
  }

  throw new Error('GPT rate limit exceeded. Please wait and try again later.');
};

export const parseGPTResponse = (response) => {
  try {
    // 1️⃣ Convert non-string input to string
    const text = typeof response === 'string' ? response : JSON.stringify(response);

    // 2️⃣ Remove code fences and extra markdown
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?\s*/i, '')  // remove opening ```json
      .replace(/```$/, '')               // remove closing ```
      .trim();

    // 3️⃣ Try to parse JSON safely
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('⚠️ Failed to parse GPT response as JSON. Returning raw text.', err);
    return { text: response };
  }
};
