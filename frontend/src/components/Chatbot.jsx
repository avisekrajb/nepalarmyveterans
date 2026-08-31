import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Mic, Volume2, VolumeX,
  Trash2, Bot, Clock, User, Image as ImageIcon, Phone
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useSite } from '../context/SiteContext';

const Chatbot = () => {
  const chat = useChat();
  const { headerLogos } = useSite();
  
  const messages = chat?.messages || [];
  const isOpen = chat?.isOpen || false;
  const isTyping = chat?.isTyping || false;
  const sendMessage = chat?.sendMessage || (() => {});
  const clearChat = chat?.clearChat || (() => {});
  const toggleChat = chat?.toggleChat || (() => {});

  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const mobileVariants = {
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '100%' },
  };
  const desktopVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        setTimeout(() => {
          if (transcript.trim()) {
            sendMessage(transcript);
            setInputText('');
          }
        }, 300);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [sendMessage]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.abort();
      setIsListening(false);
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition error:', error);
      }
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, ''));
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } else {
      alert('Text-to-speech is not supported in this browser.');
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  // Render message with optional action (e.g. call button for contact)
  const renderMessage = (msg) => {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
        {msg.action?.type === 'call' && msg.action.phone && (
          <a
            href={`tel:${String(msg.action.phone).replace(/[^+\d]/g, '')}`}
            className="inline-flex items-center gap-2 self-start rounded-full bg-gold px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-gold-dark"
          >
            <Phone className="h-3.5 w-3.5" />
            Call Now
          </a>
        )}
      </div>
    );
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-[9998] bg-[#FCC202] text-army p-4 rounded-full shadow-2xl hover:shadow-lg hover:bg-[#e6b002] transition-all duration-300"
        aria-label="Chat"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={isMobile ? mobileVariants : desktopVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`fixed z-[9999] bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col ${
              isMobile
                ? 'inset-x-0 bottom-0 h-[85vh] rounded-t-2xl'
                : 'bottom-24 right-6 w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl max-h-[600px]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-army to-army-dark px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <img
                    src={headerLogos?.leftLogo?.url || 'https://placehold.co/40x40/1F3D2B/FFFFFF?text=Logo'}
                    alt="Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/40x40/1F3D2B/FFFFFF?text=Logo';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm font-display">Ex-Army Assistant</h3>
                  <p className="text-gold text-[8px] font-medium tracking-wider uppercase">AI Chat Support</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="text-white/40 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                  title="Clear Chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={toggleChat}
                  className="text-white/40 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 min-h-[300px] max-h-[400px]">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Bot className="h-12 w-12 mx-auto mb-2 text-gold" />
                  <p className="text-sm font-medium text-gray-500">Hello! 👋 How can I help you?</p>
                  <p className="mt-1 text-xs">Ask about Sewaharu, Leadership, Notices, Contact...</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                        msg.sender === 'user'
                          ? 'bg-gold text-white rounded-br-none'
                          : 'bg-white text-gray-700 rounded-bl-none shadow-sm border border-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.sender === 'bot' && (
                          <Bot className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          {renderMessage(msg)}
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] ${msg.sender === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                              {formatTime(msg.timestamp)}
                            </span>
                            {msg.sender === 'bot' && (
                              <button
                                onClick={() => handleSpeak(msg.text)}
                                className={`p-0.5 rounded transition-colors ${
                                  isSpeaking ? 'text-gold' : 'text-gray-400 hover:text-gold'
                                }`}
                                title={isSpeaking ? 'Stop speaking' : 'Listen'}
                              >
                                {isSpeaking ? (
                                  <VolumeX className="h-3 w-3" />
                                ) : (
                                  <Volume2 className="h-3 w-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 p-3 bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleVoiceInput}
                  className={`p-2 rounded-full transition-colors ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'text-gray-400 hover:text-gold hover:bg-gold/10'
                  }`}
                  title={isListening ? 'Stop listening' : 'Voice input'}
                >
                  <Mic className="h-5 w-5" />
                </button>

                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? '🎤 Listening...' : 'Ask me anything...'}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-sm bg-gray-50 ${
                      isListening ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200'
                    }`}
                  />
                </div>

                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-full transition-colors ${
                    inputText.trim()
                      ? 'bg-gold text-white hover:bg-gold-dark shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center mt-1.5 flex items-center justify-center gap-2">
                <span>AI-powered assistant</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>Secure chat</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;