'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Wrench, 
  Tractor, 
  MapPin, 
  PhoneCall, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Stethoscope,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../lib/context/AppContext';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReportModal?: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenReportModal
}) => {
  const { language, setLanguage, speakText, speakBilingual } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'ruralfix' | 'agro' | 'map' | 'emergency'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center space-x-3 z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg">
              📖
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {language === 'ta' ? 'எளிய பயன்பாட்டு வழிகாட்டி' : 'Easy User Guide & Manual'}
                </h2>
                <span className="bg-amber-400/30 text-amber-200 border border-amber-400/40 text-[10px] font-black px-2 py-0.5 rounded-full">
                  1-Min Guide
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {language === 'ta' 
                  ? 'கிராம புகார்கள், விவசாயம், வானிலை மற்றும் அவசர சேவைகளை எளிதாக பயன்படுத்த கற்றுக்கொள்ளுங்கள்.' 
                  : 'Learn how to easily report issues, inspect crop health, check market rates & access village services.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 z-10">
            {/* Audio Explanation Buttons */}
            <div className="flex items-center bg-white/10 rounded-xl p-1 gap-1 border border-white/20">
              <button
                onClick={() => {
                  const textTa = 'வணக்கம்! இந்த தளத்தில் 4 முக்கிய பகுதிகள் உள்ளன. 1. கிராம புகார்கள் பதிவு செய்தல். 2. விவசாய மண்டி விலை மற்றும் இலை நோய் மருத்துவர். 3. கிராம ஜி.ஐ.எஸ் வரைபடம். 4. அவசர உதவி எண்கள்.';
                  speakText(textTa, 'ta');
                }}
                className="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1"
                title="Listen in Tamil"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>தமிழ்</span>
              </button>

              <button
                onClick={() => {
                  const textEn = 'Welcome! This platform features 4 key pillars: Grievance reporting, Agro market rates and Leaf disease detector, GIS map tracking, and Emergency helpline contacts.';
                  speakText(textEn, 'en');
                }}
                className="px-2 py-1 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs transition-colors flex items-center gap-1"
                title="Listen in English"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>English</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto px-4 py-2 gap-2 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-md font-black'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <span>✨ {language === 'ta' ? 'அறிமுகம்' : 'Overview'}</span>
          </button>
          <button
            onClick={() => setActiveTab('ruralfix')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'ruralfix'
                ? 'bg-emerald-600 text-white shadow-md font-black'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>1. {language === 'ta' ? 'கிராம புகார்கள் (RuralFix)' : 'Civic Grievances'}</span>
          </button>
          <button
            onClick={() => setActiveTab('agro')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'agro'
                ? 'bg-emerald-600 text-white shadow-md font-black'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Tractor className="w-4 h-4" />
            <span>2. {language === 'ta' ? 'விவசாயம் & AI மருத்துவர்' : 'Agro & Crop Doctor'}</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'map'
                ? 'bg-emerald-600 text-white shadow-md font-black'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>3. {language === 'ta' ? 'கிராம வரைபடம்' : 'GIS Map'}</span>
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'emergency'
                ? 'bg-emerald-600 text-white shadow-md font-black'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>4. {language === 'ta' ? 'அவசர உதவி எண்கள்' : 'Emergency Helplines'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-200">
                <h3 className="text-lg font-black text-emerald-950 flex items-center space-x-2">
                  <span>🌾</span>
                  <span>
                    {language === 'ta' 
                      ? 'இந்த தளம் எதற்காக? (What is this app for?)' 
                      : 'What is RuralFix - Agro MedKnow Nexus?'}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-emerald-900 mt-2 leading-relaxed">
                  {language === 'ta'
                    ? 'கிராமத்து பொதுமக்கள், விவசாயிகள் மற்றும் பஞ்சாயத்து அதிகாரிகளுக்கு இடையேயான தொடர்பை எளிதாக்கும் ஒரு ஒருங்கிணைந்த தளம். ஒரே கிளிக் மூலம் தெருவிளக்கு பழுது, குடிநீர் கசிவு புகார்களை பதிவு செய்யவும், பயிர் நோய்களை AI கேமரா மூலம் கண்டறியவும் முடியும்.'
                    : 'A unified portal bridging village citizens, farmers, field workers, and Panchayat officers. Report infrastructure issues in 1 click and get instant AI guidance for crop health and market prices.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-3">
                      🛠️
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {language === 'ta' ? '1. கிராம குறைதீர்ப்பு' : '1. Grievance Reporting'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {language === 'ta'
                        ? 'தெருவிளக்கு, குடிநீர் பைப் உடைப்பு, சாலை பழுதுகளை போட்டோ எடுத்து GPS இருப்பிடத்துடன் புகாரளிக்கவும்.'
                        : 'Submit village maintenance problems with instant live GPS auto-tagging and photo uploads.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-3">
                      🌿
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {language === 'ta' ? '2. விவசாயம் & AI இலை மருத்துவர்' : '2. Agriculture & Crop Doctor'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {language === 'ta'
                        ? 'மண்டி விலை நிலவரம், பயிர் இலை நோய்களை போட்டோ எடுத்து உடனடி நிவாரண மருந்து பரிந்துரை பெறுதல்.'
                        : 'Real-time commodity market prices, monsoon alerts, and AI camera crop disease diagnosis.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-lg mb-3">
                      🗺️
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {language === 'ta' ? '3. நேரலை வரைபடம் (GIS Map)' : '3. Interactive Village GIS Map'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {language === 'ta'
                        ? 'உங்கள் கிராமத்தில் எந்தெந்த இடத்தில் வேலை நடக்கிறது என்பதை மேப்பில் லைவ்-ஆகப் பார்க்கலாம்.'
                        : 'Visual interactive map displaying geo-located active issues, worker locations, and resolved status.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-lg mb-3">
                      📞
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {language === 'ta' ? '4. அவசர உதவி எண் & குரல் வழி' : '4. Speed Dial & Voice Audio'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {language === 'ta'
                        ? 'பஞ்சாயத்து, மின்வாரியம், ஆம்புலன்ஸ் அவசர எண்களை 1 கிளிக் முறையில் உடனடியாக அழைக்கலாம்.'
                        : 'Instant emergency call hotline and text-to-speech voice briefing support in Tamil & English.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RURALFIX */}
          {activeTab === 'ruralfix' && (
            <div className="space-y-5">
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-amber-600" />
                <span>
                  {language === 'ta' ? 'புகார் பதிவு செய்வது எப்படி? (Step-by-Step)' : 'How to Report a Problem?'}
                </span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="w-7 h-7 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900">
                      {language === 'ta' ? 'புகார் பட்டனை அழுத்தவும்' : 'Click "Report Issue"'}
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {language === 'ta'
                        ? 'மேல் வலது மூலையில் உள்ள "+ புதிய புகார்" அல்லது "+ Report Issue" பட்டனை கிளிக் செய்யவும்.'
                        : 'Click the orange "+ Report Issue" button at the top header or main action card.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="w-7 h-7 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900">
                      {language === 'ta' ? 'வகை & புகைப்படத்தை தேர்வு செய்யவும்' : 'Select Category & Photo'}
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {language === 'ta'
                        ? 'தெருவிளக்கு, குடிநீர், சாலை, அல்லது கழிவுநீர் வகையைத் தேர்ந்தெடுத்து போட்டோவைப் பதிவேற்றவும்.'
                        : 'Choose from Streetlight, Water Supply, Road repair, or Sanitation, and upload/snap a photo.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="w-7 h-7 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900">
                      {language === 'ta' ? 'GPS இருப்பிடம் & சமர்ப்பித்தல்' : 'Auto GPS Location & Submit'}
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {language === 'ta'
                        ? '"தற்போதைய GPS இருப்பிடத்தைப் பயன்படுத்து" பட்டனை கிளிக் செய்தால் தானாக முகவரி பதிவாகும்.'
                        : 'Click "Use Current GPS Location" for accurate auto-tagging, then hit Submit.'}
                    </p>
                  </div>
                </div>
              </div>

              {onOpenReportModal && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenReportModal();
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <span>🛠️ {language === 'ta' ? 'இப்போதே ஒரு சோதனை புகார் பதிவு செய்க' : 'Try Reporting a Test Issue Now'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AGRO */}
          {activeTab === 'agro' && (
            <div className="space-y-5">
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <Tractor className="w-5 h-5 text-emerald-600" />
                <span>
                  {language === 'ta' ? 'விவசாய வசதிகள் பயன்பாடு' : 'Smart Agriculture & AI Features'}
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center space-x-2 text-emerald-900 font-extrabold text-xs">
                    <Stethoscope className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'ta' ? 'AI இலை நோய் மருத்துவர்' : 'AI Leaf Disease Scanner'}</span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-1.5 leading-relaxed">
                    {language === 'ta'
                      ? 'உங்கள் பயிர் இலைகளில் புள்ளிகள் அல்லது நோய் அறிகுறி இருந்தால், போட்டோ எடுத்து அப்லோட் செய்தால் உடனடி மருந்து விபரம் கிடைக்கும்.'
                      : 'Upload a leaf photo to diagnose crop diseases (e.g. Rice Blast, Turmeric Leaf Spot) with organic & chemical treatment remedies.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-xs">
                    <span>🌾</span>
                    <span>{language === 'ta' ? 'மண்டி சந்தை விலை' : 'Live Mandi Prices'}</span>
                  </div>
                  <p className="text-xs text-amber-800 mt-1.5 leading-relaxed">
                    {language === 'ta'
                      ? 'மஞ்சள், நெல், பருத்தி மற்றும் கரும்பு ஆகியவற்றின் அன்றாட சந்தை விலையை உயர்வு/தாழ்வு விபரங்களுடன் காணலாம்.'
                      : 'Track real-time spot market prices for Turmeric, Paddy, Cotton, and Sugarcane with daily trend indicators.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GIS MAP */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-sky-600" />
                <span>
                  {language === 'ta' ? 'கிராம ஜி.ஐ.எஸ் வரைபடம் (Live Village GIS Map)' : 'Village Live Map'}
                </span>
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ta'
                  ? 'கிராம வரைபடத்தில் மஞ்சள் நிறம் (நிலுவையில் உள்ள வேலைகள்), பச்சை நிறம் (சரிசெய்யப்பட்ட பணிகள்) மற்றும் களப்பணியாளர்களின் இருப்பிடத்தை நேரடியாகக் காணலாம்.'
                  : 'The interactive map displays open issues in orange, completed repairs in green, and field worker location nodes.'}
              </p>

              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-center space-x-3 text-xs text-sky-900 font-bold">
                <span className="text-xl">📍</span>
                <span>
                  {language === 'ta' 
                    ? 'வரைபடத்தில் உள்ள பின்களை கிளிக் செய்து புகாரின் விபரம் மற்றும் போட்டோவை பார்க்கலாம்.'
                    : 'Click on any marker pin to view photo proof, assigned worker details, and status updates.'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 5: EMERGENCY */}
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <PhoneCall className="w-5 h-5 text-rose-600" />
                <span>
                  {language === 'ta' ? 'அவசர தொடர்புகள் (Quick Speed-Dial)' : 'Emergency Helpline Contacts'}
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="tel:108"
                  className="p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-sm">
                      🚑
                    </span>
                    <div>
                      <strong className="text-xs text-rose-950 font-black">
                        {language === 'ta' ? '108 மருத்துவ ஆம்புலன்ஸ்' : '108 Ambulance Medical'}
                      </strong>
                      <p className="text-[11px] text-rose-700">Toll-Free Emergency</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-rose-600 text-white font-black text-xs rounded-xl shadow-sm">
                    Call 108
                  </span>
                </a>

                <a
                  href="tel:1912"
                  className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                      ⚡
                    </span>
                    <div>
                      <strong className="text-xs text-amber-950 font-black">
                        {language === 'ta' ? '1912 மின்வாரிய புகார்' : '1912 Electricity Board'}
                      </strong>
                      <p className="text-[11px] text-amber-800">TNEB Power Failure</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-sm">
                    Call 1912
                  </span>
                </a>

                <a
                  href="tel:18004251600"
                  className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                      🏛️
                    </span>
                    <div>
                      <strong className="text-xs text-emerald-950 font-black">
                        {language === 'ta' ? 'பஞ்சாயத்து அலுவலகம்' : 'Panchayat Office Helpline'}
                      </strong>
                      <p className="text-[11px] text-emerald-800">Local Village Council</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-sm">
                    Call Office
                  </span>
                </a>

                <a
                  href="tel:18001801551"
                  className="p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-sm">
                      🌾
                    </span>
                    <div>
                      <strong className="text-xs text-sky-950 font-black">
                        {language === 'ta' ? 'கிசான் உழவர் மையம்' : 'Kisan Farmer Call Center'}
                      </strong>
                      <p className="text-[11px] text-sky-800">Agri Expert Advice</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-sky-600 text-white font-black text-xs rounded-xl shadow-sm">
                    Call Kisan
                  </span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {language === 'ta' ? 'மொழி தேர்வு:' : 'Language:'}
            </span>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                language === 'ta' ? 'bg-emerald-600 text-white font-black' : 'bg-slate-200 text-slate-700'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                language === 'en' ? 'bg-emerald-600 text-white font-black' : 'bg-slate-200 text-slate-700'
              }`}
            >
              English
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-2 rounded-xl transition-all shadow-sm"
          >
            {language === 'ta' ? 'சரி, புரிந்தது!' : 'Got It, Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
