import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, AlertCircle } from 'lucide-react';
import { startChatSession, sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat, GenerateContentResponse } from '@google/genai';
import ReactMarkdown from 'react-markdown';

interface AITutorProps {
  departmentName: string;
  semesterName: string;
}

const AITutor: React.FC<AITutorProps> = ({ departmentName, semesterName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I'm your AI Tutor for **${departmentName} (${semesterName})**. How can I help you study today? Ask me about concepts, formulas, or study plans!`,
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount or dept change
    chatSessionRef.current = startChatSession();
    // Reset conversation if dept changes
    setMessages([{
        id: 'welcome',
        role: 'model',
        text: `Hello! I'm your AI Tutor for **${departmentName} (${semesterName})**. How can I help you study today? Ask me about concepts, formulas, or study plans!`,
    }]);
  }, [departmentName, semesterName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !chatSessionRef.current) return;

    const userMsgId = Date.now().toString();
    const newUserMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: inputText,
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    const modelMsgId = (Date.now() + 1).toString();
    // Placeholder for stream
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', isThinking: true }]);

    try {
      const streamResult = await sendMessageToGemini(chatSessionRef.current, newUserMessage.text);
      
      let fullText = '';
      
      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullText += text;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === modelMsgId 
                ? { ...msg, text: fullText, isThinking: false } 
                : msg
            )
          );
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to get a response. Please check your connection or API key.");
      setMessages(prev => prev.filter(msg => msg.id !== modelMsgId)); // Remove failed placeholder
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass-panel rounded-[2.5rem] shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="bg-white/30 dark:bg-black/20 p-5 text-slate-800 dark:text-white flex items-center justify-between border-b border-white/20 dark:border-white/5 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="glass-button p-2.5 rounded-2xl shadow-inner bg-poly-500/10 text-poly-600 dark:text-poly-400 border-none">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg tracking-wide">PolyTutor AI</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center font-medium">
              <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
              Powered by Gemini 2.5
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-[1.5rem] p-5 shadow-sm backdrop-blur-md border ${
                msg.role === 'user' 
                  ? 'glass-action-primary text-white rounded-br-none' 
                  : 'glass-button rounded-bl-none text-slate-800 dark:text-slate-100 bg-white/60 dark:bg-slate-800/60'
              }`}
            >
              {msg.isThinking ? (
                <div className="flex items-center space-x-2 text-slate-400">
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce delay-150"></span>
                </div>
              ) : (
                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-slate dark:prose-invert'}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {error && (
            <div className="flex justify-center my-2">
                <div className="glass-panel text-red-600 dark:text-red-300 text-xs px-4 py-2 rounded-full flex items-center border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-3 h-3 mr-2" />
                    {error}
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 bg-white/40 dark:bg-black/30 backdrop-blur-xl border-t border-white/30 dark:border-white/5">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask specific questions..."
            className="w-full pr-14 pl-5 py-4 glass-input text-slate-900 dark:text-slate-200 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-poly-500/50 resize-none text-sm placeholder-slate-500 font-medium shadow-inner"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2.5 rounded-xl transition-all ${
              isLoading || !inputText.trim() 
                ? 'text-slate-400 cursor-not-allowed' 
                : 'glass-action-primary'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;