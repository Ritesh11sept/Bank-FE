import { useState, useEffect, useRef, useCallback, memo } from 'react';
import styles from './styles/Chatbot.module.css';
import { X, Volume2, VolumeX, Send, MessageSquare, Mic, MicOff, ChevronDown } from 'lucide-react';
import { ChatMessage, ChatbotProps } from './types';

// If you're using environment variables, define the type
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const API_KEY = import.meta.env.VITE_API_KEY;

const systemContext = `You are a Door Step Banking Assistant. Key information:
- Website: Door Step Banking Services
- Owner: Manas Lohe
- Contact: 9420718136
- Limit all responses to 50 words or less
- Focus on banking services delivered to customer's doorstep
- Be concise and professional`;

// Memoize the CustomMessage component
const CustomMessage = memo(({ message, isUser }: { message: ChatMessage; isUser: boolean }) => (
  <div className={`${styles.messageWrapper} ${isUser ? styles.userMessage : styles.botMessage}`}>
    <div className={styles.messageContent}>
      <div className={`${styles.avatar} ${isUser ? styles.userAvatar : styles.botAvatar}`}>
        {isUser ? 'U' : 'A'}
      </div>
      <div className={`${styles.messageBubble} ${isUser ? styles.userBubble : styles.botBubble}`}>
        <p className={styles.messageText}>{message.message}</p>
        <span className={styles.messageTime}>{message.sentTime || 'just now'}</span>
      </div>
    </div>
  </div>
));

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      message: "Hi, I'm Aleeza your Door Step Banking Assistant. How may I help you with banking services today?",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isTextToSpeech, setIsTextToSpeech] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSend(transcript);
      };

      recognition.onerror = (event: any) => {
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

  // Function to speak messages
  const speakMessage = (text: string) => {
    if (isTextToSpeech && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

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
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current!;
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
  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
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

  // Process message with ChatGPT
  async function processMessageToChatGPT(chatMessages: ChatMessage[]) {
    const lastMessage = chatMessages[chatMessages.length - 1];
    
    try {
      if (!API_KEY) {
        throw new Error('API key not configured');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
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
      const newMessage: ChatMessage = {
        message: responseMessage,
        sender: "ChatGPT",
        direction: "incoming",
        sentTime: new Date().toLocaleTimeString()
      };
      
      setMessages([...chatMessages, newMessage]);
      speakMessage(responseMessage);
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
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSend(inputValue);
    }
  }, [inputValue]);

  // Memoize send handler
  const handleSendClick = useCallback(() => {
    if (inputValue.trim()) {
      handleSend(inputValue);
    }
  }, [inputValue]);

  return (
    <div className={styles.chatbotWrapper}>
      <div className={styles.header}>
        <div className={styles.headerProfile}>
          <div className={styles.avatar}>
            <MessageSquare className={styles.icon} />
          </div>
          <div>
            <h3 className={styles.title}>Aleeza</h3>
            <p className={styles.subtitle}>Banking Assistant</p>
          </div>
        </div>
        <div className={styles.controls}>
          <button
            onClick={() => setIsTextToSpeech(!isTextToSpeech)}
            className={styles.controlButton}
            title={isTextToSpeech ? "Mute voice" : "Enable voice"}
          >
            {isTextToSpeech ? 
              <Volume2 className={styles.icon} /> : 
              <VolumeX className={styles.icon} />
            }
          </button>
          {onClose && (
            <button onClick={onClose} className={styles.controlButton}>
              <X className={styles.icon} />
            </button>
          )}
        </div>
      </div>

      <div 
        ref={messageListRef}
        className={styles.messageArea}
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
          <div className={styles.typingIndicator}>
            <div className={styles.typingDots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            Aleeza is typing...
          </div>
        )}
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className={styles.scrollButton}
        >
          <ChevronDown className={styles.icon} />
        </button>
      )}

      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <button
            onClick={toggleListening}
            className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
          >
            {isListening ? <MicOff className={styles.icon} /> : <Mic className={styles.icon} />}
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className={styles.input}
          />
          <button
            onClick={handleSendClick}
            disabled={!inputValue.trim()}
            className={`${styles.sendButton} ${inputValue.trim() ? styles.active : ''}`}
          >
            <Send className={styles.icon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Chatbot);