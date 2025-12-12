import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, AlertCircle, Brain, BookOpen, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { startChatSession, sendMessageToGemini, generateQuiz } from '../services/geminiService';
import { ChatMessage, Quiz } from '../types';
import { Chat, GenerateContentResponse } from '@google/genai';
import ReactMarkdown from 'react-markdown';

interface AITutorProps {
  departmentName: string;
  semesterName: string;
  subjectName?: string;
}

const AITutor: React.FC<AITutorProps> = ({ departmentName, semesterName, subjectName }) => {
  // Modes: 'chat' | 'quiz'
  const [mode, setMode] = useState<'chat' | 'quiz'>('chat');
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  
  // Quiz State
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount or dept change with specific context
    chatSessionRef.current = startChatSession(departmentName, semesterName, subjectName, isThinkingMode);
    
    // Construct welcome message based on context
    const contextText = subjectName 
      ? `**${subjectName}** in **${departmentName}**`
      : `**${departmentName} (${semesterName})**`;

    const modeText = isThinkingMode ? " I'm in **Deep Thinking** mode for complex queries." : "";
    const welcomeText = `Hello! I'm your AI Tutor for ${contextText}.${modeText} How can I help you study today? Ask me about concepts, formulas, or study plans!`;

    // Reset conversation
    setMessages([{
        id: 'welcome',
        role: 'model',
        text: welcomeText,
    }]);
    
    // Reset quiz when subject changes
    setQuiz(null);
    setMode('chat');
  }, [departmentName, semesterName, subjectName, isThinkingMode]);

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

  // --- QUIZ FUNCTIONS ---

  const startQuiz = async () => {
    if (!subjectName) return;
    setMode('quiz');
    setIsQuizLoading(true);
    setError(null);
    
    try {
      const generatedQuiz = await generateQuiz(subjectName);
      setQuiz(generatedQuiz);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setScore(0);
      setQuizFinished(false);
    } catch (err) {
      setError("Failed to generate quiz. Please try again.");
      setMode('chat'); // Go back to chat on error
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleQuizAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null || !quiz) return; // Prevent changing answer
    setSelectedAnswer(optionIndex);
    
    if (optionIndex === quiz.questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (!quiz) return;
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  const retryQuiz = () => {
    startQuiz();
  };

  return (
    <div className="flex flex-col h-[75vh] md:h-[600px] glass-panel rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-slate-200 dark:border-white/10 transition-all duration-300 bg-white dark:bg-black">
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-neutral-900/90 p-3 md:p-5 text-black dark:text-white flex flex-col md:flex-row items-start md:items-center justify-between border-b border-black/5 dark:border-white/10 backdrop-blur-md gap-3 md:gap-0 relative z-20">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="glass-button p-2 md:p-2.5 rounded-2xl shadow-inner bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-none">
            <Bot className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base md:text-lg tracking-wide text-slate-900 dark:text-white">
                {mode === 'quiz' ? 'Knowledge Check' : 'PolyTutor AI'}
            </h3>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-neutral-400 flex items-center font-medium">
              <Sparkles className="w-3 h-3 mr-1 text-sky-500" />
              Powered by Gemini 2.5
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
            {subjectName && mode === 'chat' && (
                <button
                    onClick={startQuiz}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[10px] md:text-xs font-bold flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all"
                >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Take Quiz</span>
                </button>
            )}

            {mode === 'quiz' && (
                <button
                    onClick={() => setMode('chat')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 text-[10px] md:text-xs font-bold hover:bg-slate-200 dark:hover:bg-neutral-700 transition-all"
                >
                    Exit Quiz
                </button>
            )}

            {/* Deep Thinking Toggle (Only in Chat) */}
            {mode === 'chat' && (
                <button
                    onClick={() => setIsThinkingMode(!isThinkingMode)}
                    className={`px-3 py-1.5 rounded-xl transition-all border flex items-center gap-2 text-[10px] md:text-xs font-bold ${
                        isThinkingMode 
                        ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]' 
                        : 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-500 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                    title="Enable Deep Thinking for complex queries"
                >
                    <Brain className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isThinkingMode ? 'animate-pulse' : ''}`} />
                    <span className="hidden sm:inline">{isThinkingMode ? 'Deep Think On' : 'Deep Think'}</span>
                </button>
            )}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      
      {mode === 'chat' ? (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 scroll-smooth custom-scrollbar bg-slate-50 dark:bg-[#050505]">
                {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div 
                    className={`max-w-[90%] md:max-w-[85%] rounded-2xl md:rounded-[1.5rem] p-3 md:p-5 shadow-sm backdrop-blur-md border ${
                        msg.role === 'user' 
                        ? 'bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-neutral-200 text-white dark:text-slate-900 rounded-br-none border-transparent' 
                        : 'bg-white dark:bg-[#111] text-slate-800 dark:text-neutral-100 border-slate-200 dark:border-white/10 rounded-bl-none shadow-md'
                    }`}
                    >
                    {msg.isThinking ? (
                        <div className="flex items-center space-x-2 opacity-50">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-current rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-current rounded-full animate-bounce delay-75"></span>
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-current rounded-full animate-bounce delay-150"></span>
                        </div>
                    ) : (
                        <div className={`prose prose-sm max-w-none text-xs md:text-sm ${msg.role === 'user' ? 'prose-invert dark:prose-neutral' : 'prose-neutral dark:prose-invert'}`}>
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    )}
                    </div>
                </div>
                ))}
                {error && (
                    <div className="flex justify-center my-2">
                        <div className="glass-panel text-red-600 dark:text-red-400 text-xs px-4 py-2 rounded-full flex items-center border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20">
                            <AlertCircle className="w-3 h-3 mr-2" />
                            {error}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-5 bg-white dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-white/10">
                <div className="relative">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Ask about ${subjectName || 'this semester'}...`}
                    className="w-full pr-12 pl-4 py-3 md:pr-14 md:pl-5 md:py-4 glass-input text-slate-900 dark:text-white rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white resize-none text-sm placeholder-slate-400 dark:placeholder-neutral-500 font-medium shadow-inner bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10"
                    rows={1}
                    disabled={isLoading}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputText.trim()}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 md:p-2.5 rounded-xl transition-all ${
                    isLoading || !inputText.trim() 
                        ? 'text-slate-300 dark:text-neutral-600 cursor-not-allowed' 
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 shadow-md'
                    }`}
                >
                    <Send className="w-4 h-4" />
                </button>
                </div>
            </div>
          </>
      ) : (
          <div className="flex-1 flex flex-col bg-white dark:bg-[#050505] overflow-y-auto">
             {isQuizLoading ? (
                 <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                     <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-sm font-bold text-slate-500 dark:text-neutral-400 animate-pulse">Generating your quiz...</p>
                 </div>
             ) : quiz ? (
                 !quizFinished ? (
                     <div className="flex-1 flex flex-col p-6 md:p-8 max-w-3xl mx-auto w-full">
                         <div className="mb-6 flex justify-between items-center">
                             <span className="text-xs font-bold text-sky-500 uppercase tracking-widest bg-sky-100 dark:bg-sky-900/30 px-3 py-1 rounded-full">
                                Question {currentQuestionIndex + 1} / {quiz.questions.length}
                             </span>
                             <span className="text-sm font-bold text-slate-400">Score: {score}</span>
                         </div>
                         
                         <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-snug">
                             {quiz.questions[currentQuestionIndex].question}
                         </h3>
                         
                         <div className="space-y-3 mb-8">
                             {quiz.questions[currentQuestionIndex].options.map((option, idx) => {
                                 const isSelected = selectedAnswer === idx;
                                 const isCorrect = idx === quiz.questions[currentQuestionIndex].correctAnswer;
                                 const showResult = selectedAnswer !== null;
                                 
                                 let itemClass = "w-full p-4 rounded-xl text-left font-medium transition-all border-2 ";
                                 
                                 if (showResult) {
                                     if (isCorrect) itemClass += "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400";
                                     else if (isSelected) itemClass += "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400";
                                     else itemClass += "border-slate-200 dark:border-white/5 opacity-50";
                                 } else {
                                     itemClass += "bg-slate-50 dark:bg-white/5 border-transparent hover:border-slate-200 dark:hover:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-neutral-200";
                                 }

                                 return (
                                     <button
                                        key={idx}
                                        onClick={() => handleQuizAnswer(idx)}
                                        disabled={showResult}
                                        className={itemClass}
                                     >
                                         <div className="flex items-center">
                                             <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-xs font-bold border ${
                                                 showResult && isCorrect ? 'bg-green-500 text-white border-green-500' :
                                                 showResult && isSelected ? 'bg-red-500 text-white border-red-500' :
                                                 'border-slate-300 dark:border-neutral-600'
                                             }`}>
                                                 {String.fromCharCode(65 + idx)}
                                             </div>
                                             <span>{option}</span>
                                             {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 ml-auto text-green-500" />}
                                             {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 ml-auto text-red-500" />}
                                         </div>
                                     </button>
                                 )
                             })}
                         </div>
                         
                         {selectedAnswer !== null && (
                             <div className="animate-fade-in mt-auto">
                                 <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800/50 mb-4">
                                     <p className="text-sm text-blue-800 dark:text-blue-300">
                                         <span className="font-bold">Explanation:</span> {quiz.questions[currentQuestionIndex].explanation || "No explanation provided."}
                                     </p>
                                 </div>
                                 <button 
                                    onClick={nextQuestion}
                                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg"
                                 >
                                     {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight className="w-4 h-4 ml-2" />
                                 </button>
                             </div>
                         )}
                     </div>
                 ) : (
                     <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                         <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl mb-6">
                             <CheckCircle2 className="w-12 h-12 text-white" />
                         </div>
                         <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Quiz Completed!</h2>
                         <p className="text-slate-500 dark:text-neutral-400 font-medium mb-8">
                             You scored <span className="text-sky-500 font-bold text-xl">{score}</span> out of <span className="font-bold text-xl">{quiz.questions.length}</span>
                         </p>
                         
                         <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                             <button 
                                onClick={retryQuiz}
                                className="flex-1 py-3 px-6 rounded-xl border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all flex items-center justify-center"
                             >
                                 <RotateCcw className="w-4 h-4 mr-2" />
                                 Retry Quiz
                             </button>
                             <button 
                                onClick={() => setMode('chat')}
                                className="flex-1 py-3 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity shadow-lg"
                             >
                                 Back to Chat
                             </button>
                         </div>
                     </div>
                 )
             ) : (
                 <div className="p-8 text-center text-red-500">Error loading quiz.</div>
             )}
          </div>
      )}
    </div>
  );
};

export default AITutor;