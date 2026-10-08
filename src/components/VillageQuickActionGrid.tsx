'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../lib/context/AppContext';
import { 
  Camera, 
  Stethoscope, 
  CloudRain, 
  TrendingUp, 
  Volume2, 
  PhoneCall, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Droplet
} from 'lucide-react';

interface VillageQuickActionGridProps {
  onOpenReportModal?: () => void;
}

export const VillageQuickActionGrid: React.FC<VillageQuickActionGridProps> = ({ onOpenReportModal }) => {
  const { 
    language, 
    t, 
    speakText, 
    speakBilingual, 
    isSpeaking, 
    speakingLang, 
    stopSpeaking, 
    weather, 
    mandiPrices,
    openReportModal
  } = useApp();

  const handleReportGrievanceClick = () => {
    if (onOpenReportModal) {
      onOpenReportModal();
    } else {
      openReportModal();
    }
  };

  const topCrop = mandiPrices[1] || mandiPrices[0]; // Turmeric or Paddy

  const tamilGuideText = 'வணக்கம் கிராம மக்களே! 1. கிராமத்தில் தெருவிளக்கு, குடிநீர், சாலை பிரச்சனை இருந்தால் முதலாவது மஞ்சள் கட்டத்தை தொட்டு உடனே புகார் செய்யவும். 2. பயிரில் பூச்சி அல்லது இலை நோய் இருந்தால் இரண்டாவது பச்சை கட்டத்தை தொட்டு படம் எடுக்கவும். 3. இன்றைய மழை மற்றும் வானிலைக்கு மூன்றாவது நீல கட்டத்தை தொடவும். 4. இன்றைய மண்டி சந்தை விலைக்கு நான்காவது கட்டத்தை தொடவும்.';
  const englishGuideText = 'Welcome village citizens and farmers! Tap card 1 to report broken streetlights or water pipe leaks. Tap card 2 to scan diseased crop leaves for instant remedies. Tap card 3 for rain advisories. Tap card 4 for live turmeric and crop market prices.';

  return (
    <div className="space-y-4">
      
      {/* Village Voice Audio Assistant Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-800 to-sky-900 text-white shadow-xl border border-emerald-400/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl sm:text-3xl font-black flex-shrink-0 shadow-lg shadow-amber-400/30 ring-4 ring-white/20">
            📢
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                {language === 'ta' ? '🎙️ குரல் வழிகாட்டி' : '🎙️ Voice Guide'}
              </span>
              <span className="text-emerald-200 text-xs font-bold">
                {language === 'ta' ? 'தெளிவான ஒற்றைக் குரல் விளக்கம்' : 'Clear Single-Voice Audio'}
              </span>
              {isSpeaking && (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-red-500/90 text-white text-[10px] font-black animate-pulse shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>
                    {speakingLang === 'ta' 
                      ? '📢 தமிழில் பேசுகிறது...' 
                      : '📢 Speaking in English...'}
                  </span>
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-extrabold mt-1 text-white">
              {language === 'ta' 
                ? 'பொத்தான்களை தொட்டு தமிழ் அல்லது ஆங்கிலத்தில் தெளிவான குரல் வழிகாட்டலை கேளுங்கள்!' 
                : 'Tap a button below to hear clear voice guidance in your chosen language!'}
            </h3>
          </div>
        </div>

        {/* Audio Action Buttons: Tamil, English, Active Guide, Stop */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 flex-shrink-0">
          
          {/* Button 1: Tamil Voice */}
          <button
            onClick={() => speakText(tamilGuideText, 'ta')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all shadow-md active:scale-95 ${
              isSpeaking && speakingLang === 'ta'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-105'
                : 'bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 border border-emerald-300'
            }`}
            title="Listen in Tamil"
          >
            <Volume2 className="w-4 h-4" />
            <span>🗣️ தமிழ்</span>
          </button>

          {/* Button 2: English Voice */}
          <button
            onClick={() => speakText(englishGuideText, 'en')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all shadow-md active:scale-95 ${
              isSpeaking && speakingLang === 'en'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-105'
                : 'bg-sky-500/90 hover:bg-sky-400 text-slate-950 border border-sky-300'
            }`}
            title="Listen in English"
          >
            <Volume2 className="w-4 h-4" />
            <span>🗣️ English</span>
          </button>

          {/* Stop Button when playing */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-500 text-white font-black px-3 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
              title="Stop Speaking"
            >
              <span>⏹️ {language === 'ta' ? 'நிறுத்து' : 'Stop'}</span>
            </button>
          )}

        </div>
      </div>

      {/* 4 Giant Touch-Friendly Village Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: 📸 Report Grievance (Big Amber/Orange) */}
        <div 
          onClick={handleReportGrievanceClick}
          className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white p-5 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold shadow-inner">
                💡
              </div>
              <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100">
                1-கிளிக் புகார்
              </span>
            </div>
            <h3 className="text-lg font-black leading-tight">
              {t('quickReportTitle')}
            </h3>
            <p className="text-xs text-amber-100/90 leading-snug">
              {t('quickReportDesc')}
            </p>
          </div>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs font-black text-white">
            <span className="flex items-center gap-1">
              <Camera className="w-4 h-4" />
              {language === 'ta' ? 'படம் எடுத்து அனுப்புக' : 'Snap & Submit'}
            </span>
            <span className="p-1 rounded-full bg-white/20 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* CARD 2: 🩺 AI Leaf Doctor (Big Emerald/Green) */}
        <Link
          href="/agro/disease-detect"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-5 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold shadow-inner">
                🌿
              </div>
              <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100">
                AI மருத்துவர்
              </span>
            </div>
            <h3 className="text-lg font-black leading-tight">
              {t('quickDoctorTitle')}
            </h3>
            <p className="text-xs text-emerald-100/90 leading-snug">
              {t('quickDoctorDesc')}
            </p>
          </div>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs font-black text-white">
            <span className="flex items-center gap-1">
              <Stethoscope className="w-4 h-4" />
              {language === 'ta' ? 'இலை ஸ்கேன் செய்க' : 'Diagnose Plant'}
            </span>
            <span className="p-1 rounded-full bg-white/20 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* CARD 3: 🌧️ Rain & Weather Alert (Big Sky/Blue) */}
        <Link
          href="/agro"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 text-white p-5 shadow-lg shadow-sky-600/25 hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold shadow-inner">
                ⛈️
              </div>
              <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-sky-100">
                {weather.temp}°C • 65% Rain
              </span>
            </div>
            <h3 className="text-lg font-black leading-tight">
              {t('quickWeatherTitle')}
            </h3>
            <p className="text-xs text-sky-100/90 leading-snug">
              {language === 'ta' 
                ? 'இன்று மாலை மிதமான இடிமழைக்கு வாய்ப்பு. மருந்து தெளிப்பதை தள்ளிப்போடுங்கள்.' 
                : 'Moderate evening showers expected. Delay open fertilizer foliar sprays.'}
            </p>
          </div>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs font-black text-white">
            <span className="flex items-center gap-1">
              <CloudRain className="w-4 h-4" />
              {language === 'ta' ? 'வானிலை ஆலோசனை' : 'Weather Advice'}
            </span>
            <span className="p-1 rounded-full bg-white/20 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* CARD 4: 💰 Today Mandi Rates (Big Purple/Indigo) */}
        <Link
          href="/agro/market"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-purple-700 to-slate-900 text-white p-5 shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold shadow-inner">
                💰
              </div>
              <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-400 text-slate-950 font-mono">
                ₹{topCrop.pricePerQuintal}/Q
              </span>
            </div>
            <h3 className="text-lg font-black leading-tight">
              {t('quickMarketTitle')}
            </h3>
            <p className="text-xs text-purple-100/90 leading-snug">
              {language === 'ta'
                ? `மஞ்சள் குவிண்டால் ₹${topCrop.pricePerQuintal} (+₹${topCrop.priceChange24h}). நேரடி வியாபாரிகள் லாரி புக்கிங்.`
                : `${topCrop.crop.split(' ')[0]} at ₹${topCrop.pricePerQuintal}/Q. Book direct truck pickup at farmgate.`}
            </p>
          </div>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs font-black text-white">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {language === 'ta' ? 'நேரடி வியாபாரிகள்' : 'Buyer Match'}
            </span>
            <span className="p-1 rounded-full bg-white/20 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

      </div>

      {/* Direct Village Helpline Call Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-green-100 text-green-700 font-bold">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900">
              {language === 'ta' ? 'இலவச உதவி எண்கள் (நேரடி அழைப்பு):' : 'Village Emergency Helpline Numbers:'}
            </span>
            <p className="text-slate-500 text-[11px]">
              {language === 'ta' ? 'கிராம குறைதீர்ப்பு: 1800-425-1556 • கிசான் உதவி: 1800-180-1551' : 'Panchayat: 1800-425-1556 • Kisan Call Centre: 1800-180-1551'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="tel:18004251556"
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-sm flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>1800-425-1556</span>
          </a>
          <a
            href="tel:18001801551"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-sm flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>1800-180-1551</span>
          </a>
        </div>
      </div>

    </div>
  );
};
