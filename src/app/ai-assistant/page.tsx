'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../lib/context/AppContext';
import { processChatMessage, ChatHistoryItem, ChatActionLink } from '../../lib/chatEngine';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  ArrowRight,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actionLink?: ChatActionLink;
}

const PRESET_PROMPTS = [
  {
    labelEn: '🌾 How to detect Crop Disease?',
    labelTa: '🌾 பயிர் நோயை எவ்வாறு கண்டறிவது?',
    queryEn: 'How can I identify crop disease using AI Leaf Disease Doctor?',
    queryTa: 'இலை மருத்துவர் மூலம் பயிர் நோயை எவ்வாறு கண்டறிவது?'
  },
  {
    labelEn: '🛠️ How to register a Complaint?',
    labelTa: '🛠️ புகார் பதிவு செய்வது எப்படி?',
    queryEn: 'How do I register a street light or road problem complaint?',
    queryTa: 'தெரு விளக்கு அல்லது சாலை பழுது புகார் பதிவு செய்வது எப்படி?'
  },
  {
    labelEn: '💰 What is today\'s Paddy price?',
    labelTa: '💰 இன்றைய நெல் மண்டி விலை நிலவரம்?',
    queryEn: 'What is today\'s paddy market price in Thanjavur Mandi?',
    queryTa: 'இன்றைய நெல் மண்டி விலை நிலவரம் என்ன?'
  },
  {
    labelEn: '📋 How to track my Complaint?',
    labelTa: '📋 என் புகாரை எவ்வாறு கண்காணிப்பது?',
    queryEn: 'How do I track my complaint status using Complaint ID?',
    queryTa: 'புகார் எண் மூலம் என் புகாரை எவ்வாறு கண்காணிப்பது?'
  },
  {
    labelEn: '⚡ What Government Schemes exist?',
    labelTa: '⚡ என்னென்ன அரசு மானிய திட்டங்கள் உள்ளன?',
    queryEn: 'What government subsidies and schemes are available for farmers?',
    queryTa: 'விவசாயிகளுக்கு என்னென்ன அரசு மானிய திட்டங்கள் உள்ளன?'
  },
  {
    labelEn: '🗺️ How does Satellite Map work?',
    labelTa: '🗺️ செயற்கைக்கோள் வரைபடம் எவ்வாறு செயல்படுகிறது?',
    queryEn: 'How does the Village Satellite GIS Map work?',
    queryTa: 'செயற்கைக்கோள் கிராம வரைபடம் எவ்வாறு செயல்படுகிறது?'
  }
];

export default function AiAssistantPage() {
  const { language, speakText, complaints } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [historyItems, setHistoryItems] = useState<ChatHistoryItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'bot',
      text: language === 'ta'
        ? 'வணக்கம்! நான் **RuralFix – Agro MedKnow Nexus** AI விவசாய மற்றும் கிராம குறைதீர்ப்பு வழிகாட்டி ("AgroBot").\n\nநீங்கள் பயிர் நோய், உரம், மண்டி சந்தை விலை, அரசு மானியம் அல்லது தெரு விளக்கு/சாலை புகார்கள் குறித்து ஏதேனும் கேட்கலாம்!'
        : 'Hello! I am **AgroBot**, your AI Agriculture & RuralFix Grievance Assistant.\n\nYou can ask me anything about crop diseases, organic remedies, mandi spot prices, government subsidies, or village civic complaints!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userText = textToSend.trim();
    setInputMessage('');

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory: ChatHistoryItem[] = [
      ...historyItems,
      { sender: 'user', text: userText }
    ];

    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = processChatMessage({
        query: userText,
        history: updatedHistory,
        language,
        complaints
      });

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLink: response.actionLink
      };

      setHistoryItems([
        ...updatedHistory,
        {
          sender: 'bot',
          text: response.text,
          intent: response.detectedIntent,
          entity: response.detectedEntity
        }
      ]);

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  const handleResetChat = () => {
    setHistoryItems([]);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: language === 'ta'
          ? 'வணக்கம்! உரையாடல் புதுப்பிக்கப்பட்டது. உங்கள் கேள்வியை கேளுங்கள்!'
          : 'Chat reset. How can I help you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold mb-1">
            <Bot className="w-3.5 h-3.5" />
            <span>AgroBot – உழவன் தோழன் & Civic Grievance AI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'ta' ? 'AI விவசாய உதவியாளர் & உழவன் தோழன்' : 'Conversational AI AgroBot & Grievance Assistant'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {language === 'ta' 
              ? 'பயிர் நோய்கள், மண்டி விலை, கிராம உள்கட்டமைப்பு புகார்கள் குறித்து கேட்கலாம்.'
              : 'Multilingual speech & text AI reasoning for farming mathematics, disease cures, and civic grievance resolution.'}
          </p>
        </div>

        <button
          onClick={handleResetChat}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl border border-slate-200 self-start sm:self-center transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>{language === 'ta' ? 'உரையாடலை புதுப்பி' : 'Reset Chat'}</span>
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
          {language === 'ta' ? 'விரைவு கேள்விகள் (Quick Prompts):' : 'Quick Question Prompts:'}
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(language === 'ta' ? p.queryTa : p.queryEn)}
              className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-xs font-bold text-slate-800 hover:text-emerald-950 shadow-sm transition-all text-left active:scale-95"
            >
              {language === 'ta' ? p.labelTa : p.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[540px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map(msg => {
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-sky-600 text-white flex items-center justify-center text-sm font-bold shadow-md flex-shrink-0">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 text-xs sm:text-sm shadow-sm space-y-2.5 ${
                    isBot
                      ? 'bg-slate-50 border border-slate-200 text-slate-900'
                      : 'bg-emerald-600 text-white rounded-br-none font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Optional Navigation Button */}
                  {msg.actionLink && (
                    <div className="pt-1">
                      <Link
                        href={msg.actionLink.url}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-sm transition-all active:scale-95"
                      >
                        <span>{language === 'ta' ? msg.actionLink.labelTa : msg.actionLink.labelEn}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[10px] opacity-75">
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => speakText(msg.text, language)}
                        className="hover:opacity-100 flex items-center gap-1 font-bold underline ml-2 text-slate-700"
                      >
                        <Volume2 className="w-3 h-3 text-amber-800" />
                        <span>{language === 'ta' ? '🔊 கேளுங்கள்' : '🔊 Listen'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    👤
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs italic p-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              <span>AgroBot is thinking...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleFormSubmit} className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            placeholder={language === 'ta' ? 'விவசாயம் அல்லது கிராம குறை பற்றி கேளுங்கள்...' : 'Ask AgroBot about crops, diseases, mandi rates, or civic complaints...'}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm bg-white text-slate-900 font-medium"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold px-5 sm:px-7 py-3 rounded-2xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'ta' ? 'அனுப்பு' : 'Send'}</span>
          </button>
        </form>

      </div>

    </div>
  );
}
