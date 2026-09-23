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
  onOpenReportModal: () => void;
}

export const VillageQuickActionGrid: React.FC<VillageQuickActionGridProps> = ({ onOpenReportModal }) => {
  const { language, t, speakText, weather, mandiPrices } = useApp();

  const topCrop = mandiPrices[1] || mandiPrices[0]; // Turmeric or Paddy

  return (
    <div className="space-y-4">
      
      {/* Village Voice Audio Assistant Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-sky-700 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-inner">
            📢
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                {language === 'ta' ? 'கிராம ஒலி வழிகாட்டி' : 'Village Voice Guide'}
              </span>
              <span className="text-emerald-200 text-xs font-semibold">
                {language === 'ta' ? 'படிக்க சிரமமாக உள்ளதா?' : 'Need Audio Assistance?'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold mt-0.5">
              {language === 'ta' 
                ? 'பொத்தான்களை தொட்டு குரல் வழியே பயிர் மருத்துவம் மற்றும் புகார்களை அறியலாம்!' 
                : 'Tap any card or speaker button to listen to voice instructions in Tamil or English!'}
            </h3>
          </div>
        </div>

        <button
          onClick={() => {
            const guide = language === 'ta'
              ? 'கிராம மக்களுக்கு வணக்கம்! 1. கிராமத்தில் தெருவிளக்கு அல்லது குடிநீர் பிரச்சனை இருந்தால் முதலாவது மஞ்சள் கட்டத்தை தொட்டு புகார் செய்யவும். 2. பயிரில் நோய் இருந்தால் இரண்டாவது பச்சை கட்டத்தை தொட்டு இலை படம் எடுக்கவும். 3. இன்றைய மழை விபரத்திற்கு மூன்றாவது நீல கட்டத்தை தொடவும்.'
              : 'Welcome! Tap the first card to report village infrastructure problems like broken lights or leaking pipes. Tap the second card to scan crop leaves for instant natural remedies. Tap the third card for today rain forecast.';
            speakText(guide, language);
          }}
          className="flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 flex-shrink-0"
        >
          <Volume2 className="w-5 h-5 text-slate-950" />
          <span>{language === 'ta' ? 'முழு வழிகாட்டலை கேட்க' : 'Listen Voice Guide'}</span>
        </button>
      </div>

      {/* 4 Giant Touch-Friendly Village Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: 📸 Report Grievance (Big Amber/Orange) */}
        <div 
          onClick={onOpenReportModal}
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
