'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context/AppContext';
import { UserRole, Language } from '../types';
import { UserGuideModal } from './UserGuideModal';
import { 
  Volume2, 
  VolumeX, 
  PlusCircle, 
  PhoneCall,
  UserCheck, 
  Layers,
  Wrench,
  Tractor,
  Building2,
  X,
  Bell,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenReportModal }) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    t, 
    isSpeaking, 
    stopSpeaking, 
    speakText,
    speakBilingual,
    activeNotification,
    dismissNotification,
    complaints,
    weather
  } = useApp();

  const pendingCount = complaints.filter(c => c.status === 'reported' || c.status === 'assigned').length;

  const rolesList: { key: UserRole; labelEn: string; labelTa: string; icon: React.ReactNode }[] = [
    { key: 'citizen', labelEn: 'Village Citizen', labelTa: 'கிராமத்து பொதுமக்கள்', icon: <UserCheck className="w-4 h-4 text-emerald-600" /> },
    { key: 'authority', labelEn: 'Panchayat Officer', labelTa: 'பஞ்சாயத்து தலைவர் / அதிகாரி', icon: <Building2 className="w-4 h-4 text-indigo-600" /> },
    { key: 'worker', labelEn: 'Maintenance Worker', labelTa: 'களப்பணியாளர்', icon: <Wrench className="w-4 h-4 text-amber-600" /> },
    { key: 'farmer', labelEn: 'Farmer / Cultivator', labelTa: 'விவசாயி / உழவர்', icon: <Tractor className="w-4 h-4 text-green-600" /> },
    { key: 'admin', labelEn: 'System Admin', labelTa: 'நிர்வாகி', icon: <Layers className="w-4 h-4 text-slate-600" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Top Banner for Active Notification */}
      {activeNotification && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white px-4 py-2 text-xs md:text-sm font-bold flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <Bell className="w-4 h-4 inline-block" />
            <span>{activeNotification}</span>
          </div>
          <button 
            onClick={dismissNotification}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/20 font-black text-2xl">
              🌾
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 bg-clip-text text-transparent">
                  RuralFix
                </span>
                <span className="text-slate-300 font-light text-base">•</span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-1">
                  Agro MedKnow
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 font-semibold hidden sm:block">
                {language === 'ta' ? 'கிராம குறைதீர்ப்பு & எளிய விவசாய வழிகாட்டி' : 'Village Infrastructure & AI Farming Assistant'}
              </p>
            </div>
          </div>

          {/* Right Controls: User Guide button, Voice button, Tamil Toggle, Role Switcher, Report Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* User Guide Manual Button */}
            <button
              onClick={() => setIsGuideOpen(true)}
              title="Open Easy User Guide"
              className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold text-xs flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span className="hidden md:inline">{language === 'ta' ? '📖 வழிகாட்டி' : '📖 User Guide'}</span>
            </button>

            {/* Audio Speech Readout Button */}
            <div className="relative group">
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    const tamilBrief = `வணக்கம்! இது உங்கள் கிராம குறைதீர்ப்பு மற்றும் விவசாய தளம். தற்போது ${pendingCount} புகார்கள் உள்ளன. இன்றைய வெப்பநிலை ${weather.temp} டிகிரி செல்சியஸ்.`;
                    const englishBrief = `Welcome to RuralFix and Agro MedKnow. You have ${pendingCount} pending grievances and current temperature is ${weather.temp} degrees celsius.`;
                    
                    if (language === 'ta') {
                      speakText(tamilBrief, 'ta');
                    } else {
                      speakText(englishBrief, 'en');
                    }
                  }
                }}
                title={isSpeaking ? 'Stop Audio' : 'Listen Voice Guide (Hover for more options)'}
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm ${
                  isSpeaking 
                    ? 'bg-amber-400 text-slate-950 border-amber-500 ring-2 ring-amber-300 animate-pulse font-black' 
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border-amber-300'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-800" />}
                <span className="hidden sm:inline">
                  {isSpeaking ? (language === 'ta' ? 'நிறுத்து' : 'Stop') : (language === 'ta' ? 'குரல் 🔊' : 'Voice 🔊')}
                </span>
              </button>

              {/* Quick Audio Menu on hover */}
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 hidden group-hover:block z-50">
                <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  {language === 'ta' ? 'குரல் தேர்வு' : 'Voice Options'}
                </div>
                <button
                  onClick={() => {
                    const tamilBrief = `வணக்கம்! இது உங்கள் கிராம குறைதீர்ப்பு மற்றும் விவசாய தளம். தற்போது ${pendingCount} புகார்கள் உள்ளன. இன்றைய வெப்பநிலை ${weather.temp} டிகிரி செல்சியஸ்.`;
                    speakText(tamilBrief, 'ta');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                >
                  <span>🗣️ தமிழில் கேட்க</span>
                  <span className="text-[10px] text-slate-400">Tamil</span>
                </button>
                <button
                  onClick={() => {
                    const englishBrief = `Welcome to RuralFix and Agro MedKnow. You have ${pendingCount} pending grievances and current temperature is ${weather.temp} degrees celsius.`;
                    speakText(englishBrief, 'en');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-800 flex items-center justify-between"
                >
                  <span>🗣️ English Guide</span>
                  <span className="text-[10px] text-slate-400">English</span>
                </button>
                <button
                  onClick={() => {
                    const tamilBrief = `வணக்கம்! இது உங்கள் கிராம குறைதீர்ப்பு மற்றும் விவசாய தளம். தற்போது ${pendingCount} புகார்கள் உள்ளன.`;
                    const englishBrief = `Welcome to RuralFix and Agro MedKnow. You have ${pendingCount} pending grievances.`;
                    speakBilingual(tamilBrief, englishBrief);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-black text-amber-900 bg-amber-50/50 hover:bg-amber-100 flex items-center justify-between border-t border-slate-100"
                >
                  <span>🌐 இருமொழிகளிலும்</span>
                  <span className="text-[10px] bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded font-black">Both</span>
                </button>
              </div>
            </div>

            {/* Language Switcher (High visibility) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-300 shadow-inner">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all ${
                  language === 'ta'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 font-bold'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Role Switcher Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border bg-slate-50 hover:bg-slate-100 border-slate-300 text-xs font-bold text-slate-800 shadow-sm">
                <span className="text-slate-400 font-normal hidden lg:inline">{t('roleLabel')}:</span>
                <span className="capitalize">
                  {role === 'citizen' && '👤 பொதுமகன்'}
                  {role === 'authority' && '🏛️ அதிகாரி'}
                  {role === 'worker' && '🔧 பணியாளர்'}
                  {role === 'farmer' && '🌾 விவசாயி'}
                  {role === 'admin' && '⚙️ நிர்வாகி'}
                </span>
              </button>

              <div className="absolute right-0 mt-1 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  {language === 'ta' ? 'பயனர் நிலையை மாற்றுக' : 'Switch Demo Persona'}
                </div>
                {rolesList.map(r => (
                  <button
                    key={r.key}
                    onClick={() => setRole(r.key)}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center space-x-2.5 hover:bg-slate-50 transition-colors ${
                      role === r.key ? 'font-black text-emerald-800 bg-emerald-50' : 'text-slate-700'
                    }`}
                  >
                    <span className="p-1 rounded-lg bg-slate-100">{r.icon}</span>
                    <span className="font-bold">{language === 'ta' ? r.labelTa : r.labelEn}</span>
                    {role === r.key && <span className="ml-auto text-emerald-600 font-black">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Big Action Report Button */}
            <button
              onClick={onOpenReportModal}
              title="Report Problem"
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-md shadow-orange-500/25 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('reportIssueBtn')}</span>
            </button>

          </div>

        </div>
      </div>

      {/* User Guide Walkthrough Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenReportModal={onOpenReportModal}
      />
    </header>
  );
};
