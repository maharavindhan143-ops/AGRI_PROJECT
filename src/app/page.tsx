'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../lib/context/AppContext';
import { VillageQuickActionGrid } from '../components/VillageQuickActionGrid';
import { InteractiveGisMap } from '../components/InteractiveGisMap';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  HardHat, 
  Tractor, 
  AlertTriangle, 
  CloudRain, 
  TrendingUp, 
  Sparkles, 
  Stethoscope, 
  ChevronRight,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  Volume2,
  PhoneCall,
  Camera
} from 'lucide-react';

export default function DashboardPage() {
  const { 
    complaints, 
    workers, 
    farmerProfile, 
    weather, 
    mandiPrices, 
    language, 
    t, 
    speakText,
    role
  } = useApp();

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'reported' || c.status === 'assigned').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'in_progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'verified').length;
  const activeWorkersCount = workers.filter(w => w.status === 'on_duty' || w.activeTasks > 0).length;

  const topMandiGainer = mandiPrices.reduce((prev, curr) => (curr.priceChange24h > prev.priceChange24h ? curr : prev), mandiPrices[0]);
  const verifiedComplaintSample = complaints.find(c => c.status === 'verified' && c.photoAfter);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Village Executive Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-500/20">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 -top-10 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-200">
              <span>🌾 Agro MedKnow</span>
              <span>•</span>
              <span>🛠️ RuralFix Nexus</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              {language === 'ta' 
                ? 'வணக்கம்! எளிய கிராம உள்கட்டமைப்பு & விவசாய வழிகாட்டி' 
                : 'Welcome! Village Grievance & Smart Agriculture Operations'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              {language === 'ta'
                ? 'கிராம மக்கள் எளிதாக பயன்படுத்தும் வகையில் தெருவிளக்கு, குடிநீர் புகார்களை பதிவு செய்யவும், பயிர் நோய் மற்றும் மண்டி விலையை உடனே அறியவும் முடியும்.'
                : 'Designed for rural citizens, farmers, field workers, and panchayat officers with instant voice guidance and 1-tap workflows.'}
            </p>
          </div>

          {/* Quick Action & Voice Buttons */}
          <div className="flex flex-col sm:flex-row items-start md:items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                const btn = document.querySelector('header button[title="Open Easy User Guide"]') as HTMLElement;
                if (btn) btn.click();
              }}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95 border border-emerald-300"
            >
              <span>📖 {language === 'ta' ? 'எப்படி பயன்படுத்துவது?' : 'How to Use?'}</span>
            </button>

            <button
              onClick={() => {
                const message = language === 'ta'
                  ? `இன்றைய கிராம விபரம்: மொத்த புகார்கள் ${totalComplaints}, இதில் சரிசெய்யப்பட்டவை ${resolvedComplaints}. வானிலை: ${weather.temp} டிகிரி செல்சியஸ், ${weather.activeAlert ? weather.activeAlert.titleTamil : 'மிதமான வானிலை'}. மஞ்சள் மண்டி விலை குவிண்டாலுக்கு ₹${topMandiGainer.pricePerQuintal}.`
                  : `Village briefing: Total grievances ${totalComplaints}, Resolved ${resolvedComplaints}. Weather ${weather.temp}°C. Turmeric Mandi spot rate ₹${topMandiGainer.pricePerQuintal} per quintal.`;
                speakText(message, language);
              }}
              className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <Volume2 className="w-5 h-5 text-slate-950" />
              <span>{language === 'ta' ? 'குரலில் கேட்க 🔊' : 'Listen Voice Briefing 🔊'}</span>
            </button>
          </div>
        </div>

        {/* Monsoon Weather Advisory */}
        {weather.activeAlert && (
          <div className="mt-5 p-3.5 rounded-2xl bg-amber-500/25 border border-amber-400/50 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black text-sm">⛈️</span>
              <div>
                <strong className="text-amber-200 text-sm">
                  {language === 'ta' ? weather.activeAlert.titleTamil : weather.activeAlert.title}
                </strong>
                <p className="text-amber-100 text-[11px] mt-0.5">
                  {language === 'ta' ? weather.activeAlert.actionTamil : weather.activeAlert.action}
                </p>
              </div>
            </div>
            <Link
              href="/agro"
              className="text-white hover:text-amber-200 underline font-black whitespace-nowrap self-end sm:self-center bg-white/10 px-3 py-1.5 rounded-xl border border-white/20"
            >
              {language === 'ta' ? 'விவசாய ஆலோசனை →' : 'View Advisory →'}
            </Link>
          </div>
        )}
      </div>

      {/* 4 GIANT TOUCH-FRIENDLY VILLAGE ACTION CARDS */}
      <VillageQuickActionGrid onOpenReportModal={() => {
        const btn = document.querySelector('header button[title="Report Problem"], header button:has(svg)') as HTMLElement;
        if (btn) btn.click();
      }} />

      {/* Key Numbers / Simple Dashboard Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Complaints */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">{t('statTotalComplaints')}</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalComplaints}</h3>
            <span className="text-[10px] text-emerald-600 font-bold">100% Geo-tagged</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl">
            💡
          </div>
        </div>

        {/* Pending Action */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">{t('statPendingComplaints')}</p>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{pendingComplaints}</h3>
            <span className="text-[10px] text-amber-700 font-bold">{inProgressComplaints} வேலை நடக்கிறது</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
            ⏳
          </div>
        </div>

        {/* Solved & Verified */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">{t('statResolvedComplaints')}</p>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{resolvedComplaints}</h3>
            <span className="text-[10px] text-emerald-700 font-bold">அதிகாரி சரிபார்த்தது</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
            ✓
          </div>
        </div>

        {/* Mandi Top Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500">{t('statMarketOpportunities')}</p>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
              ₹{topMandiGainer.pricePerQuintal}
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">
              +{topMandiGainer.priceChange24h} ₹ ({topMandiGainer.crop.split(' ')[0]})
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-xl">
            💰
          </div>
        </div>

      </div>

      {/* Dual Module Showcase Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 1: RuralFix Grievance Pipeline */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-sky-100 text-sky-800 text-lg font-bold">
                🛠️
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {language === 'ta' ? 'கிராம உள்கட்டமைப்பு குறைதீர்ப்பு' : 'Module 1: RuralFix Infrastructure'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ta' ? 'புகார்கள் மற்றும் சரிசெய்த புகைப்படம்' : 'Citizen complaints & verified repairs'}
                </p>
              </div>
            </div>
            <Link
              href="/ruralfix"
              className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200"
            >
              {language === 'ta' ? 'அனைத்து புகார்கள்' : 'View All'} ({complaints.length}) →
            </Link>
          </div>

          {/* Before/After Verified Showcase Slider */}
          {verifiedComplaintSample && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  {language === 'ta' ? 'சரிசெய்த வேலை:' : 'Verified Repair:'} <strong className="text-emerald-700">{verifiedComplaintSample.title}</strong>
                </span>
                <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                  ✓ 100% முடிந்தது
                </span>
              </div>
              <BeforeAfterSlider
                beforeImage={verifiedComplaintSample.photoBefore}
                afterImage={verifiedComplaintSample.photoAfter!}
                beforeLabel={language === 'ta' ? 'பழுது (முன்)' : 'Before Repair'}
                afterLabel={language === 'ta' ? 'சரிசெய்தது (பின்)' : 'Repaired'}
                height="h-44 sm:h-52"
              />
              <p className="text-[11px] text-slate-400 text-center">
                {language === 'ta' ? 'நடுவில் உள்ள கோட்டை நகர்த்தி முன் / பின் நிலையை ஒப்பிடவும் ⟷' : 'Drag divider to compare Before vs. After condition.'}
              </p>
            </div>
          )}

          {/* Recent Grievances List */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {language === 'ta' ? 'சமீபத்திய புகார்கள் பட்டியல்' : 'Recent Grievances Queue'}
            </h4>
            <div className="space-y-2">
              {complaints.slice(0, 3).map(c => (
                <Link
                  key={c.id}
                  href="/ruralfix"
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 flex items-center justify-between text-xs block"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-300">
                        {c.id}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        c.severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                        c.severity === 'high' ? 'bg-amber-100 text-amber-700' :
                        'bg-sky-100 text-sky-700'
                      }`}>
                        {c.severity}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 truncate max-w-[240px] sm:max-w-xs">{c.title}</p>
                    <p className="text-[11px] text-slate-500">{c.location.village}, {c.location.district}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl capitalize ${
                      c.status === 'verified' ? 'bg-emerald-600 text-white' :
                      c.status === 'repaired' ? 'bg-indigo-600 text-white' :
                      c.status === 'in_progress' ? 'bg-sky-600 text-white' :
                      'bg-amber-500 text-white'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <Link
              href="/ruralfix/authority"
              className="text-indigo-700 hover:text-indigo-800 font-bold flex items-center gap-1"
            >
              🏛️ {language === 'ta' ? 'அதிகாரி மையம்' : 'Authority Hub'} →
            </Link>
            <Link
              href="/ruralfix/worker"
              className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1"
            >
              🔧 {language === 'ta' ? 'பணியாளர் வேலைகள்' : 'Worker Tasks'} →
            </Link>
          </div>
        </div>

        {/* Module 2: Agro MedKnow AI Decision Engine */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 text-lg font-bold">
                🌾
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {language === 'ta' ? 'அக்ரோ மெட்நோ AI விவசாய வழிகாட்டி' : 'Module 2: Agro MedKnow Nexus'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ta' ? 'இலை மருத்துவர், மண் சத்து & மண்டி விலை' : 'Leaf Doctor, Soil Math & Mandi Rates'}
                </p>
              </div>
            </div>
            <Link
              href="/agro"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
            >
              {language === 'ta' ? 'விவசாய மையம்' : 'Farmer Hub'} →
            </Link>
          </div>

          {/* Quick AI Doctor Leaf Scanner Banner */}
          <Link
            href="/agro/disease-detect"
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between block hover:border-emerald-400 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🌿</span>
                <h4 className="text-xs sm:text-sm font-black text-emerald-950">
                  {language === 'ta' ? 'AI பயிர் இலை மருத்துவர்' : 'AI Crop Disease Doctor'}
                </h4>
              </div>
              <p className="text-[11px] text-emerald-800">
                {language === 'ta' ? 'இலை படம் எடுத்து உடனடி இயற்கை வீட்டு மருத்துவம் பெறுங்கள்.' : 'Instant visual leaf diagnosis with organic herbal prescriptions.'}
              </p>
            </div>
            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-emerald-600/20 whitespace-nowrap">
              {language === 'ta' ? 'இலை ஸ்கேன் →' : 'Scan Leaf →'}
            </span>
          </Link>

          {/* Soil & Crop Recommendation Spotlight */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                {language === 'ta' ? 'மண் பரிசோதனை அளவு (தஞ்சாவூர்):' : 'Active Soil Profile (Thanjavur):'}
              </span>
              <span className="font-mono text-emerald-700 font-bold capitalize">
                {farmerProfile.soilType} Soil
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">தழைச்சத்து N</span>
                <strong className="text-slate-900 font-black">{farmerProfile.nitrogen}</strong>
              </div>
              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">மணிச்சத்து P</span>
                <strong className="text-slate-900 font-black">{farmerProfile.phosphorus}</strong>
              </div>
              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">சாம்பல் சத்து K</span>
                <strong className="text-slate-900 font-black">{farmerProfile.potassium}</strong>
              </div>
              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">pH நிலை</span>
                <strong className="text-emerald-700 font-black">{farmerProfile.ph}</strong>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-600">{language === 'ta' ? 'அதிக லாபம் தரும் பயிர்:' : 'Top Match:'}</span>
              <span className="font-black text-emerald-900">🌾 நெல் CO-51 (96% பொருத்தம்)</span>
              <Link href="/agro/recommend" className="text-emerald-700 font-bold hover:underline">
                {language === 'ta' ? 'கணக்கிடு →' : 'Recalculate →'}
              </Link>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <Link
              href="/agro/schemes"
              className="text-purple-700 hover:text-purple-800 font-bold flex items-center gap-1"
            >
              📜 {language === 'ta' ? 'PM-KISAN & 70% சோலார் மானியம்' : 'Govt Subsidies'} →
            </Link>
            <Link
              href="/ai-assistant"
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
            >
              🤖 {language === 'ta' ? 'உழவன் தோழன் AI' : 'AgroBot Chat'} →
            </Link>
          </div>

        </div>

      </div>

      {/* GIS Smart Map Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {language === 'ta' ? 'கிராம வரைபடம் – புகார்கள் & மண்டி மையங்கள்' : 'Interactive GIS Map – Infrastructure & Agricultural Matrix'}
            </h2>
          </div>
          <Link
            href="/map"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            {language === 'ta' ? 'பெரிய வரைபடம்' : 'Full Map'} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <InteractiveGisMap heightClass="h-[420px]" />
      </div>

    </div>
  );
}
