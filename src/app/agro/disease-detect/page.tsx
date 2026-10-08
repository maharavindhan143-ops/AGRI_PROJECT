'use client';

import React, { useState } from 'react';
import { useApp } from '../../../lib/context/AppContext';
import { DiseaseDiagnosis } from '../../../types';
import { CROP_DISEASE_DATABASE } from '../../../lib/mockData';
import { classifyCropDisease } from '../../../lib/aiEngine';
import { 
  Stethoscope, 
  UploadCloud, 
  Camera, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  AlertTriangle, 
  Leaf, 
  FlaskConical, 
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  Eye,
  AlertCircle,
  Shield,
  FileCheck,
  Check,
  Info,
  Bug
} from 'lucide-react';

const FALLBACK_LEAF_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23064e3b"/><circle cx="200" cy="150" r="80" fill="%23047857"/><path d="M 200 80 Q 270 150 200 220 Q 130 150 200 80 Z" fill="%2310b981"/><path d="M 200 80 L 200 220 M 200 120 L 170 170 M 200 180 L 225 195" stroke="%23ecfdf5" stroke-width="4" stroke-linecap="round"/><text x="50%" y="85%" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23a7f3d0" text-anchor="middle">Crop Leaf Diagnostic View</text></svg>`;

export default function DiseaseDetectPage() {
  const { language, speakText, speakBilingual, isSpeaking, stopSpeaking } = useApp();

  const [selectedPreset, setSelectedPreset] = useState<DiseaseDiagnosis>(CROP_DISEASE_DATABASE[0]);
  const [currentImage, setCurrentImage] = useState<string>(CROP_DISEASE_DATABASE[0].image);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiseaseDiagnosis | null>(CROP_DISEASE_DATABASE[0]);

  const handleSelectPreset = (preset: DiseaseDiagnosis) => {
    setSelectedPreset(preset);
    setUploadedImageName(null);
    setCurrentImage(preset.image);
    triggerScan(preset.image, preset.crop + ' ' + preset.diseaseName);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImageName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result as string;
          setCurrentImage(base64Url);
          triggerScan(base64Url, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerScan = (imageSrc: string, cropHint?: string) => {
    setIsScanning(true);
    setDiagnosisResult(null);

    setTimeout(() => {
      const result = classifyCropDisease(imageSrc, cropHint);
      setDiagnosisResult(result);
      setIsScanning(false);
    }, 700);
  };

  const handleVoiceAdvisory = () => {
    if (!diagnosisResult) return;
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const textToSpeak = language === 'ta' 
      ? diagnosisResult.audioSpeechTa || `${diagnosisResult.cropTamil} பயிரில் ${diagnosisResult.diseaseNameTamil} கண்டறியப்பட்டுள்ளது. அவசர நடவடிக்கை: ${diagnosisResult.immediateActionsTamil?.[0] || 'பாதிக்கப்பட்ட இலைகளை அகற்றவும்.'}`
      : diagnosisResult.audioSpeechEn || `${diagnosisResult.diseaseName} detected on ${diagnosisResult.crop} with ${diagnosisResult.confidence} percent confidence. Immediate step: ${diagnosisResult.immediateActions?.[0] || 'Remove infected leaves.'}`;

    speakText(textToSpeak, language);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'AI பயிர் இலை மருத்துவர்' : 'AI Crop Disease Doctor'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'ta' ? 'இலை நோய் கண்டறிதல் & பயிர் குறிப்பிட்ட தீர்வுகள்' : 'Disease-Specific Crop Diagnosis & Action Plan'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {language === 'ta' 
              ? 'ஒவ்வொரு நோய்க்கும் பிரத்யேகமான அறிவியல் காரணங்கள், அறிகுறிகள், இயற்கை சிகிச்சைகள் மற்றும் பாதுகாப்பு வழிகாட்டுதல்கள்.' 
              : 'Crop and disease-specific causes, symptoms, organic remedies, and label-safe management for every detection.'}
          </p>
        </div>

        {diagnosisResult && (
          <button
            onClick={handleVoiceAdvisory}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all self-start sm:self-center active:scale-95 ${
              isSpeaking 
                ? 'bg-amber-400 text-slate-950 animate-pulse ring-4 ring-amber-300' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{language === 'ta' ? 'குரல் வழிகாட்டுதல் 🔊' : 'Voice Prescription 🔊'}</span>
          </button>
        )}
      </div>

      {/* File Upload & Preset Samples Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Leaf Photo Upload Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-extrabold text-sm sm:text-base text-emerald-200 flex items-center justify-center sm:justify-start space-x-2">
              <Camera className="w-5 h-5 text-amber-400" />
              <span>{language === 'ta' ? 'இலையின் படத்தை பதிவேற்றுக (Upload Leaf Photo)' : 'Upload Your Crop Leaf Photo'}</span>
            </h3>
            <p className="text-xs text-emerald-100/80 font-medium">
              {uploadedImageName ? (
                <span className="text-amber-300 font-bold">✓ Selected: {uploadedImageName}</span>
              ) : (
                language === 'ta' ? 'கேமரா மூலம் படம் எடுத்தோ அல்லது கேலரியில் இருந்தோ அப்லோட் செய்யவும்.' : 'Take a clear leaf photo with your camera or upload from device.'
              )}
            </p>
          </div>

          <label className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0">
            <UploadCloud className="w-4 h-4 text-slate-950" />
            <span>{language === 'ta' ? '📁 படம் தேர்வு செய்ய' : '📁 Upload Photo'}</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Presets Bar */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            {language === 'ta' ? 'மாதிரி பயிர் நோய்களை சோதிக்கவும் (Select Sample Disease Preset):' : 'Select Verified Crop-Disease Sample Preset:'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {CROP_DISEASE_DATABASE.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-2.5 rounded-2xl border flex items-center space-x-2.5 text-left transition-all ${
                selectedPreset.id === preset.id && !uploadedImageName
                  ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/30 text-emerald-950 font-bold scale-[1.02] shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <img
                src={preset.image}
                alt={preset.crop}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_LEAF_IMAGE;
                }}
                className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-slate-300 shadow-sm"
              />
              <div className="truncate text-xs min-w-0">
                <span className="font-extrabold text-[11px] block truncate text-slate-900">
                  {language === 'ta' ? preset.cropTamil : preset.crop}
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold block truncate">
                  {language === 'ta' ? preset.diseaseNameTamil.split('(')[0] : preset.diseaseName.split('(')[0]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Scanner View & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Scan View & Bounding Box (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4 self-start">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
              {language === 'ta' ? 'இலை ஸ்கேன் பார்வை' : 'Leaf Diagnostic View'}
            </span>
            <span className="text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {language === 'ta' ? 'AI கேமரா பார்வை' : 'AI Neural Vision'}
            </span>
          </div>

          <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-950 flex items-center justify-center shadow-inner">
            <img
              src={currentImage}
              alt="Crop Leaf"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_LEAF_IMAGE;
              }}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isScanning ? 'opacity-40 blur-xs' : 'opacity-100'}`}
            />

            {/* Scanning Radar Laser Animation */}
            {isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/70 backdrop-blur-xs">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin mb-3" />
                <span className="text-emerald-300 font-bold text-xs animate-pulse text-center px-4">
                  {language === 'ta' ? 'இலையின் பூஞ்சான் புள்ளிகளை பகுப்பாய்வு செய்கிறது...' : 'Analyzing pathogen symptoms & leaf lesions...'}
                </span>
              </div>
            )}

            {/* AI Bounding Box Overlays */}
            {!isScanning && diagnosisResult && (
              <div 
                className="absolute border-2 border-dashed border-rose-400 bg-rose-500/20 rounded-xl pointer-events-none animate-pulse"
                style={{ top: '25%', left: '25%', width: '50%', height: '50%' }}
              >
                <span className="absolute -top-6 left-0 bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                  {language === 'ta' ? 'பாதிப்பு பகுதி' : 'Lesion Focus'} ({diagnosisResult.confidence}%)
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => triggerScan(currentImage, selectedPreset.crop)}
            disabled={isScanning}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center space-x-2 transition-all active:scale-98"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? (language === 'ta' ? 'பரிசோதிக்கப்படுகிறது...' : 'Diagnosing...') : (language === 'ta' ? 'மீண்டும் இலை ஸ்கேன் செய்க' : 'Re-scan Leaf Image')}</span>
          </button>
        </div>

        {/* Right Column: Complete Disease-Specific Diagnostic Guide (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {diagnosisResult ? (
            <div className="space-y-6">

              {/* Verified Source Label */}
              <div className={`p-3.5 rounded-2xl border text-xs flex items-center space-x-3 shadow-xs ${
                diagnosisResult.isVerifiedData !== false 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                {diagnosisResult.isVerifiedData !== false ? (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="font-extrabold block text-emerald-900">
                        {language === 'ta' ? '✓ சரிபார்க்கப்பட்ட வேளாண் அறிவியல் தகவல்' : '✓ Verified Agricultural Knowledge Source'}
                      </span>
                      <span className="text-[11px] text-emerald-800">
                        {language === 'ta' 
                          ? 'இந்த சிகிச்சை வழிகாட்டுதல் சரிபார்க்கப்பட்ட வேளாண் பல்கலைக்கழக தரவுத்தளத்தின் அடிப்படையிலானது.' 
                          : 'Treatment guidance is based on verified regional agricultural university data.'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <span className="font-extrabold block text-amber-900">
                        {language === 'ta' ? '⚠️ சரிபார்க்கப்பட்ட சிகிச்சை வழிகாட்டல் இல்லை' : '⚠️ Verified Guidance Unavailable'}
                      </span>
                      <span className="text-[11px] text-amber-800">
                        {language === 'ta' 
                          ? 'இந்த கண்டறிதலுக்கு சரிபார்க்கப்பட்ட மருந்து வழிகாட்டல் இல்லை. உள்ளூர் வேளாண்மை அலுவலரை அணுகவும்.' 
                          : 'Verified guidance is currently unavailable for this detection. Please consult your local agriculture officer.'}
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              {/* 1. DETECTION RESULT CARD */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl text-lg">🌾</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {language === 'ta' ? 'பயிர் வகை' : 'Crop'}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900">
                        {language === 'ta' ? diagnosisResult.cropTamil : diagnosisResult.crop}
                      </h3>
                    </div>
                  </div>

                  {/* Status Pill & Audio Prescription */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>{language === 'ta' ? '⚠️ நோய் கண்டறியப்பட்டது' : '⚠️ Disease Detected'}</span>
                    </span>

                    {/* Audio Prescription Playback */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
                      <button
                        onClick={() => {
                          const taPrescription = diagnosisResult.audioSpeechTa || `பயிர் ${diagnosisResult.cropTamil}, நோய் ${diagnosisResult.diseaseNameTamil}. இயற்கை மருத்துவம்: ${diagnosisResult.organicTreatmentTamil[0] || 'வேப்ப எண்ணெய் கரைசல் தெளிக்கவும்'}.`;
                          speakText(taPrescription, 'ta');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1"
                        title="குரலில் இயற்கை மருந்து கேட்க"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>தமிழ்</span>
                      </button>

                      <button
                        onClick={() => {
                          const enPrescription = diagnosisResult.audioSpeechEn || `Crop ${diagnosisResult.crop}, disease ${diagnosisResult.diseaseName}. Organic Remedy: ${diagnosisResult.organicTreatment[0] || 'Spray neem seed kernel extract'}.`;
                          speakText(enPrescription, 'en');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] flex items-center gap-1"
                        title="Listen Prescription in English"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>English</span>
                      </button>

                      <button
                        onClick={() => {
                          const taPrescription = diagnosisResult.audioSpeechTa || `பயிர் ${diagnosisResult.cropTamil}, நோய் ${diagnosisResult.diseaseNameTamil}. மருந்து: ${diagnosisResult.organicTreatmentTamil[0] || 'இயற்கை மருந்து தெளிக்கவும்'}.`;
                          const enPrescription = diagnosisResult.audioSpeechEn || `Crop ${diagnosisResult.crop}, disease ${diagnosisResult.diseaseName}. Remedy: ${diagnosisResult.organicTreatment[0] || 'Apply organic neem formulation'}.`;
                          speakBilingual(taPrescription, enPrescription);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px]"
                        title="Listen in both Tamil and English"
                      >
                        <span>🌐 {language === 'ta' ? 'இருமொழி' : 'Both'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Disease Name & Pathogen */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {language === 'ta' ? '🦠 கண்டறியப்பட்ட நோய் & காரணி' : '🦠 Identified Disease & Pathogen'}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      {language === 'ta' ? diagnosisResult.diseaseNameTamil : diagnosisResult.diseaseName}
                    </h2>
                    {diagnosisResult.pathogenName && (
                      <span className="text-[11px] font-semibold text-emerald-700 block italic">
                        {diagnosisResult.pathogenName}
                      </span>
                    )}
                  </div>

                  {/* Confidence & Severity */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {language === 'ta' ? '🎯 துல்லியம்' : '🎯 Detection Confidence'}
                      </span>
                      <span className="text-sm font-black text-emerald-700 font-mono">
                        {diagnosisResult.confidence}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {language === 'ta' ? 'பாதிப்பு அளவு' : 'Severity'}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                        diagnosisResult.severity === 'severe' 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : diagnosisResult.severity === 'moderate' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {diagnosisResult.severity === 'severe' ? '🔴 High' : diagnosisResult.severity === 'moderate' ? '🟡 Moderate' : '🟢 Low'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Severity Explanation */}
                <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200/80 text-xs text-rose-950 font-medium">
                  <strong>{language === 'ta' ? 'பாதிப்பு விளக்கம்:' : 'Severity Advisory:'}</strong>{' '}
                  {language === 'ta' 
                    ? (diagnosisResult.severityExplanationTamil || 'நோய் அறிகுறிகள் தெளிவாகத் தெரிகின்றன. பரவுவதைத் தடுக்க உடனடியாக நடவடிக்கை எடுக்கவும்.') 
                    : (diagnosisResult.severityExplanation || 'Disease symptoms are clearly visible. Take action early to prevent spread.')}
                </div>
              </div>

              {/* 2. WHY DID THIS DISEASE OCCUR? */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 border-b border-slate-100 pb-3">
                  <HelpCircle className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-extrabold">
                    {language === 'ta' ? `🔍 இந்த நோய் ஏன் வந்தது? (${diagnosisResult.cropTamil})` : `🔍 Why did this disease occur? (${diagnosisResult.crop})`}
                  </h3>
                </div>

                <ul className="space-y-2 text-xs text-slate-800">
                  {(diagnosisResult.causes || []).map((cause, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-amber-500 font-bold text-sm">•</span>
                      <span className="font-medium leading-relaxed">{language === 'ta' && diagnosisResult.causesTamil ? diagnosisResult.causesTamil[idx] : cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. SYMPTOMS TO LOOK FOR */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 border-b border-slate-100 pb-3">
                  <Eye className="w-5 h-5 text-sky-600" />
                  <h3 className="text-base font-extrabold">
                    {language === 'ta' ? `👀 கண்டறியப்பட்ட அறிகுறிகள் (${diagnosisResult.diseaseNameTamil})` : `👀 Identified Symptoms (${diagnosisResult.diseaseName})`}
                  </h3>
                </div>

                <ul className="space-y-2 text-xs text-slate-800">
                  {(language === 'ta' ? diagnosisResult.symptomsTamil : diagnosisResult.symptoms).map((sym, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-sky-600 font-bold text-sm">🍂</span>
                      <span className="font-medium leading-relaxed">{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. WHAT SHOULD I DO NOW? (IMMEDIATE ACTION) */}
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-3xl border border-amber-200 shadow-sm p-6 space-y-3">
                <div className="flex items-center space-x-2 text-amber-950 border-b border-amber-200/80 pb-3">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <h3 className="text-base font-extrabold">
                    {language === 'ta' ? '🚨 இப்போது நான் என்ன செய்ய வேண்டும்?' : '🚨 What should I do now? (Disease-Specific Actions)'}
                  </h3>
                </div>

                <ul className="space-y-2 text-xs text-amber-950 font-medium">
                  {(diagnosisResult.immediateActions || []).map((act, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 bg-white/80 p-3 rounded-2xl border border-amber-200/80 shadow-xs">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-semibold">{language === 'ta' && diagnosisResult.immediateActionsTamil ? diagnosisResult.immediateActionsTamil[idx] : act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. TREATMENT / CONTROL (ORGANIC + CHEMICAL) */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center space-x-2 text-slate-900 border-b border-slate-100 pb-3">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-extrabold">
                    {language === 'ta' ? '💊 நோய் கட்டுப்பாடு & சிகிச்சைகள்' : '💊 How to Control / Treat'}
                  </h3>
                </div>

                {/* Organic / Natural Remedies */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'ta' ? '🌱 இயற்கை / செலவில்லா முறைகள் (Safe & Organic)' : '🌱 Biological & Organic Management'}</span>
                  </div>

                  <div className="space-y-2 pt-1 text-xs">
                    {(language === 'ta' ? diagnosisResult.organicTreatmentTamil : diagnosisResult.organicTreatment).map((treat, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-emerald-950 flex items-start space-x-2.5">
                        <span className="text-emerald-700 font-bold text-sm">✓</span>
                        <span className="font-semibold leading-relaxed">{treat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Approved Chemical Guidance */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2 text-xs font-extrabold text-sky-900 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
                    <FlaskConical className="w-4 h-4 text-sky-600" />
                    <span>{language === 'ta' ? '🧪 பரிந்துரைக்கப்பட்ட பூஞ்சான்கொல்லி / பூச்சிகொல்லி மருந்துகள்' : '🧪 Validated Active Ingredient Recommendations'}</span>
                  </div>

                  {diagnosisResult.chemicalTreatment && diagnosisResult.chemicalTreatment.length > 0 ? (
                    <div className="space-y-2 pt-1 text-xs">
                      {(language === 'ta' ? diagnosisResult.chemicalTreatmentTamil : diagnosisResult.chemicalTreatment).map((chem, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-sky-50/60 border border-sky-200 text-sky-950 flex items-start space-x-2.5">
                          <span className="text-sky-700 font-bold text-sm">🧪</span>
                          <span className="font-semibold leading-relaxed">{chem}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-semibold">
                      {language === 'ta' 
                        ? 'இந்த பயிர்-நோய் சேர்க்கைக்கு சரிபார்க்கப்பட்ட இரசாயன மருந்து விவரங்கள் தரவுத்தளத்தில் இல்லை. மருந்து தெளிப்பதற்கு முன் உள்ளூர் வேளாண்மை அலுவலரை அணுகவும்.'
                        : 'Specific chemical recommendation is unavailable in the current verified database. Please consult your local agricultural officer.'}
                    </div>
                  )}

                  {/* Safety Disclaimer */}
                  <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    ℹ️ {language === 'ta' 
                      ? 'குறிப்பு: மருந்து தெளிக்கும் முன் தயாரிப்பு லேபிளை கவனமாக படித்து, உங்கள் வட்டார வேளாண்மை அலுவலரின் ஆலோசனையை பெறவும்.' 
                      : 'Note: Always follow registered product label directions and consult local agricultural department experts before applying pesticides.'}
                  </p>
                </div>
              </div>

              {/* 6. PREVENTION TIPS */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 border-b border-slate-100 pb-3">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-extrabold">
                    {language === 'ta' ? '🛡️ அடுத்த முறை இந்த நோய் வராமல் தடுப்பது எப்படி?' : '🛡️ How to Prevent This Specific Disease'}
                  </h3>
                </div>

                <ul className="space-y-2 text-xs text-slate-800">
                  {(language === 'ta' ? diagnosisResult.preventionTamil : diagnosisResult.prevention).map((prev, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-indigo-600 font-bold text-sm">🛡️</span>
                      <span className="font-semibold leading-relaxed">{prev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 7. FARMER ACTION PLAN SUMMARY CARD */}
              <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
                <div className="flex items-center space-x-2 border-b border-emerald-700/80 pb-3">
                  <FileCheck className="w-5 h-5 text-amber-300" />
                  <h3 className="text-base font-extrabold tracking-wide text-white">
                    {language === 'ta' ? '🌾 விவசாயி பிரத்யேக செயல் திட்டம் (DISEASE ACTION PLAN)' : '🌾 DISEASE-SPECIFIC FARMER ACTION PLAN'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1">
                    <span className="text-emerald-200 text-[10px] font-bold block uppercase">{language === 'ta' ? 'பயிர் & நோய்:' : 'Crop & Disease:'}</span>
                    <strong className="text-white text-sm font-extrabold block truncate">
                      {language === 'ta' ? `${diagnosisResult.cropTamil} - ${diagnosisResult.diseaseNameTamil.split('(')[0]}` : `${diagnosisResult.crop} - ${diagnosisResult.diseaseName.split('(')[0]}`}
                    </strong>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1">
                    <span className="text-emerald-200 text-[10px] font-bold block uppercase">{language === 'ta' ? 'காரணம்:' : 'Key Cause:'}</span>
                    <p className="text-emerald-100 font-medium leading-snug line-clamp-2">
                      {language === 'ta' && diagnosisResult.causesTamil ? diagnosisResult.causesTamil[0] : diagnosisResult.causes?.[0] || 'Pathogen environmental trigger'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1">
                    <span className="text-amber-300 text-[10px] font-bold block uppercase">{language === 'ta' ? 'உடனடி செயல்:' : 'Immediate Action:'}</span>
                    <p className="text-amber-100 font-semibold leading-snug line-clamp-2">
                      {language === 'ta' && diagnosisResult.immediateActionsTamil ? diagnosisResult.immediateActionsTamil[0] : diagnosisResult.immediateActions?.[0] || 'Inspect nearby plants and isolate.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1">
                    <span className="text-emerald-200 text-[10px] font-bold block uppercase">{language === 'ta' ? 'சிகிச்சை & தடுப்பு:' : 'Control Method:'}</span>
                    <p className="text-emerald-100 font-medium leading-snug line-clamp-2">
                      {language === 'ta' && diagnosisResult.organicTreatmentTamil ? diagnosisResult.organicTreatmentTamil[0] : diagnosisResult.organicTreatment?.[0] || 'Apply verified bio-agent formulation.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-xs text-slate-400">
              {language === 'ta' ? 'பயிரை பரிசோதிக்கிறது...' : 'Diagnosing leaf sample...'}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
