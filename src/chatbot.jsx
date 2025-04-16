import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { X, Volume2, VolumeX, Send, MessageSquare, Mic, MicOff, ChevronDown, User } from 'lucide-react';

const API_KEY = import.meta.env.VITE_API_KEY;

// Enhanced system prompt with more website details and services
const systemContext = `You are Niyati, a friendly and insightful female financial assistant for a platform called Financeseer. Key info:

- Platform: Financeseer
- Purpose: Help users manage money, build savings, and earn rewards
- Respond like a smart, supportive financial coach
- Limit replies to 60 words max unless asked for details
- Tone: Empathetic, witty, and concise

You offer:
- Expense tracking summaries
- Monthly saving tips
- Reward suggestions based on spending
- Budgeting help for specific goals (travel, gadgets, etc.)
- Insightful reminders like "You're spending more on dining this week" or "You've hit 80% of your entertainment budget."

Encourage users to stay on track and offer small rewards or praise when goals are met.`;

// Memoize the CustomMessage component
const CustomMessage = memo(({ message, isUser }) => (
  <div className={`flex justify-${isUser ? 'end' : 'start'} mb-4`}>
    <div className="flex max-w-[80%]">
      {isUser ? (
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm bg-gradient-to-br from-emerald-500 to-emerald-600 order-2 ml-2 flex-shrink-0">
          <User size={18} />
        </div>
      ) : (
        <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 mr-2 order-1 flex-shrink-0"></div>
      )}
      <div className={`rounded-2xl px-4 py-3 shadow-sm ${
        isUser 
          ? 'bg-emerald-50 border border-emerald-100 order-1' 
          : 'bg-white border border-gray-100 order-2'
      }`}>
        <p className="text-sm leading-relaxed">{message.message}</p>
        <span className="text-xs text-gray-500 mt-1 block">{message.sentTime || 'just now'}</span>
      </div>
    </div>
  </div>
));

const Chatbot = ({ onClose, containerClass = "" }) => {
  const [messages, setMessages] = useState([
    {
      message: "Hey, I'm Niyati, your smart Financeseer. Ready to sort your money and get you some sweet rewards. What do you want help with today?",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isTextToSpeech, setIsTextToSpeech] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [voice, setVoice] = useState(null);
  const messageListRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSend(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }

    // Cleanup speech synthesis on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update the speech synthesis setup useEffect
  useEffect(() => {
    const setupVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Try to find a good quality female voice (Samantha or similar)
      const preferredVoice = voices.find(v => 
        v.name.includes('Samantha') ||
        v.name.includes('Karen') ||
        v.name.includes('Microsoft Jenny')
      );
      // Fallback to any female voice
      const femaleVoice = voices.find(v => 
        (v.name.includes('Female') || v.name.includes('female')) &&
        (v.lang.includes('en-US') || v.lang.includes('en-GB'))
      );
      
      setVoice(preferredVoice || femaleVoice || voices[0]);
    };

    if (window.speechSynthesis) {
      if (window.speechSynthesis.getVoices().length > 0) {
        setupVoice();
      }
      window.speechSynthesis.onvoiceschanged = setupVoice;
    }

    // Speak initial greeting
    const initialMessage = messages[0].message;
    setTimeout(() => speakMessage(initialMessage), 500);

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update the speak message function
  const speakMessage = (text) => {
    if (isTextToSpeech && text && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) {
        utterance.voice = voice;
      }
      // Standard voice settings for clear professional speech
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Toggle text-to-speech
  const toggleTextToSpeech = useCallback(() => {
    setIsTextToSpeech(prev => !prev);
    if (window.speechSynthesis && isTextToSpeech) {
      window.speechSynthesis.cancel();
    }
  }, [isTextToSpeech]);

  // Toggle speech recognition
  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  // Debounce scroll handler
  const handleScroll = useCallback(() => {
    if (!messageListRef.current) return;
    
    requestAnimationFrame(() => {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
      setShowScrollButton(!isAtBottom);
    });
  }, []);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages
  const handleSend = async (message) => {
    if (!message.trim()) return;

    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user",
      sentTime: new Date().toLocaleTimeString()
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  // Process message with Gemini 2.0-flash
  async function processMessageToChatGPT(chatMessages) {
    const lastMessage = chatMessages[chatMessages.length - 1];
    
    try {
      if (!API_KEY) {
        throw new Error('API key not configured');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${systemContext}\n\nUser: ${lastMessage.message}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 100,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format');
      }

      const responseMessage = data.candidates[0].content.parts[0].text;
      const newMessage = {
        message: responseMessage,
        sender: "ChatGPT",
        direction: "incoming",
        sentTime: new Date().toLocaleTimeString()
      };
      
      setMessages([...chatMessages, newMessage]);
      // Add a small delay before speaking to ensure smooth transition
      setTimeout(() => speakMessage(responseMessage), 100);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...chatMessages, {
        message: "I apologize, but I'm having trouble processing your request. Please try again.",
        sender: "ChatGPT",
        direction: "incoming",
        sentTime: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsTyping(false);
    }
  }

  // Memoize handlers
  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSend(inputValue);
    }
  }, [inputValue]);

  const handleSendClick = useCallback(() => {
    if (inputValue.trim()) {
      handleSend(inputValue);
    }
  }, [inputValue]);

  return (
    <div className={`${containerClass} flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-t-xl">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 mr-3 shadow-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Niyati</h3>
            <p className="text-sm text-emerald-50">Financial Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTextToSpeech}
            className="p-2 rounded-full hover:bg-emerald-500 transition-all"
            title={isTextToSpeech ? "Mute voice" : "Enable voice"}
          >
            {isTextToSpeech ? 
             <Volume2 className="w-5 h-5 text-white" /> : 
             <VolumeX className="w-5 h-5 text-white" />
            }
          </button>
          {onClose && (
            <button onClick={onClose} className="p-2 rounded-full hover:bg-emerald-500 transition-all">
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>

      <div 
        ref={messageListRef}
        className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white"
        style={{ height: "calc(100% - 68px - 80px)" }} // Adjusted heights
        onScroll={handleScroll}
      >
        {messages.map((message, i) => (
          <CustomMessage 
            key={`${message.sender}-${i}-${message.sentTime}`}
            message={message} 
            isUser={message.sender === "user"}
          />
        ))}
        {isTyping && (
          <div className="flex items-center text-sm text-gray-600 mt-2 ml-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 flex-shrink-0"></div>
            <div className="flex space-x-1 mr-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
            </div>
            Niyati is typing...
          </div>
        )}
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-4 bg-emerald-600 text-white rounded-full p-2 shadow-md hover:bg-emerald-700 transition-all"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}

      <div className="p-3 bg-white border-t border-gray-100 shadow-inner">
        <div className="flex items-center bg-gray-50 rounded-full overflow-hidden pl-3 pr-1 border border-gray-200 focus-within:border-emerald-300 focus-within:ring-1 focus-within:ring-emerald-100 transition-all">
          <button
            onClick={toggleListening}
            className={`p-2 rounded-full ${isListening ? 'bg-red-100 text-red-500' : 'hover:bg-gray-200 text-gray-500'} transition-all`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 py-2 px-3 bg-transparent outline-none text-sm"
          />
          <button
            onClick={handleSendClick}
            disabled={!inputValue.trim()}
            className={`p-2 rounded-full ${inputValue.trim() ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 text-gray-400'} transition-all ml-1`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-xs text-center mt-1 text-gray-400">
          <span>Financial Services • 8 AM to 8 PM</span>
        </div>
      </div>
    </div>
  );
};

export default memo(Chatbot);