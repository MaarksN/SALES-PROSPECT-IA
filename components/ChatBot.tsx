import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage, UserContext } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
      { id: '1', role: 'model', text: 'Olá! Sou seu assistente de vendas de elite. Posso ajudar a criar scripts, analisar leads ou refinar estratégias. O que você precisa hoje?', timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [userContext] = useLocalStorage<UserContext | null>('sales_ai_context', null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        text: input,
        timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
        const history = messages.map(m => ({ role: m.role, text: m.text }));
        const responseText = await sendChatMessage(history, userMsg.text, userContext || undefined);
        
        const botMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'model',
            text: responseText || "Desculpe, não consegui processar.",
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, botMsg]);
    } catch (error) {
        setMessages(prev => [...prev, { id: 'err', role: 'model', text: 'Erro ao conectar com a IA.', timestamp: new Date().toISOString() }]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleVoice = () => {
     if (!('webkitSpeechRecognition' in window)) return;
     const SpeechRecognition = (window as any).webkitSpeechRecognition;
     const recognition = new SpeechRecognition();
     recognition.lang = 'pt-BR';
     recognition.start();
     recognition.onresult = (event: any) => {
         setInput(event.results[0][0].transcript);
     };
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {!isOpen && (
        <button 
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform animate-bounce-slow"
        >
            <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            <Icons.Robot />
        </button>
      )}

      {isOpen && (
        <div className="w-[350px] md:w-[400px] h-[600px] bg-white dark:bg-[#0B1120] rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in">
            {/* Header */}
            <div className="p-4 bg-indigo-600 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Icons.Robot />
                    </div>
                    <div>
                        <h3 className="font-bold">Assistente Sales AI</h3>
                        <p className="text-xs text-indigo-200 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span> Online
                        </p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full"><Icons.X /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-[#05050A]">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                            msg.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none shadow-sm'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none shadow-sm border dark:border-slate-700 flex gap-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                <button type="button" onClick={handleVoice} className="p-3 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors">
                    <Icons.Mic />
                </button>
                <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Digite sua dúvida..."
                    className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                />
                <button type="submit" disabled={!input} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;