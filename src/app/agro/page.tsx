'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../lib/context/AppContext';
import { 
  Tractor, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplet, 
  Sparkles, 
  Stethoscope, 
  TrendingUp, 
  Award, 
  Volume2, 
  Edit3, 
  Save, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function AgroHubPage() {
  const { 
    farmerProfile, 
    updateFarmerProfile, 
    weather, 
    language, 
    speakText 
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(farmerProfile);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateFarmerProfile(profileForm);
    setIsEditingProfile(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-green-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-200">
              <Tractor className="w-3.5 h-3.5" />
              <span>Module 2: Agro MedKnow Nexus</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              {language === 'ta' ? 'உழவன் வேளாண் வழிகாட்டி & வானிலை மையம்' : 'Smart Agriculture Intelligence Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl">
              {language === 'ta' 
                ? 'மண் சத்து பகுப்பாய்வு, நிகழ்நேர வானிலை எச்சரிக்கை மற்றும் பயிர் மேலாண்மை வழிகாட்டுதல்.' 
                : 'Real-time agro-meteorology, localized soil chemistry profiling, and precision AI decision support.'}
            </p>
          </div>

          <button
            onClick={() => {
              const text = language === 'ta'
                ? `விவசாய நண்பரே, உங்கள் ${farmerProfile.village} பகுதியில் இன்றைய வெப்பநிலை ${weather.temp} டிகிரி செல்சியஸ். ${weather.activeAlert?.titleTamil || ''}. ${weather.activeAlert?.actionTamil || ''}`
                : `Farmer advisory for ${farmerProfile.village}: Temperature ${weather.temp}°C, humidity ${weather.humidity}%. ${weather.activeAlert?.title || ''}. ${weather.activeAlert?.action || ''}`;
              speakText(text);
            }}
            className="flex items-center space-x-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all self-start md:self-center"
          >
            <Volume2 className="w-4 h-4 text-emerald-300" />
            <span>{language === 'ta' ? 'வானிலை குரல் ஆலோசனை' : 'Listen Voice Advisory'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Farmer Profile + Weather Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Farmer Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                🌾
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Farmer Land & Soil Profile</h2>
                <p className="text-[11px] text-slate-400">Pattukkottai Block, Thanjavur</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-500 mb-1">Farmer Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-500 mb-1">Land Size (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={profileForm.landSizeAcres}
                    onChange={(e) => setProfileForm({ ...profileForm, landSizeAcres: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">Soil Type</label>
                  <select
                    value={profileForm.soilType}
                    onChange={(e) => setProfileForm({ ...profileForm, soilType: e.target.value as any })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white capitalize"
                  >
                    <option value="alluvial">Alluvial Soil</option>
                    <option value="red">Red Soil</option>
                    <option value="black">Black Soil</option>
                    <option value="clay">Clayey Soil</option>
                    <option value="laterite">Laterite Soil</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-500 mb-1">N (kg/ha)</label>
                  <input
                    type="number"
                    value={profileForm.nitrogen}
                    onChange={(e) => setProfileForm({ ...profileForm, nitrogen: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">P (kg/ha)</label>
                  <input
                    type="number"
                    value={profileForm.phosphorus}
                    onChange={(e) => setProfileForm({ ...profileForm, phosphorus: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">K (kg/ha)</label>
                  <input
                    type="number"
                    value={profileForm.potassium}
                    onChange={(e) => setProfileForm({ ...profileForm, potassium: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-500 mb-1">Soil pH</label>
                <input
                  type="number"
                  step="0.1"
                  value={profileForm.ph}
                  onChange={(e) => setProfileForm({ ...profileForm, ph: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs shadow-sm flex items-center justify-center space-x-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Update Farm Profile</span>
              </button>
            </form>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-slate-500 text-[11px]">Registered Cultivator</p>
                <h3 className="font-extrabold text-sm text-emerald-950">{farmerProfile.name}</h3>
                <p className="text-[11px] text-emerald-800">{farmerProfile.village}, {farmerProfile.district}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Holding: <strong>{farmerProfile.landSizeAcres} Acres</strong> • Soil: <strong className="capitalize">{farmerProfile.soilType}</strong></p>
              </div>

              {/* NPK Matrix */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Soil Chemistry Levels</span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold">N</span>
                    <strong className="text-sm font-black text-slate-800">{farmerProfile.nitrogen}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold">P</span>
                    <strong className="text-sm font-black text-slate-800">{farmerProfile.phosphorus}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold">K</span>
                    <strong className="text-sm font-black text-slate-800">{farmerProfile.potassium}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold">pH</span>
                    <strong className="text-sm font-black text-emerald-700">{farmerProfile.ph}</strong>
                  </div>
                </div>
              </div>

              <Link
                href="/agro/recommend"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition-all block text-center"
              >
                <Sparkles className="w-3.5 h-3.5 inline-block" />
                <span>Compute Best Crop Recommendations →</span>
              </Link>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Weather & Agro-Meteorological Advisories */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700 font-bold">
                ⛅
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Agro-Meteorological Weather Station</h2>
                <p className="text-[11px] text-slate-500">Real-time IMD Radar Feeds for Thanjavur & Delta</p>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
              Live Station
            </span>
          </div>

          {/* Current Weather Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-gradient-to-br from-sky-50 to-slate-50 border border-sky-100 text-xs">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">⛈️</span>
              <div>
                <span className="text-slate-400 text-[10px]">Temperature</span>
                <h3 className="text-xl font-black text-slate-900">{weather.temp}°C</h3>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="p-2 rounded-lg bg-sky-200/60 text-sky-800">
                <Droplet className="w-4 h-4" />
              </span>
              <div>
                <span className="text-slate-400 text-[10px]">Relative Humidity</span>
                <h3 className="text-sm font-bold text-slate-800">{weather.humidity}%</h3>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="p-2 rounded-lg bg-sky-200/60 text-sky-800">
                <Wind className="w-4 h-4" />
              </span>
              <div>
                <span className="text-slate-400 text-[10px]">Wind Velocity</span>
                <h3 className="text-sm font-bold text-slate-800">{weather.windSpeed} km/h</h3>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="p-2 rounded-lg bg-amber-200/60 text-amber-800">
                <CloudRain className="w-4 h-4" />
              </span>
              <div>
                <span className="text-slate-400 text-[10px]">Rain Probability</span>
                <h3 className="text-sm font-bold text-amber-700">{weather.rainfallProbability}%</h3>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast with Agricultural Advisories */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">5-Day Field Farming Forecast</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {weather.forecast.map((fc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <span className="text-xs font-bold text-slate-700 block">{fc.day}</span>
                  <span className="text-2xl block">{fc.icon}</span>
                  <span className="text-xs font-bold text-slate-900 block">{fc.temp}°C</span>
                  <span className="text-[10px] text-sky-700 font-semibold block">{fc.rainChance}% Rain</span>
                  <p className="text-[10px] text-slate-600 leading-tight pt-1 border-t border-slate-200 mt-1 line-clamp-3">
                    {language === 'ta' ? fc.advisoryTamil : fc.advisory}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 4 Major Feature Hub Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. AI Plant Doctor */}
        <Link
          href="/agro/disease-detect"
          className="bg-white hover:bg-emerald-50/50 p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm transition-all group flex flex-col justify-between space-y-3"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800">
              {language === 'ta' ? 'AI பயிர் நோய் மருத்துவர்' : 'AI Crop Disease Doctor'}
            </h3>
            <p className="text-xs text-slate-500">
              Upload leaf photo for instant pathogen detection & organic treatments.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
            Diagnose Crop →
          </span>
        </Link>

        {/* 2. Crop Recommendation */}
        <Link
          href="/agro/recommend"
          className="bg-white hover:bg-emerald-50/50 p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm transition-all group flex flex-col justify-between space-y-3"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-green-800">
              {language === 'ta' ? 'மண் & பயிர் பரிந்துரை' : 'AI Crop Advisor'}
            </h3>
            <p className="text-xs text-slate-500">
              Tailored high-yield crop selection based on NPK, pH & profit index.
            </p>
          </div>
          <span className="text-xs font-bold text-green-700 flex items-center gap-1">
            Select Best Crop →
          </span>
        </Link>

        {/* 3. Mandi Market Prices */}
        <Link
          href="/agro/market"
          className="bg-white hover:bg-emerald-50/50 p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm transition-all group flex flex-col justify-between space-y-3"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-800">
              {language === 'ta' ? 'மண்டி நேரடி விலை' : 'Mandi Market & Buyers'}
            </h3>
            <p className="text-xs text-slate-500">
              Real-time spot rates, 7-day price charts & direct wholesaler connect.
            </p>
          </div>
          <span className="text-xs font-bold text-sky-700 flex items-center gap-1">
            Explore Mandi →
          </span>
        </Link>

        {/* 4. Schemes & Loans */}
        <Link
          href="/agro/schemes"
          className="bg-white hover:bg-emerald-50/50 p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm transition-all group flex flex-col justify-between space-y-3"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-purple-800">
              {language === 'ta' ? 'அரசு திட்டங்கள் & கடன்' : 'Govt Schemes & Subsidies'}
            </h3>
            <p className="text-xs text-slate-500">
              PM-KISAN, Solar pumpset 70% subsidy, PMFBY crop insurance & KCC loans.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
            Check Eligibility →
          </span>
        </Link>

      </div>

    </div>
  );
}
