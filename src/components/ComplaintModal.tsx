'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../lib/context/AppContext';
import { IssueCategory } from '../types';
import { computeComplaintSeverity } from '../lib/aiEngine';
import { 
  X, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Lightbulb, 
  Car, 
  Droplet, 
  Trash2, 
  School, 
  AlertTriangle,
  Volume2,
  Mic,
  Copy,
  Search,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Zap,
  ShieldCheck,
  Check
} from 'lucide-react';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackComplaint?: (complaintId: string) => void;
}

const CATEGORIES: { key: IssueCategory; labelEn: string; labelTa: string; emoji: string; descTa: string; descEn: string; isHazard?: boolean }[] = [
  { key: 'street_light', labelEn: 'Street Light', labelTa: 'தெரு விளக்கு', emoji: '💡', descTa: 'எரியாத தெரு விளக்கு / சோலார் லைட்', descEn: 'Defective street light or solar pole' },
  { key: 'road_pothole', labelEn: 'Road / Pothole', labelTa: 'சாலை / பள்ளம்', emoji: '🚧', descTa: 'ரோடு குண்டும் குழியுமாக உள்ளது', descEn: 'Damaged asphalt or deep potholes', isHazard: true },
  { key: 'water_supply', labelEn: 'Water Supply', labelTa: 'குடிநீர் பைப்', emoji: '💧', descTa: 'குடிநீர் வரவில்லை / பைப் கசிவு', descEn: 'No tap water or pipe leakage', isHazard: true },
  { key: 'public_toilet', labelEn: 'Public Toilet', labelTa: 'பொது கழிப்பறை', emoji: '🚽', descTa: 'கழிப்பறை கதவு / தண்ணீர் பழுது', descEn: 'Sanitation door or flushing fault' },
  { key: 'school_building', labelEn: 'Village School', labelTa: 'கிராமப் பள்ளி', emoji: '🏫', descTa: 'பள்ளி வளாகம் / சுவர் பழுது', descEn: 'School boundary or building repair' },
  { key: 'drainage', labelEn: 'Waste / Cleanliness', labelTa: 'சாக்கடை / சுத்தம்', emoji: '🗑️', descTa: 'சாக்கடை அடைப்பு / குப்பை', descEn: 'Garbage dump or drain clogging' },
  { key: 'power_grid', labelEn: 'Electricity', labelTa: 'மின்சாரம் / ஒயர்', emoji: '⚡', descTa: 'தொங்கும் ஒயர் / டிரான்ஸ்பார்மர்', descEn: 'Loose wire or transformer fault', isHazard: true },
  { key: 'other', labelEn: 'Other Facility', labelTa: 'பிற பொது வசதி', emoji: '🌳', descTa: 'பிற கிராம பொது பிரச்சனை', descEn: 'Any other village issue' },
];

