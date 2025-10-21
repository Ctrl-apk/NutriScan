import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Lightbulb, Loader } from 'lucide-react';
import { callGPT } from '../utils/gptService';

const IngredientChat = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! 👋 I\'m your AI nutrition expert powered by GPT-3.5. Ask me anything about food ingredients!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    'What is MSG?',
    'Is sugar harmful?',
    'Alternatives to palm oil?',
    'Is aspartame safe?',
    'What are trans fats?',
    'Benefits of Omega-3?',
  ];

  const handleSend = async (questionText = null) => {
    const question = questionText || input.trim();
    if (!question) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: question,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // ========== GPT PROMPT ========== 
      const prompt = `${question}

Provide a comprehensive answer about this food ingredient including:
1. What it is
2. Health effects (both positive and negative)
3. Safe intake levels (if applicable)
4. Healthier alternatives (if it's harmful)
5. Diet compatibility

Keep the answer concise (under 200 words) but informative. Use simple language.`;
      // ================================

      const response = await callGPT(prompt, 600);

      // Add bot response
      const botMessage = {
        type: 'bot',
        text: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        type: 'bot',
        text: '❌ Sorry, I encountered an error. Please check your API key and try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Nutrition Expert</h2>
            <p className="text-sm text-purple-200">Powered by GPT-3.5 Turbo</p>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-gray-700">Quick Questions:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(question)}
              disabled={loading}
              className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-300 transition disabled:opacity-50"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 animate-fadeIn ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                message.type === 'user'
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                  : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
              }`}
            >
              {message.type === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`flex-1 max-w-[80%] ${
                message.type === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-3 shadow-md ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
              </div>

              <span className="text-xs text-gray-500 mt-1 block px-2">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-3 animate-fadeIn">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t-2 border-gray-200 p-4 bg-gray-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about any ingredient..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          💡 Powered by OpenAI GPT-3.5 • Ask anything about food ingredients
        </p>
      </div>
    </div>
  );
};

export default IngredientChat;