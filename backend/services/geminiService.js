import axios from 'axios';
import { geminiConfig } from '../config/gemini.js';

class GeminiService {
  constructor() {
    this.config = geminiConfig;
    this.isConfigured = !!geminiConfig.apiKey;
  }

  async callGemini(prompt, retryCount = 0) {
    if (!this.isConfigured) {
      throw new Error('Gemini API is not configured. Please add GEMINI_API_KEY to your .env file.');
    }

    try {
      const url = `${this.config.apiUrl}?key=${this.config.apiKey}`;
      
      const response = await axios.post(
        url,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: this.config.temperature,
            maxOutputTokens: 2000,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      const text = response.data.candidates[0].content.parts[0].text;
      return text.trim();
    } catch (error) {
      // Retry logic
      if (retryCount < this.config.retryAttempts && 
          (error.code === 'ECONNRESET' || error.response?.status === 503)) {
        console.log(`Retrying Gemini call... Attempt ${retryCount + 1}`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * (retryCount + 1)));
        return this.callGemini(prompt, retryCount + 1);
      }

      console.error('Gemini API Error:', error.response?.data || error.message);
      throw new Error('AI service temporarily unavailable. Please try again.');
    }
  }

  async getSubstitutions(ingredient, userProfile = {}) {
    const prompt = `You are a nutrition expert. Analyze "${ingredient}" and provide 3 healthier alternatives.

User preferences:
- Diet: ${userProfile.dietType || 'normal'}
- Allergies: ${userProfile.allergies?.join(', ') || 'none'}

Provide response as valid JSON array:
[
  {
    "name": "Alternative name",
    "healthScore": 8,
    "reason": "Why it's better",
    "dietCompatible": ["vegan", "keto"],
    "allergenFree": true
  }
]

IMPORTANT: Return ONLY the JSON array, no markdown, no explanations.`;

    const response = await this.callGemini(prompt);
    return this.parseJSON(response);
  }

  async getMoodRecommendations(mood) {
    const prompt = `Recommend 3 scientifically-backed foods for someone feeling ${mood}.

Provide response as valid JSON array:
[
  {
    "foodName": "Food name",
    "nutrients": {
      "carbs": 25,
      "protein": 10,
      "fat": 5,
      "calories": 180
    },
    "reason": "Scientific explanation",
    "emoji": "🥑"
  }
]

IMPORTANT: Return ONLY the JSON array, no markdown.`;

    const response = await this.callGemini(prompt);
    return this.parseJSON(response);
  }

  async analyzeHealthRisk(scanResults, userProfile = {}) {
    const ingredientsList = scanResults.details?.map(d => d.name).join(', ') || 'unknown';
    
    const prompt = `Analyze health risks for ingredients: ${ingredientsList}

User: Allergies: ${userProfile.allergies?.join(', ') || 'none'}, Diet: ${userProfile.dietType || 'normal'}

Stats: Total: ${scanResults.total}, Safe: ${scanResults.safe}, Moderate: ${scanResults.moderate}, Harmful: ${scanResults.harmful}

Provide JSON:
{
  "riskScore": 45,
  "riskLevel": "moderate",
  "riskColor": "yellow",
  "safetyRating": 55,
  "riskFactors": ["Factor 1", "Factor 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "allergenWarnings": [],
  "longTermEffects": "Brief analysis"
}

Return ONLY valid JSON, no markdown.`;

    const response = await this.callGemini(prompt);
    return this.parseJSON(response);
  }

  async chatAboutIngredient(question) {
    const prompt = `${question}

Provide a comprehensive answer about this food ingredient including:
1. What it is
2. Health effects
3. Safe intake levels
4. Alternatives if harmful
5. Diet compatibility

Keep response professional and under 250 words.`;

    return await this.callGemini(prompt);
  }

  parseJSON(text) {
    try {
      // Remove markdown code blocks and extra text
      let cleaned = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[^[\{]+/, '') // Remove text before JSON
        .replace(/[^\]\}]+$/, '') // Remove text after JSON
        .trim();

      // Find JSON object/array
      const jsonMatch = cleaned.match(/[\[\{][\s\S]*[\]\}]/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
      }

      return JSON.parse(cleaned);
    } catch (error) {
      console.error('JSON Parse Error:', error);
      console.error('Raw text:', text.substring(0, 200));
      
      // Return fallback data
      return this.getFallbackData(text);
    }
  }

  getFallbackData(text) {
    // Return reasonable fallback when JSON parsing fails
    if (text.includes('substitute') || text.includes('alternative')) {
      return [
        {
          name: 'Natural Alternative',
          healthScore: 7,
          reason: 'Consider consulting with a nutritionist for personalized recommendations',
          dietCompatible: ['normal'],
          allergenFree: true
        }
      ];
    }
    return [];
  }
}

export default new GeminiService();