const PRESET_SAMPLE_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=80', label: 'தெரு விளக்கு' },
  { url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80', label: 'குடிநீர் பைப்' },
  { url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80', label: 'சாலை பள்ளம்' },
  { url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80', label: 'சாக்கடை அடைப்பு' },
];

const FALLBACK_CIVIC_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%231e293b"/><circle cx="200" cy="130" r="60" fill="%23334155"/><path d="M 170 130 A 30 30 0 0 1 230 130" stroke="%23f59e0b" stroke-width="8" fill="none" stroke-linecap="round"/><text x="50%" y="80%" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23e2e8f0" text-anchor="middle">Civic Problem Photo Proof</text></svg>`;

export const ComplaintModal: React.FC<ComplaintModalProps> = ({ isOpen, onClose, onTrackComplaint }) => {
  const { addComplaint, language, t, speakText } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [category, setCategory] = useState<IssueCategory>('street_light');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Mariamman Kovil Street, East Street');
  const [village, setVillage] = useState('Ammapettai');
  const [district, setDistrict] = useState('Thanjavur');
  const [lat, setLat] = useState(10.7905);
  const [lng, setLng] = useState(79.1378);
  const [photoUrl, setPhotoUrl] = useState(PRESET_SAMPLE_PHOTOS[0].url);
  const [customPhotoName, setCustomPhotoName] = useState<string | null>(null);
  const [reporterName] = useState('M. Murugesan');
  const [reporterPhone] = useState('+91 98421 99088');
  const [isLocating, setIsLocating] = useState(false);
  const [createdComplaintId, setCreatedComplaintId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  if (!isOpen) return null;

  const currentCategoryObj = CATEGORIES.find(c => c.key === category) || CATEGORIES[0];

  const aiSeverity = computeComplaintSeverity({
    category,
    description: `${title || currentCategoryObj.labelTa} ${description}`,
  });

  const handleCaptureGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(Number(pos.coords.latitude.toFixed(4)));
          setLng(Number(pos.coords.longitude.toFixed(4)));
          setAddress(`Near East Temple, Ward 3 (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`);
          setIsLocating(false);
        },
        () => {
          setLat(10.7905 + (Math.random() - 0.5) * 0.04);
          setLng(79.1378 + (Math.random() - 0.5) * 0.04);
          setIsLocating(false);
        }
      );
    } else {
      setTimeout(() => {
        setLat(10.7905 + (Math.random() - 0.5) * 0.04);
        setLng(79.1378 + (Math.random() - 0.5) * 0.04);
        setIsLocating(false);
      }, 500);
    }
  };

  const handleComplaintFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceRecordSimulation = () => {
    setIsVoiceRecording(true);
    speakText(
      language === 'ta' 
        ? 'உங்கள் புகாரை பேசலாம்... பதிவு செய்யப்படுகிறது.' 
        : 'Recording your voice grievance note...',
      language
    );

    setTimeout(() => {
      setIsVoiceRecording(false);
      setDescription(
        language === 'ta' 
          ? 'எங்கள் தெருவில் உள்ள கோவில் அருகே விளக்கு பழுதடைந்துள்ளது. உடனடியாக சரிசெய்ய வேண்டுகிறேன்.' 
          : 'Street light near the temple intersection is broken. Please repair immediately.'
      );
      if (!title) {
        setTitle(language === 'ta' ? `${currentCategoryObj.labelTa} சரிசெய்ய வேண்டுகிறேன்` : `Repair needed for ${currentCategoryObj.labelEn}`);
      }
    }, 2000);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const finalTitle = title.trim() || `${currentCategoryObj.labelEn} Issue at ${address}`;

    const newComp = addComplaint({
      title: finalTitle,
      category,
      description: description.trim() || `${currentCategoryObj.labelEn} problem reported with GPS location and photo proof.`,
      location: {
        address: address.trim() || 'Mariamman Kovil Street, East Street',
        village,
        panchayat: `${village} Gram Panchayat`,
        district,
        state: 'Tamil Nadu',
        lat,
        lng,
      },
      photoBefore: photoUrl,
      severity: aiSeverity.severity,
      status: 'reported',
      reportedBy: {
        name: reporterName,
        phone: reporterPhone,
      },
    });

    setCreatedComplaintId(newComp.id);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    speakText(
      language === 'ta'
        ? `உங்கள் புகார் எண் ${newComp.id} வெற்றிகரமாக பதிவு செய்யப்பட்டது!`
        : `Grievance registered with Complaint ID ${newComp.id}!`,
      language
    );
  };

  const handleCopyId = () => {
    if (!createdComplaintId) return;
    navigator.clipboard.writeText(createdComplaintId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleResetAndClose = () => {
    setCreatedComplaintId(null);
    setCurrentStep(1);
    setTitle('');
    setDescription('');
    onClose();
  };

  const handleTrackClicked = () => {
    const idToTrack = createdComplaintId;
    handleResetAndClose();
    if (idToTrack && onTrackComplaint) {
      onTrackComplaint(idToTrack);
    }
  };

  const playStepAudioInstruction = (stepNum: number) => {
    let msgTa = '';
    let msgEn = '';
    if (stepNum === 1) {
      msgTa = 'படி 1: உங்கள் கிராமத்தில் என்ன பிரச்சனை என்பதை தொட்டு தேர்வு செய்யுங்கள்.';
      msgEn = 'Step 1: Select the problem category in your village.';
    } else if (stepNum === 2) {
      msgTa = 'படி 2: உங்கள் தற்போதைய இருப்பிடத்தை பதிவு செய்யுங்கள்.';
      msgEn = 'Step 2: Capture your location using GPS or search.';
    } else if (stepNum === 3) {
      msgTa = 'படி 3: பாதிக்கப்பட்ட இடத்தின் படத்தை அப்லோட் செய்யுங்கள்.';
      msgEn = 'Step 3: Upload a photo of the damaged problem.';
    } else if (stepNum === 4) {
      msgTa = 'படி 4: பிரச்சனை பற்றிய சிறு குறிப்பை எழுதுங்கள் அல்லது பேசுங்கள்.';
      msgEn = 'Step 4: Describe the problem briefly or use voice note.';
    } else if (stepNum === 5) {
      msgTa = 'படி 5: விபரங்களை சரிபார்த்து புகாரை அனுப்புங்கள்.';
      msgEn = 'Step 5: Review your details and click submit.';
    }

    speakText(language === 'ta' ? msgTa : msgEn, language);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[94vh] overflow-y-auto border-2 border-amber-500/40">
        
        {/* Top Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="p-1.5 bg-amber-500 text-white rounded-xl text-sm">📢</span>
              <span>{language === 'ta' ? 'கிராம புகாரை பதிவு செய்ய' : 'Report a Village Problem'}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'ta' ? 'என்ன பிரச்சனை என்று சொல்லுங்கள். சரியான அதிகாரியிடம் சேர்க்கிறோம்.' : 'Tell us what is wrong. We will send it to the right person.'}
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Success Screen */}
        {createdComplaintId ? (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner animate-bounce">
              🎉
            </div>
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-4 py-1 rounded-full border border-emerald-300">
                {language === 'ta' ? 'புகார் வெற்றிகரமாக பதிவானது!' : 'Complaint Registered!'}
              </span>
              <p className="text-xs text-slate-500">
                {language === 'ta' ? 'உங்கள் புகார் பஞ்சாயத்து அதிகாரியிடம் வெற்றிகரமாக சேர்ப்பிக்கப்பட்டது.' : 'Your complaint has been successfully submitted.'}
              </p>

              {/* HUGE Complaint ID */}
              <div className="p-4 bg-slate-900 text-amber-400 rounded-2xl border border-amber-400/30 max-w-sm mx-auto shadow-xl my-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  {language === 'ta' ? 'உங்கள் புகார் எண் (COMPLAINT ID)' : 'YOUR COMPLAINT ID'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-amber-400 mt-1">
                  {createdComplaintId}
                </h3>
              </div>

              <p className="text-xs text-slate-600 max-w-md mx-auto italic bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                {language === 'ta' ? '💡 இந்த புகார் எண்ணை சேமித்து வைத்து, பின் புகாரின் நிலையை பார்க்கலாம்.' : '💡 Please save this Complaint ID to check your complaint status later.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleCopyId}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (language === 'ta' ? '📋 புகார் எண்ணை நகலெடு' : '📋 Copy ID')}</span>
              </button>

              <button
                onClick={handleTrackClicked}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>{language === 'ta' ? '🔎 புகாரை கண்காணி' : '🔎 Track Complaint'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* 5-Step Step-by-Step Form Wizard */
          <div className="p-5 sm:p-6 space-y-5">
            
            {/* Step Progress Tracker Indicator */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      currentStep === step
                        ? 'bg-amber-500 text-slate-950 font-bold scale-110 shadow-md ring-2 ring-amber-300'
                        : currentStep > step
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {currentStep > step ? '✓' : step}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => playStepAudioInstruction(currentStep)}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                <span>{language === 'ta' ? '🔊 கேளுங்கள்' : '🔊 Listen'}</span>
              </button>
            </div>

            {/* STEP 1: WHAT IS THE PROBLEM? */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {language === 'ta' ? '1️⃣ என்ன பிரச்சனை? (What is the problem?)' : '1️⃣ Step 1 — What is the problem?'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'ta' ? 'கீழே உள்ள பிரச்சனை வகையை தொட்டு தேர்வு செய்யுங்கள்:' : 'Tap the problem category below:'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => {
                        setCategory(c.key);
                        if (c.key === 'street_light') setPhotoUrl(PRESET_SAMPLE_PHOTOS[0].url);
                        if (c.key === 'water_supply') setPhotoUrl(PRESET_SAMPLE_PHOTOS[1].url);
                        if (c.key === 'road_pothole') setPhotoUrl(PRESET_SAMPLE_PHOTOS[2].url);
                        if (c.key === 'drainage') setPhotoUrl(PRESET_SAMPLE_PHOTOS[3].url);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-1.5 ${
                        category === c.key
                          ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400/40 scale-[1.02] shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{c.emoji}</span>
                        {category === c.key ? (
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">
                            ✓
                          </span>
                        ) : c.isHazard ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded-md">
                            ⚠️ High Priority
                          </span>
                        ) : null}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                          {language === 'ta' ? c.labelTa : c.labelEn}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">
                          {language === 'ta' ? c.descTa : c.descEn}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all active:scale-95"
                  >
                    <span>{language === 'ta' ? 'அடுத்த படி →' : 'Continue →'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: WHERE IS THE PROBLEM? */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {language === 'ta' ? '2️⃣ பிரச்சனை எங்கே உள்ளது? (Location)' : '2️⃣ Step 2 — Where is the problem?'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'ta' ? 'GPS மூலம் உங்கள் இருப்பிடத்தை எடுக்கலாம் அல்லது தேடலாம்.' : 'Use GPS auto-location or enter landmark name.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCaptureGPS}
                  disabled={isLocating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold p-3.5 rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-98"
                >
                  <MapPin className="w-4 h-4 text-amber-300" />
                  <span>{isLocating ? (language === 'ta' ? 'GPS இருப்பிடம் பதிவாகிறது...' : 'Locating with GPS...') : (language === 'ta' ? '📍 எனது தற்போதைய இருப்பிடத்தை பயன்படுத்து' : '📍 Use My Current Location')}</span>
                </button>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'ta' ? '🔍 கிராமம் / தெரு / கோவில் பெயர் தேடுக:' : '🔍 Search village / street / landmark:'}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., Near Mariamman Temple, East Street"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 font-medium text-slate-900"
                  />
                </div>

                {/* Location Confirm Box */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{language === 'ta' ? 'உறுதி செய்யப்பட்ட இடம்:' : 'Confirmed Location:'}</span>
                  <p className="font-extrabold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{address}, {village}, {district}</span>
                  </p>
                </div>

                <div className="pt-3 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{language === 'ta' ? '← பின்செல்க' : '← Back'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all active:scale-95"
                  >
                    <span>{language === 'ta' ? 'அடுத்த படி →' : 'Continue →'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ADD PHOTO */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {language === 'ta' ? '3️⃣ புகைப்படம் சேர்க்க (Add Photo)' : '3️⃣ Step 3 — Add Photo'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'ta' ? 'புகைப்படம் சேர்ப்பது அதிகாரிகள் பிரச்சனையை விரைவாக புரிந்து கொள்ள உதவும்.' : 'Adding a photo helps the officer understand the problem faster.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="relative h-44 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-sm flex items-center justify-center bg-slate-950">
                    <img
                      src={photoUrl}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_CIVIC_IMAGE;
                      }}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                      ✓ Selected Photo
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold p-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm cursor-pointer transition-all active:scale-98">
                      <Camera className="w-4 h-4 text-slate-950" />
                      <span>{language === 'ta' ? '📷 படம் எடுக்க / அப்லோட்' : '📷 Take Photo / Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleComplaintFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex items-center space-x-2 overflow-x-auto pt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold flex-shrink-0">{language === 'ta' ? 'மாதிரி படங்கள்:' : 'Sample Proofs:'}</span>
                    {PRESET_SAMPLE_PHOTOS.map((p, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => {
                          setPhotoUrl(p.url);
                          setCustomPhotoName(null);
                        }}
                        className={`w-10 h-10 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                          photoUrl === p.url && !customPhotoName ? 'border-amber-500 scale-105 shadow-md' : 'border-slate-300 opacity-60'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{language === 'ta' ? '← பின்செல்க' : '← Back'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all active:scale-95"
                  >
                    <span>{language === 'ta' ? 'அடுத்த படி →' : 'Continue →'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: DESCRIBE THE PROBLEM */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {language === 'ta' ? '4️⃣ பிரச்சனையை விவரியுங்கள் (Describe Problem)' : '4️⃣ Step 4 — Describe the problem'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'ta' ? 'பிரச்சனையை பற்றி சிறு குறிப்பு எழுதுங்கள் அல்லது குரலில் சொல்லுங்கள்.' : 'Write a short description or record a voice note.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      {language === 'ta' ? 'பிரச்சனை குறிப்பு:' : 'Describe the problem:'}
                    </label>
                    <button
                      type="button"
                      onClick={handleVoiceRecordSimulation}
                      className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        isVoiceRecording
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5 text-amber-800" />
                      <span>{isVoiceRecording ? 'பேசவும்...' : (language === 'ta' ? '🎙️ குரல் குறிப்பு' : '🎙️ Voice Note')}</span>
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    placeholder={language === 'ta' ? 'எடுத்துக்காட்டு: கோவில் அருகே உள்ள தெரு விளக்கு எரியவில்லை.' : 'Example: Street light is not working near the temple.'}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 font-medium"
                  />
                </div>

                <div className="pt-3 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{language === 'ta' ? '← பின்செல்க' : '← Back'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all active:scale-95"
                  >
                    <span>{language === 'ta' ? 'சரிபார்க்க →' : 'Review & Submit →'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & SUBMIT */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {language === 'ta' ? '5️⃣ சரிபார்த்து சமர்ப்பியுங்கள் (Review & Submit)' : '5️⃣ Step 5 — Review & Submit'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'ta' ? 'கீழே உள்ள விபரங்களை சரிபார்த்து புகாரை பதிவு செய்யவும்.' : 'Review your problem summary before final submission.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-medium">{language === 'ta' ? 'பிரச்சனை வகை:' : 'Problem:'}</span>
                    <span className="font-extrabold text-slate-900">{currentCategoryObj.emoji} {language === 'ta' ? currentCategoryObj.labelTa : currentCategoryObj.labelEn}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-medium">{language === 'ta' ? 'இருப்பிடம்:' : 'Location:'}</span>
                    <span className="font-extrabold text-slate-900 truncate max-w-[200px]">📍 {address}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-medium">{language === 'ta' ? 'புகைப்படம்:' : 'Photo:'}</span>
                    <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">✅ Photo Added</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-medium block">{language === 'ta' ? 'விளக்கம்:' : 'Description:'}</span>
                    <p className="font-semibold text-slate-900 bg-white p-2.5 rounded-xl border border-slate-200 italic">
                      "{title.trim() || (language === 'ta' ? 'கோவில் அருகே உள்ள தெரு விளக்கு எரியவில்லை.' : 'Street light is not working near the temple.')}"
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{language === 'ta' ? '← பின்செல்க' : '← Back'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl shadow-emerald-600/30 flex items-center space-x-2 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5 text-amber-300" />
                    <span>{language === 'ta' ? '✅ புகாரை பதிவு செய்' : '✅ Submit Complaint'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
