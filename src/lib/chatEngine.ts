import { Complaint } from '../types';
import { CROP_DISEASE_DATABASE, CROP_PRESETS_RECOMMENDATIONS } from './mockData';

export interface ChatActionLink {
  labelEn: string;
  labelTa: string;
  url: string;
}

export interface ChatResponse {
  text: string;
  actionLink?: ChatActionLink;
  detectedIntent?: string;
  detectedEntity?: string;
}

export interface ChatHistoryItem {
  sender: 'user' | 'bot';
  text: string;
  intent?: string;
  entity?: string;
  detectedIntent?: string;
  detectedEntity?: string;
}

export interface ProcessChatParams {
  query: string;
  history: ChatHistoryItem[];
  language: 'en' | 'ta';
  complaints?: Complaint[];
}

// ----------------------------------------------------
// ENTITY & DICTIONARY MAPS
// ----------------------------------------------------

const CROP_MAP: Record<string, { en: string; ta: string }> = {
  paddy: { en: 'Paddy / Rice', ta: 'நெல்' },
  rice: { en: 'Paddy / Rice', ta: 'நெல்' },
  'நெல்': { en: 'Paddy / Rice', ta: 'நெல்' },
  tomato: { en: 'Tomato', ta: 'தக்காளி' },
  'தக்காளி': { en: 'Tomato', ta: 'தக்காளி' },
  potato: { en: 'Potato', ta: 'உருளைக்கிழங்கு' },
  'உருளை': { en: 'Potato', ta: 'உருளைக்கிழங்கு' },
  cotton: { en: 'Cotton', ta: 'பருத்தி' },
  'பருத்தி': { en: 'Cotton', ta: 'பருத்தி' },
  banana: { en: 'Banana', ta: 'வாழை' },
  'வாழை': { en: 'Banana', ta: 'வாழை' },
  chilli: { en: 'Chilli', ta: 'மிளகாய்' },
  chili: { en: 'Chilli', ta: 'மிளகாய்' },
  'மிளகாய்': { en: 'Chilli', ta: 'மிளகாய்' },
  turmeric: { en: 'Turmeric', ta: 'மஞ்சள்' },
  'மஞ்சள்': { en: 'Turmeric', ta: 'மஞ்சள்' },
  groundnut: { en: 'Groundnut', ta: 'வேர்க்கடலை' },
  'வேர்க்கடலை': { en: 'Groundnut', ta: 'வேர்க்கடலை' },
};

const DISEASE_MAP: Record<string, { id: string; en: string; ta: string }> = {
  blast: { id: 'DIS-01', en: 'Rice Blast', ta: 'நெல் குலை நோய்' },
  'rice blast': { id: 'DIS-01', en: 'Rice Blast', ta: 'நெல் குலை நோய்' },
  'குலை': { id: 'DIS-01', en: 'Rice Blast', ta: 'நெல் குலை நோய்' },
  'brown spot': { id: 'DIS-01B', en: 'Rice Brown Spot', ta: 'நெல் பழுப்பு புள்ளி நோய்' },
  'பழுப்பு புள்ளி': { id: 'DIS-01B', en: 'Rice Brown Spot', ta: 'நெல் பழுப்பு புள்ளி நோய்' },
  'early blight': { id: 'DIS-02', en: 'Tomato Early Blight', ta: 'தக்காளி முந்தைய பிளைட் நோய்' },
  'முந்தைய பிளைட்': { id: 'DIS-02', en: 'Tomato Early Blight', ta: 'தக்காளி முந்தைய பிளைட் நோய்' },
  'late blight': { id: 'DIS-02B', en: 'Tomato Late Blight', ta: 'தக்காளி பிந்திய பிளைட் நோய்' },
  'பிந்திய பிளைட்': { id: 'DIS-02B', en: 'Tomato Late Blight', ta: 'தக்காளி பிந்திய பிளைட் நோய்' },
  bollworm: { id: 'DIS-03B', en: 'Cotton American Bollworm', ta: 'பருத்தி காய் புழு சேதம்' },
  'காய் புழு': { id: 'DIS-03B', en: 'Cotton American Bollworm', ta: 'பருத்தி காய் புழு சேதம்' },
  sigatoka: { id: 'DIS-04', en: 'Banana Sigatoka Leaf Spot', ta: 'வாழை சிகடோகா இலைப்புள்ளி' },
  'சிகடோகா': { id: 'DIS-04', en: 'Banana Sigatoka Leaf Spot', ta: 'வாழை சிகடோகா இலைப்புள்ளி' },
  anthracnose: { id: 'DIS-05', en: 'Chilli Anthracnose / Fruit Rot', ta: 'மிளகாய் ஆந்த்ராக்னோஸ் / பழ அழுகல்' },
  'பழ அழுகல்': { id: 'DIS-05', en: 'Chilli Anthracnose / Fruit Rot', ta: 'மிளகாய் ஆந்த்ராக்னோஸ் / பழ அழுகல்' },
};

// Language Detector Logic
function isTamilText(text: string): boolean {
  // Check for Tamil Unicode range or common Tamil transliteration words
  if (/[\u0B80-\u0BFF]/.test(text)) return true;
  const lower = text.toLowerCase();
  const taPhoneticWords = ['enna', 'eppadi', 'yennadhu', 'sollo', 'vandhu', 'irukku', 'panradhu', 'kettal', 'theriyum', 'nanri'];
  return taPhoneticWords.some(w => lower.includes(w));
}

// Entity & Follow-Up Context Extractor
function extractEntities(query: string, history: ChatHistoryItem[]): {
  crop?: string;
  diseaseId?: string;
  diseaseNameEn?: string;
  diseaseNameTa?: string;
  complaintId?: string;
} {
  const q = query.toLowerCase();

  // 1. Complaint ID Matching (RF-YYYY-XXX or RF-XXX)
  const idMatch = query.match(/RF-\d{4}-\d{3}/i) || query.match(/RF-\d{3}/i);
  const complaintId = idMatch ? idMatch[0].toUpperCase() : undefined;

  // 2. Disease Matching
  let diseaseId: string | undefined;
  let diseaseNameEn: string | undefined;
  let diseaseNameTa: string | undefined;

  for (const [key, info] of Object.entries(DISEASE_MAP)) {
    if (q.includes(key)) {
      diseaseId = info.id;
      diseaseNameEn = info.en;
      diseaseNameTa = info.ta;
      break;
    }
  }

  // 3. Crop Matching
  let crop: string | undefined;
  for (const [key, info] of Object.entries(CROP_MAP)) {
    if (q.includes(key)) {
      crop = info.en;
      break;
    }
  }

  // 4. Follow-up Pronoun & Multi-turn Memory Resolution ("it", "this disease", "the disease", "காரணம்", "தடுப்பது", "மருந்து", "சிகிச்சை")
  if (!diseaseId && (
    q.includes('it') || 
    q.includes('this') || 
    q.includes('disease') || 
    q.includes('cure') ||
    q.includes('cause') ||
    q.includes('prevent') ||
    q.includes('treatment') ||
    q.includes('remedy') ||
    q.includes('why') ||
    q.includes('நோய்') || 
    q.includes('காரணம்') || 
    q.includes('தடுப்பது') || 
    q.includes('மருந்து') ||
    q.includes('சிகிச்சை') ||
    q.includes('இது')
  )) {
    // Scan backwards through history for previous disease entity
    for (let i = history.length - 1; i >= 0; i--) {
      const itemEntity = history[i].detectedEntity || history[i].entity;
      if (itemEntity) {
        // Try matching itemEntity against DISEASE_MAP
        const matchedEntry = Object.values(DISEASE_MAP).find(
          d => d.en.toLowerCase() === itemEntity.toLowerCase() || d.ta === itemEntity || d.id === itemEntity
        );
        if (matchedEntry) {
          diseaseId = matchedEntry.id;
          diseaseNameEn = matchedEntry.en;
          diseaseNameTa = matchedEntry.ta;
          break;
        }
      }
    }
  }

  return { crop, diseaseId, diseaseNameEn, diseaseNameTa, complaintId };
}

// Helper to look up disease object by ID or fallback
function getDiseaseObject(diseaseId?: string) {
  if (!diseaseId) return CROP_DISEASE_DATABASE[0]; // Rice Blast default
  const found = CROP_DISEASE_DATABASE.find(d => d.id === diseaseId);
  return found || CROP_DISEASE_DATABASE[0];
}

// ----------------------------------------------------
// MAIN CHAT PROCESSING ENGINE
// ----------------------------------------------------

export function processChatMessage(params: ProcessChatParams): ChatResponse {
  const { query, history, language: appLang, complaints = [] } = params;
  const q = query.toLowerCase().trim();

  // Determine output language: True if Tamil text or app language set to Tamil (unless explicit English input)
  const useTamil = isTamilText(query) || (appLang === 'ta' && !/^[a-zA-Z0-9\s?,.!'"]+$/.test(query));

  // Extract entities & multi-turn memory
  const entities = extractEntities(query, history);

  // ==================================================
  // 1. IDENTITY & GREETINGS
  // ==================================================
  if (q.includes('who are you') || q.includes('your name') || q.includes('what is your name') || q.includes('நீ யார்') || q.includes('உன் பெயர்')) {
    return {
      text: useTamil
        ? 'நான் **RuralFix – Agro MedKnow Nexus** தளத்தின் AI விவசாய உதவியாளர் & கிராம குறைதீர்ப்பு வழிகாட்டி ("AgroBot").\n\nநான் உங்களுக்கு என்னென்ன உதவிகள் செய்ய முடியும்:\n• 🌾 **பயிர் நோய் கண்டறிதல் & இயற்கை மருந்து**\n• 🛠️ **தெரு விளக்கு, சாலை, குடிநீர் புகார் பதிவு & நேரடி கண்காணிப்பு**\n• 💰 **இன்றைய மண்டி சந்தை விலை நிலவரம்**\n• 🗺️ **செயற்கைக்கோள் கிராம வரைபடம்**\n• ⚡ **அரசு மானிய திட்டங்கள் விபரம்**'
        : 'I am **AgroBot**, the AI Assistant for **RuralFix – Agro MedKnow Nexus**.\n\nHere is what I can assist you with:\n• 🌾 **Crop Disease Identification & Remedies**\n• 🛠️ **Lodge & Track Village Infrastructure Complaints** (Street Light, Roads, Water, etc.)\n• 💰 **Live Mandi Market Prices & Buyer Connections**\n• 🗺️ **Interactive Village Satellite Map**\n• ⚡ **Government Subsidies & Schemes**',
      detectedIntent: 'who_are_you',
      actionLink: { labelEn: 'Explore Features', labelTa: 'சேவைகளை காண்க', url: '/agro' }
    };
  }

  if (q === 'hi' || q === 'hello' || q === 'hey' || q.includes('vanakkam') || q.includes('வணக்கம்') || q.includes('good morning') || q.includes('good evening')) {
    return {
      text: useTamil
        ? 'வணக்கம்! நான் உங்கள் AI உழவன் தோழன். பயிர் நோய்கள், மண்டி விலை, அல்லது கிராம உள்கட்டமைப்பு புகார்கள் குறித்து ஏதேனும் கேள்வி கேட்கலாம்.'
        : 'Hello! Welcome to RuralFix – Agro MedKnow Nexus AI Assistant. How can I help you today with your farming or village grievance queries?',
      detectedIntent: 'greeting'
    };
  }

  // ==================================================
  // 2. COMPLETE WEBSITE OVERVIEW & PURPOSE
  // ==================================================
  if (
    q.includes('what can this website do') || 
    q.includes('website overview') || 
    q.includes('what is this website') || 
    q.includes('about this platform') ||
    q.includes('complete website') ||
    q.includes('இந்த தளம் என்ன செய்யும்') || 
    (q.includes('தளத்தின் பயன்பாடு') && !q.includes('அக்ரோ மெட்க்னோ')) ||
    q.includes('முழு தளம்')
  ) {
    return {
      text: useTamil
        ? '### 🌾 RuralFix – Agro MedKnow Nexus தளம்\n\nஇந்த தளம் கிராமப்புற குடிமக்களையும் விவசாயிகளையும் அரசு பஞ்சாயத்து அதிகாரிகளுடனும் வியாபாரிகளுடனும் இணைக்கும் ஒரு பூரண டிஜிட்டல் அமைப்பாகும்.\n\n**1. RuralFix (கிராம குறைதீர்ப்பு):**\n• தெரு விளக்கு, சாலை பள்ளம், குடிநீர் கசிவு, சாக்கடை அடைப்பு போன்ற புகார்களை 1 நிமிடத்தில் பதிவு செய்யலாம்.\n• குடிமகன் ➔ பஞ்சாயத்து அதிகாரி ➔ பராமரிப்பு பணியாளர் ➔ பழுது சரிசெய்தல் ➔ அதிகாரி சரிபார்ப்பு சான்று என 5-படி நேரடி கண்காணிப்பு.\n\n**2. Agro MedKnow (விவசாய வழிகாட்டி):**\n• 🔬 **AI இலை நோய் மருத்துவர்:** இலை படத்தை பதிவேற்றி நோய் கண்டறிதல் & இயற்கை மருந்து.\n• 🌱 **மண் பரிசோதனை & பயிர் தேர்வு:** NPK + pH அடிப்படையில் உகந்த பயிர் பரிந்துரை.\n• 💰 **மண்டி சந்தை விலை & வியாபாரிகள்:** நேரடி சந்தை நிலவரம் & மொத்த வியாபாரி இணைப்பு.\n• ⚡ **அரசு மானியங்கள்:** 70% சோலார் பம்புசெட், PM-KISAN, பயிர் காப்பீடு விபரம்.\n• 🗺️ **கிராம சாட்டிலைட் வரைபடம்:** இந்தியாவின் கிராமங்கள் மற்றும் குறைபாடுகளின் நேரடி வரைபடம்.'
        : '### 🌾 RuralFix – Agro MedKnow Nexus Platform\n\nOur platform connects village citizens, farmers, panchayat officers, field workers, and commodity buyers in one unified system.\n\n**1. RuralFix (Civic Infrastructure Redressal):**\n• 1-minute grievance reporting for street lights, roads, water supply, public toilets, and schools.\n• 5-stage live status tracking from citizen report to Panchayat officer verification proof.\n• Dedicated Officer Triage Hub & Field Worker Task Board.\n\n**2. Agro MedKnow (Smart Agriculture):**\n• **AI Leaf Disease Doctor:** Upload leaf image for instant diagnosis & verified cures.\n• **Soil & Crop Advisor:** NPK + pH science-backed crop suitability calculation.\n• **Mandi Market & Buyers:** Spot mandi prices and direct farmgate buyer connection.\n• **Government Schemes:** 70% Solar Pump Subsidies, PM-KISAN, Crop Insurance.\n• **Interactive Village GIS Satellite Map:** Real-time marker mapping across India.',
      detectedIntent: 'website_overview',
      actionLink: { labelEn: 'Open Dashboard', labelTa: 'முகப்பு பலகை', url: '/agro' }
    };
  }

  // ==================================================
  // 3. RURALFIX OVERVIEW & COMPLAINT REGISTRATION
  // ==================================================
  if (
    q.includes('what is ruralfix') || 
    q.includes('about ruralfix') || 
    q.includes('rural fix') ||
    q.includes('ரூரல்ஃபிக்ஸ் என்றால் என்ன') ||
    q.includes('ரூரல் பிக்ஸ்')
  ) {
    return {
      text: useTamil
        ? '### 🛠️ RuralFix என்றால் என்ன?\n\nRuralFix என்பது கிராமப்புறங்களில் உள்ள தெரு விளக்கு, சாலை பள்ளம், குடிநீர் கசிவு, சாக்கடை அடைப்பு, பள்ளி உள்கட்டமைப்பு போன்ற பொதுப் பிரச்சனைகளை எளிதாக பதிவு செய்து, பஞ்சாயத்து அதிகாரிகள் மற்றும் பணியாளர்கள் மூலம் விரைவாக சரிசெய்ய உதவும் ஒரு டிஜிட்டல் அமைப்பாகும்.\n\n**வேலைப்பாய்வு (Workflow):**\nகுடிமகன் புகார் ➔ பஞ்சாயத்து அதிகாரி பரிசீலனை ➔ பராமரிப்பு பணியாளர் நியமனம் ➔ பழுது சரிசெய்தல் (Before/After படங்கள்) ➔ அதிகாரி சரிபார்ப்பு சான்று ➔ நேரடி 5-படி கண்காணிப்பு.'
        : '### 🛠️ What is RuralFix?\n\nRuralFix is a digital civic infrastructure redressal platform designed for rural citizens to report, assign, repair, verify, and track village infrastructure problems easily.\n\n**Workflow:**\nCitizen Report ➔ Panchayat Officer Triage ➔ Field Worker Dispatched ➔ Repair Executed (Before/After Proof) ➔ Panchayat Officer Verification Audit ➔ Citizen Live Tracker.',
      detectedIntent: 'ruralfix_overview',
      actionLink: { labelEn: 'Report Problem', labelTa: 'புகார் பதிவு செய்ய', url: '/ruralfix' }
    };
  }

  if (
    q.includes('how do i register a complaint') || 
    q.includes('how to register complaint') || 
    q.includes('how to register a complaint') ||
    q.includes('how to report') ||
    q.includes('report a problem') || 
    q.includes('report issue') || 
    q.includes('register problem') ||
    q.includes('புகார் பதிவு செய்வது எப்படி') ||
    q.includes('புகார் எப்படி செய்ய வேண்டும்')
  ) {
    return {
      text: useTamil
        ? '### 📋 புகார் பதிவு செய்யும் முறைகள்:\n\n1. மேலே உள்ள **"புகார் பதிவு செய்"** பொத்தானை கிளிக் செய்யவும்.\n2. **பிரச்சனை வகையை தேர்வு செய்க:** (தெரு விளக்கு, சாலை/பள்ளம், குடிநீர், சாக்கடை, மின்சாரம், பொது கழிப்பறை).\n3. **இருப்பிடம் சேர்க்க:** `📍 எனது இருப்பிடத்தை பயன்படுத்து` அழுத்தி GPS இருப்பிடத்தை தானாக பெறலாம்.\n4. **புகைப்படம் இணைக்க:** பாதிக்கப்பட்ட இடத்தின் படத்தை மொபைல் கேமரா மூலம் அப்லோட் செய்யவும்.\n5. **சிறு குறிப்பு சேர்க்க:** குரல் பதிவு (Voice Note) அல்லது உரையாக எழுதலாம்.\n6. **சமர்ப்பி:** உங்களுக்கு தனித்துவமான **Complaint ID** (எ.கா: `RF-2026-101`) வழங்கப்படும்.'
        : '### 📋 How to Register a Complaint:\n\n1. Click the **"Report Problem"** button.\n2. **Select Problem Type:** (Street Light, Road/Pothole, Water Supply, Electricity, Public Toilet, etc.).\n3. **Add Location:** Click `📍 Use My Current Location` to auto-capture GPS coordinates.\n4. **Add Photo:** Take a photo using your phone camera or upload photo proof.\n5. **Describe Problem:** Write a brief note or use the 🎙️ Voice Note feature.\n6. **Submit:** Click submit to receive your unique **Complaint ID** (e.g. `RF-2026-101`).',
      detectedIntent: 'register_complaint',
      actionLink: { labelEn: 'Report Problem Now', labelTa: 'உடனே புகார் பதிவு செய்ய', url: '/ruralfix' }
    };
  }

  // ==================================================
  // 4. COMPLAINT TRACKING & SPECIFIC ID LOOKUP
  // ==================================================
  if (entities.complaintId) {
    const foundComp = complaints.find(c => c.id.toUpperCase() === entities.complaintId);
    if (foundComp) {
      const statusTextEn = foundComp.status.replace('_', ' ').toUpperCase();
      const statusTextTa = foundComp.status === 'verified' ? '✅ பஞ்சாயத்து அதிகாரியால் சரிபார்க்கப்பட்டது' : foundComp.status === 'repaired' ? '🟢 பழுது பார்க்கப்பட்டது' : foundComp.status === 'in_progress' ? '🟠 பணி நடந்து வருகிறது' : foundComp.status === 'assigned' ? '🟡 பணியாளர் நியமிக்கப்பட்டுள்ளார்' : '🔵 பதிவு செய்யப்பட்டது';

      return {
        text: useTamil
          ? `### 🔎 புகார் எண்: ${foundComp.id}\n\n• **தலைப்பு:** ${foundComp.title}\n• **வகை:** ${foundComp.category.replace('_', ' ').toUpperCase()}\n• **இடம்:** ${foundComp.location.address}, ${foundComp.location.village}\n• **தற்போதைய நிலை:** **${statusTextTa}**\n• **பதிவு செய்யப்பட்ட நாள்:** ${new Date(foundComp.createdAt).toLocaleDateString()}\n${foundComp.assignedWorker ? `• **நியமிக்கப்பட்ட பணியாளர்:** ${foundComp.assignedWorker.name} (${foundComp.assignedWorker.specialization})\n` : ''}${foundComp.repairNotes ? `• **பணியாளர் குறிப்பு:** "${foundComp.repairNotes}"` : ''}`
          : `### 🔎 Complaint Status: ${foundComp.id}\n\n• **Title:** ${foundComp.title}\n• **Category:** ${foundComp.category.replace('_', ' ').toUpperCase()}\n• **Location:** ${foundComp.location.address}, ${foundComp.location.village}\n• **Current Status:** **${statusTextEn}**\n• **Reported Date:** ${new Date(foundComp.createdAt).toLocaleDateString()}\n${foundComp.assignedWorker ? `• **Assigned Worker:** ${foundComp.assignedWorker.name} (${foundComp.assignedWorker.specialization})\n` : ''}${foundComp.repairNotes ? `• **Worker Repair Notes:** "${foundComp.repairNotes}"` : ''}`,
        detectedIntent: 'complaint_status_specific',
        detectedEntity: foundComp.id,
        actionLink: { labelEn: 'View Full Tracker', labelTa: 'முழு நிலை காண', url: '/ruralfix' }
      };
    } else {
      return {
        text: useTamil
          ? `புகார் எண் **"${entities.complaintId}"** கணினியில் நேரடியாக பெறப்படவில்லை. தயவுசெய்து சரியான புகார் எண்ணை சரிபார்க்கவும் (எ.கா: RF-2026-101, RF-2026-102, RF-2026-103).`
          : `Complaint ID **"${entities.complaintId}"** was not found in our live registry. Please verify your Complaint ID format (e.g. RF-2026-101, RF-2026-102, RF-2026-103).`,
        detectedIntent: 'complaint_status_not_found',
        actionLink: { labelEn: 'Open Tracker', labelTa: 'கண்காணிப்பு பக்கம்', url: '/ruralfix' }
      };
    }
  }

  // Ambiguous Status Query (Missing ID)
  if (
    q.includes('my complaint status') || 
    q.includes('check my complaint') || 
    q.includes('complaint status') ||
    q.includes('status of my complaint') ||
    q.includes('புகார் நிலை என்ன') || 
    q.includes('என் புகார்')
  ) {
    return {
      text: useTamil
        ? 'உங்கள் புகாரின் தற்போதைய நிலையை சரிபார்க்க, தயவுசெய்து உங்கள் **Complaint ID**-ஐ (எ.கா: `RF-2026-101`) உள்ளிடவும். உடனே நிலையை கண்டுபிடித்து சொல்கிறேன்!'
        : 'Please enter your **Complaint ID** (e.g. `RF-2026-101`) so I can retrieve your specific grievance status from the registry.',
      detectedIntent: 'ambiguous_status',
      actionLink: { labelEn: 'Track Complaint', labelTa: 'புகார் நிலையை காண்க', url: '/ruralfix' }
    };
  }

  if (
    q.includes('how do i track my complaint') || 
    q.includes('how to track my complaint') || 
    q.includes('how to track') || 
    q.includes('track complaint') ||
    q.includes('புகாரை கண்காணிப்பது எப்படி') ||
    q.includes('புகார் டிராக் செய்வது எப்படி')
  ) {
    return {
      text: useTamil
        ? '### 🔎 புகாரை கண்காணிக்கும் வழி:\n\n1. **"Track Complaint"** (புகார் நிலை) பக்கத்திற்குச் செல்லவும்.\n2. தேடல் பெட்டியில் உங்கள் **Complaint ID** (எ.கா: `RF-2026-101`) உள்ளிட்டு `Track Status` அழுத்தவும்.\n3. உங்கள் புகாரின் 5-படி முன்னேற்றம் (பதிவு ➔ பணியாளர் நியமனம் ➔ பணி ➔ முடிந்தது ➔ அதிகாரி சரிபார்ப்பு சான்று) திரையில் தோன்றும்.'
        : '### 🔎 How to Track Your Complaint:\n\n1. Open the **Track Complaint** page.\n2. Enter your **Complaint ID** (e.g. `RF-2026-101`) in the search box and click `Track Status`.\n3. View the live 5-stage progress timeline along with Before/After repair photo proof.',
      detectedIntent: 'track_complaint',
      actionLink: { labelEn: 'Open Tracker', labelTa: 'கண்காணிப்பு பக்கத்திற்குச் செல்ல', url: '/ruralfix' }
    };
  }

  if (q.includes('complaint categories') || q.includes('types of complaints') || q.includes('what problems can i report') || q.includes('என்னென்ன புகார்கள்')) {
    return {
      text: useTamil
        ? '### 🛠️ நீங்கள் பதிவு செய்யக்கூடிய கிராமப் புகார்கள்:\n\n1. 💡 **தெரு விளக்கு பழுது:** சோலார் விளக்கு, எல்.இ.டி பல்புகள் செயல்படாமை.\n2. 🛣️ **சாலை பழுது:** சாலை பள்ளம், மண் சரிவு, தார் சாலை சிதைவு.\n3. 🚰 **குடிநீர் விநியோகம்:** குழாய் கசிவு, சுத்திகரிக்கப்படாத நீர், நீர் அழுத்தம் இன்மை.\n4. 🚽 **பொது கழிப்பறை:** சுகாதார சீர்கேடு, கதவு/குழாய் பழுது.\n5. 🏫 **பள்ளி உள்கட்டமைப்பு:** பள்ளி கூரை, குடிநீர், சுவர்கள் பழுது.\n6. 🧹 **கழிவு மேலாண்மை:** சாக்கடை அடைப்பு, குப்பைகள் தேக்கம்.\n7. ⚡ **மின்சார ஆபத்து:** அறுந்து விழுந்த மின் கம்பிகள், மின் கம்பம் சாய்வு.'
        : '### 🛠️ Infrastructure Problem Categories You Can Report:\n\n1. 💡 **Street Light:** Solar light fixture failure, blinking LED, pole dark.\n2. 🛣️ **Road / Pothole:** Monsoon trenching, dangerous skidding potholes.\n3. 🚰 **Water Supply:** Pipeline bursts, low tap pressure, contamination.\n4. 🚽 **Public Toilet:** Broken flush valves, sanitation issues.\n5. 🏫 **School Infrastructure:** School roof leakage, compound wall repair.\n6. 🧹 **Waste & Cleanliness:** Clogged stormwater drains, mosquito breeding.\n7. ⚡ **Electricity:** Low hanging transformer wires, damaged poles.',
      detectedIntent: 'complaint_categories',
      actionLink: { labelEn: 'Report Problem', labelTa: 'புகார் செய்ய', url: '/ruralfix' }
    };
  }

  // ==================================================
  // 5. ROLES: PANCHAYAT OFFICER & FIELD WORKER
  // ==================================================
  if (
    q.includes('panchayat officer') || 
    q.includes('officer role') || 
    q.includes('what does the panchayat officer do') || 
    q.includes('officer hub') ||
    q.includes('பஞ்சாயத்து அதிகாரி')
  ) {
    return {
      text: useTamil
        ? '### 🏛️ பஞ்சாயத்து அதிகாரியின் பணிகள் (Panchayat Officer Hub):\n\n• **புகார்கள் பரிசீலனை:** கிராம மக்கள் பதிவு செய்யும் உள்கட்டமைப்பு புகார்களை ஆய்வு செய்தல்.\n• **முன்னுரிமை அளித்தல்:** அவசர குடிநீர், மின்சார ஆபத்து போன்ற புகார்களுக்கு உடனடி முன்னுரிமை (Critical Triage).\n• **பணியாளர் நியமனம்:** தகுதியான பராமரிப்பு பணியாளருக்கு (Field Worker) வேலையை ஒதுக்குதல்.\n• **சரிபார்ப்பு சான்று:** பணியாளர் சமர்ப்பிக்கும் பழுதுபார்ப்பு புகைப்படங்களை (Before/After Proof) சரிபார்த்து சான்றளித்து புகாரை முடித்து வைத்தல்.'
        : '### 🏛️ Role of Panchayat Officer (Officer Hub):\n\n• **Grievance Triage:** Review incoming village infrastructure complaints in real-time.\n• **Hazard Prioritization:** Tag urgent hazards (water leaks, hanging wires) for immediate dispatch.\n• **Worker Assignment:** Assign qualified field technicians based on specialization and availability.\n• **Verification Audit:** Inspect Before/After repair photos uploaded by workers and certify formal closure.',
      detectedIntent: 'panchayat_officer',
      actionLink: { labelEn: 'Officer Hub', labelTa: 'அதிகாரி மையம்', url: '/ruralfix/authority' }
    };
  }

  if (
    q.includes('field worker') || 
    q.includes('worker role') || 
    q.includes('role of a field worker') || 
    q.includes('worker portal') ||
    q.includes('பணியாளர்') ||
    q.includes('கடமை')
  ) {
    return {
      text: useTamil
        ? '### 👨‍🔧 பராமரிப்பு பணியாளரின் பணிகள் (Field Worker Task Board):\n\n• **பணிப் பட்டியல் பெறுதல்:** அதிகாரியால் ஒதுக்கப்பட்ட பழுதுபார்ப்பு பணிகளை தனது மொபைல் டாஷ்போர்டில் பெறுதல்.\n• **சம்பவ இடம் செல்லல்:** புகாரின் துல்லியமான GPS இருப்பிடம் மற்றும் பிரச்சனையின் புகைப்படத்தை பார்த்து நேரில் செல்லல்.\n• **வேலையை முடித்தல்:** பழுதுபார்ப்பு வேலையை முடித்து புதிய புகைப்படத்தை (After Photo) அப்லோட் செய்தல்.\n• **நிலை புதுப்பித்தல்:** புகாரின் நிலையை "Repaired" என மாற்றி அதிகாரி சரிபார்ப்புக்கு அனுப்புதல்.'
        : '### 👨‍🔧 Role of Field Worker (Task Board Portal):\n\n• **Task Intake:** View assigned repair workorders on the mobile Task Board.\n• **On-Site Navigation:** Access exact GPS coordinates and reported problem photo.\n• **Execution & Proof:** Complete the maintenance repair and upload clear After-repair photo proof.\n• **Status Update:** Update job status to "Repaired" for final Panchayat Officer audit.',
      detectedIntent: 'field_worker',
      actionLink: { labelEn: 'Worker Portal', labelTa: 'பணியாளர் போர்ட்டல்', url: '/ruralfix/worker' }
    };
  }

  // ==================================================
  // 6. VILLAGE GIS SATELLITE MAP
  // ==================================================
  if (
    q.includes('satellite map') || 
    q.includes('gis map') || 
    q.includes('village map') || 
    q.includes('how does the satellite map work') || 
    q.includes('satellite map work') ||
    q.includes('வரைபடம்') ||
    q.includes('சாட்டிலைட் வரைபடம்')
  ) {
    return {
      text: useTamil
        ? '### 🗺️ கிராம சாட்டிலைட் வரைபடம் (Village GIS Map):\n\nஎங்கள் GIS வரைபடம் இந்தியா முழுவதையும் உண்மையான செயற்கைக்கோள் (Satellite View) வழியில் காட்டுகிறது.\n\n**அம்சங்கள்:**\n• **இந்தியா ➔ மாநிலம் ➔ மாவட்டம் ➔ கிராமம்** வரை ஜூம் (Zoom) செய்து பார்க்க முடியும்.\n• 🔴 **சிவப்பு குறியீடு:** அவசர உள்கட்டமைப்பு பிரச்சனை (Critical Issue)\n• 🟠 **ஆரஞ்சு குறியீடு:** நிலுவையில் உள்ள பழுது (Pending Repair)\n• 🟢 **பச்சை குறியீடு:** அதிகாரியால் சரிபார்க்கப்பட்ட பணி (Verified Work)\n• 🔵 **நீல குறியீடு:** நேரடி மண்டி சந்தை மையம் (Mandi Hub)\n• 🌧️ **மழை குறியீடு:** விவசாய வானிலை அபாய எச்சரிக்கை (Weather Risk)'
        : '### 🗺️ Village GIS Satellite Map:\n\nOur GIS Map provides real interactive satellite views starting from full India down to village street level.\n\n**Features & Map Markers:**\n• Smooth zoom: **India ➔ State ➔ District ➔ Village**.\n• 🔴 **Red Marker:** Critical Infrastructure Hazard\n• 🟠 **Orange Marker:** Pending Repair Work\n• 🟢 **Green Marker:** Verified Completed Work\n• 🔵 **Blue Marker:** Active Mandi Market Hub\n• 🌧️ **Rain Marker:** Agricultural Weather Risk Alert',
      detectedIntent: 'gis_map',
      actionLink: { labelEn: 'Open Satellite Map', labelTa: 'சாட்டிலைட் வரைபடம் திறக்க', url: '/map' }
    };
  }

  // ==================================================
  // 7. AGRO MEDKNOW OVERVIEW & MODULES
  // ==================================================
  if (
    q.includes('agro medknow') || 
    q.includes('purpose of agro medknow') || 
    q.includes('what is agro medknow') || 
    q.includes('அக்ரோ மெட்க்னோ') ||
    (useTamil && q.includes('பயன்பாடு'))
  ) {
    return {
      text: useTamil
        ? '### 🌾 Agro MedKnow Nexus என்றால் என்ன?\n\nAgro MedKnow என்பது விவசாயிகளுக்கான முழுமையான செயற்கை நுண்ணறிவு (AI) வழிகாட்டி போர்ட்டல் ஆகும்.\n\n**முக்கிய 7 சேவைகள்:**\n1. 🔬 **AI இலை நோய் மருத்துவர்:** இலை படத்தை பதிவேற்றி நோய் கண்டறிதல் & இயற்கை சிகிச்சை.\n2. 🌱 **மண் பரிசோதனை & பயிர் தேர்வு:** pH & NPK நிலைக்கு உகந்த பயிர் பரிந்துரை.\n3. 💰 **மண்டி சந்தை விலை:** நெல், தக்காளி, மஞ்சள் நேரடி மண்டி விலை நிலவரம்.\n4. 🤝 **வியாபாரி இணைப்பு:** மொத்த வியாபாரிகளுடன் நேரடி தொடர்பு.\n5. ⚡ **அரசு மானியங்கள்:** 70% சோலார் பம்புசெட் உள்ளிட்ட மானிய விவரங்கள்.\n6. 🌤️ **வானிலை எச்சரிக்கை:** விவசாய அபாய மழை எச்சரிக்கைகள்.\n7. 📄 **அறிக்கைகள் PDF:** விவசாய வழிகாட்டி சான்றிதழ் தரவிறக்கம்.'
        : '### 🌾 Purpose of Agro MedKnow Nexus:\n\nAgro MedKnow is an intelligent AI agronomic guidance suite for farmers.\n\n**7 Integrated Modules:**\n1. 🔬 **AI Leaf Disease Doctor:** Photo-based disease diagnosis & verified cures.\n2. 🌱 **Soil & Crop Advisor:** Science-backed crop suitability (NPK & pH matching).\n3. 💰 **Mandi Market Rates:** Live spot prices across regional wholesale mandis.\n4. 🤝 **Buyer Connections:** Direct contact with verified regional commodity buyers.\n5. ⚡ **Government Schemes:** Capital subsidies (70% Solar Pump, PM-KISAN, PMFBY).\n6. 🌤️ **Agri-Weather:** Local weather alerts & risk mitigation.\n7. 📄 **PDF Reports:** Downloadable summary reports for bank/agri loans.',
      detectedIntent: 'agro_medknow_overview',
      actionLink: { labelEn: 'Open Farmer Hub', labelTa: 'விவசாய மையம்', url: '/agro' }
    };
  }

  // ==================================================
  // 8. CROP DISEASE KNOWLEDGE (RICE BLAST, EARLY BLIGHT, ETC.)
  // ==================================================
  if (
    q.includes('detect crop disease') || 
    q.includes('how can i detect crop disease') || 
    q.includes('how to detect crop disease') || 
    q.includes('leaf doctor') || 
    q.includes('disease doctor') || 
    q.includes('இலை மருத்துவர்') ||
    q.includes('இலை நோய்') ||
    q.includes('பயிர் நோய்') ||
    q.includes('கண்டறிவது எப்படி')
  ) {
    return {
      text: useTamil
        ? '### 🔬 AI இலை நோய் மருத்துவர் (Leaf Disease Doctor):\n\nஉங்கள் பயிர் இலையின் படத்தை அப்லோட் செய்தால் எங்கள் AI 3 வினாடிகளில் நோயை கண்டறியும்.\n\n**செயல்முறை (Workflow):**\n1. **படம் பதிவேற்றம்:** பாதிக்கப்பட்ட இலையின் தெளிவான படத்தை அப்லோட் செய்யவும்.\n2. **AI பகுப்பாய்வு:** பயிர் வகை மற்றும் நோயை துல்லியமாக கண்டறிதல்.\n3. **காரணம் & அறிகுறிகள்:** நோய் ஏற்பட்ட சுற்றுச்சூழல் காரணம்.\n4. **உடனடி அவசர நடவடிக்கை:** பயிரை காப்பாற்ற 5 அவசர நடவடிக்கைகள்.\n5. **சிகிச்சை வழிகாட்டி:** இயற்கை மருந்து மற்றும் அங்கீகரிக்கப்பட்ட இரசாயன அளவு.'
        : '### 🔬 AI Leaf Disease Doctor Workflow:\n\nUpload a photo of any diseased leaf to receive instant AI agronomic diagnosis.\n\n**Workflow & Analysis:**\n1. **Photo Upload:** Upload a clear image of the infected leaf blade.\n2. **Crop & Pathogen Identification:** 94%+ confidence detection of pathogen.\n3. **Causes & Symptoms:** Environmental triggers & lesion patterns.\n4. **Immediate 5-Step Action Plan:** Emergency steps to protect remaining crop.\n5. **Treatment Protocol:** Verified organic remedies & chemical controls with safe dosage.',
      detectedIntent: 'crop_disease_detect',
      actionLink: { labelEn: 'Scan Leaf Photo', labelTa: 'இலை படத்தை ஸ்கேன் செய்ய', url: '/agro/disease-detect' }
    };
  }

  // Specific Disease Questions Handling (Rice Blast, Early Blight, etc.)
  if (entities.diseaseId || q.includes('rice blast') || q.includes('blast') || q.includes('குலை நோய்')) {
    const diseaseObj = getDiseaseObject(entities.diseaseId || 'DIS-01');

    // 8a. Why / Causes Question
    if (q.includes('why') || q.includes('cause') || q.includes('occur') || q.includes('காரணம்') || q.includes('வர காரணம்')) {
      const causesListTa = diseaseObj.causesTamil || diseaseObj.causes || [];
      const causesListEn = diseaseObj.causes || [];
      return {
        text: useTamil
          ? `### 🦠 ${diseaseObj.cropTamil} - ${diseaseObj.diseaseNameTamil} வரக் காரணம்:\n\n• **நோய்க்காரணி:** ${diseaseObj.pathogenName || 'பூஞ்சாணம்'}\n• **சாதகமான சூழல்:** ${diseaseObj.favorableConditionsTamil || 'அதிக காற்றில் ஈரப்பதம் (>90%), இரவு நேரத்தில் 20-23°C வெப்பநிலை மற்றும் அளவுக்கு அதிகமாக யூரியா உரம் இடுதல்.'}\n\n**முக்கிய காரணங்கள்:**\n${causesListTa.map(c => `• ${c}`).join('\n')}`
          : `### 🦠 Why does ${diseaseObj.crop} ${diseaseObj.diseaseName} occur?\n\n• **Pathogen:** ${diseaseObj.pathogenName || 'Fungal spores'}\n• **Favorable Conditions:** ${diseaseObj.favorableConditions || 'High relative humidity (>90%), cool night temperatures (20-23°C), and excessive nitrogenous fertilizer application.'}\n\n**Primary Causes:**\n${causesListEn.map(c => `• ${c}`).join('\n')}`,
        detectedIntent: 'disease_causes',
        detectedEntity: diseaseObj.diseaseName,
        actionLink: { labelEn: 'Disease Doctor', labelTa: 'இலை மருத்துவருக்கு செல்ல', url: '/agro/disease-detect' }
      };
    }

    // 8b. Prevention Question
    if (q.includes('prevent') || q.includes('avoid') || q.includes('தடுப்பது') || q.includes('முன்னெச்சரிக்கை') || q.includes('தடுக்க')) {
      const prevList = diseaseObj.preventionTamil || diseaseObj.prevention || [];
      return {
        text: useTamil
          ? `### 🛡️ ${diseaseObj.cropTamil} - ${diseaseObj.diseaseNameTamil} தடுக்கும் முறைகள்:\n\n${prevList.map(p => `• ${p}`).join('\n')}\n\n💡 *முன்னெச்சரிக்கை:* நோய் எதிர்ப்பு திறன் கொண்ட CO-51 அல்லது பொன்னி ரகங்களை பயன்படுத்தவும்.`
          : `### 🛡️ How to Prevent ${diseaseObj.crop} ${diseaseObj.diseaseName}:\n\n${diseaseObj.prevention.map(p => `• ${p}`).join('\n')}\n\n💡 *Pro-Tip:* Use resistant varieties such as TNAU CO-51 or CR-1009.`,
        detectedIntent: 'disease_prevention',
        detectedEntity: diseaseObj.diseaseName,
        actionLink: { labelEn: 'Disease Doctor', labelTa: 'இலை மருத்துவருக்கு செல்ல', url: '/agro/disease-detect' }
      };
    }

    // 8c. Treatment / Cure Question
    if (q.includes('treat') || q.includes('cure') || q.includes('remedy') || q.includes('medicine') || q.includes('spray') || q.includes('மருந்து') || q.includes('சிகிச்சை')) {
      const orgList = diseaseObj.organicTreatmentTamil || diseaseObj.organicTreatment || [];
      const chemList = diseaseObj.chemicalTreatmentTamil || diseaseObj.chemicalTreatment || [];
      return {
        text: useTamil
          ? `### 💊 ${diseaseObj.cropTamil} - ${diseaseObj.diseaseNameTamil} சிகிச்சை வழிகாட்டி:\n\n**🌿 இயற்கை வழி சிகிச்சை:**\n${orgList.map(o => `• ${o}`).join('\n')}\n\n**🧪 அங்கீகரிக்கப்பட்ட வேதியியல் சிகிச்சை:**\n${chemList.map(c => `• ${c}`).join('\n')}\n\n⚠️ *பாதுகாப்பு எச்சரிக்கை:* பரிந்துரைக்கப்பட்ட அளவை மட்டுமே தெளிக்கவும். மருந்து தெளிக்கும் முன் வேளாண் உதவி அதிகாரியிடம் ஆலோசிக்கவும்.`
          : `### 💊 Treatment for ${diseaseObj.crop} ${diseaseObj.diseaseName}:\n\n**🌿 Organic Remedies:**\n${diseaseObj.organicTreatment.map(o => `• ${o}`).join('\n')}\n\n**🧪 Approved Chemical Controls:**\n${diseaseObj.chemicalTreatment.map(c => `• ${c}`).join('\n')}\n\n⚠️ *Safety Disclaimer:* Follow exact recommended spray dosages and consult local agricultural extension officers.`,
        detectedIntent: 'disease_treatment',
        detectedEntity: diseaseObj.diseaseName,
        actionLink: { labelEn: 'Disease Doctor', labelTa: 'இலை மருத்துவருக்கு செல்ல', url: '/agro/disease-detect' }
      };
    }

    // 8d. Default "What is Rice Blast" or Disease Overview
    const sympList = diseaseObj.symptomsTamil || diseaseObj.symptoms || [];
    return {
      text: useTamil
        ? `### 🌾 ${diseaseObj.cropTamil} - ${diseaseObj.diseaseNameTamil} (${diseaseObj.pathogenName || ''})\n\n• **நோய் வகை:** பூஞ்சான் நோய் (${diseaseObj.severityTamil || diseaseObj.severity} பாதிப்பு)\n• **அறிகுறிகள்:** ${sympList.join(', ')}\n• **பாதிப்பு:** இலைகளில் கண் வடிவிலான சாம்பல் பழுப்பு புள்ளிகள் தோன்றி பயிர் காய்ந்துவிடும்.\n\nஇந்நோயின் **காரணம்**, **தடுப்பு முறைகள்** அல்லது **இயற்கை மருந்துகள்** பற்றி கேட்கலாம்!`
        : `### 🌾 ${diseaseObj.crop} - ${diseaseObj.diseaseName} (${diseaseObj.pathogenName || ''})\n\n• **Disease Category:** Fungal Pathogen (${diseaseObj.severity.toUpperCase()} Severity)\n• **Key Symptoms:** ${diseaseObj.symptoms.join(', ')}\n• **Impact:** Spindle-shaped leaf lesions causing severe photosynthetic loss and node breakage.\n\nYou can ask me about its causes, prevention methods, or organic/chemical treatments!`,
      detectedIntent: 'disease_what_is',
      detectedEntity: diseaseObj.diseaseName,
      actionLink: { labelEn: 'Open Disease Doctor', labelTa: 'நோய் மருத்துவம் காண்க', url: '/agro/disease-detect' }
    };
  }

  // Ambiguous Treatment Query (Missing Disease Name)
  if (
    q.includes('what treatment should i use') || 
    q.includes('what treatment') || 
    q.includes('what cure') || 
    q.includes('what medicine') ||
    q.includes('என்ன மருந்து') || 
    q.includes('சிகிச்சை என்ன')
  ) {
    return {
      text: useTamil
        ? 'எந்த பயிர் அல்லது நோய்க்கு மருந்து தேவை? தயவுசெய்து பயிர் பெயரை குறிப்பிடவும் (எ.கா: நெல் குலை நோய், தக்காளி பிளைட்) அல்லது "AI Leaf Disease Doctor" பக்கத்தில் இலை படத்தை பதிவேற்றவும்.'
        : 'For which crop or disease do you need treatment guidance? Please specify the crop name (e.g. Rice Blast, Tomato Early Blight) or upload a leaf photo in our Disease Doctor tab.',
      detectedIntent: 'ambiguous_treatment',
      actionLink: { labelEn: 'Open Disease Doctor', labelTa: 'இலை மருத்துவருக்கு செல்ல', url: '/agro/disease-detect' }
    };
  }

  // ==================================================
  // 9. MANDI MARKET, PRICES & BUYERS
  // ==================================================
  if (
    q.includes('today\'s paddy price') || 
    q.includes('paddy price') || 
    q.includes('price of paddy') || 
    q.includes('rice price') ||
    q.includes('நெல் விலை') ||
    q.includes('நெல் மண்டி')
  ) {
    return {
      text: useTamil
        ? '### 🌾 இன்றைய நெல் மண்டி விலை நிலவரம் (தஞ்சாவூர் & திருவாரூர்):\n\n• **தற்போதைய சந்தை விலை:** ₹2,480 / குவிண்டால் (+₹45 உயர்வு)\n• **சந்தை நிலை:** 🟢 நல்ல விலை நிலவரம் (High MSP buffer)\n• **ஆலோசனை:** அரிசி ஆலைகளின் கொள்முதல் தேவை அதிகமாக உள்ளதால் இப்போது விற்பனை செய்ய ஏற்ற நேரம்.'
        : '### 🌾 Today\'s Paddy Market Intelligence (Thanjavur Mandi):\n\n• **Current Spot Price:** ₹2,480 / Quintal (+₹45 change)\n• **Market Condition:** 🟢 Strong Price Trend (High MSP buffer)\n• **Advisory:** High rice mill procurement demand. Favorable window for farmgate sales.',
      detectedIntent: 'paddy_price',
      actionLink: { labelEn: 'Check Mandi Prices', labelTa: 'மண்டி விலை பார்க்க', url: '/agro/market' }
    };
  }

  if (
    q.includes('find buyer') || 
    q.includes('find a buyer') || 
    q.includes('how to sell crop') || 
    q.includes('sell my crop') ||
    q.includes('buyers') ||
    q.includes('வியாபாரி') ||
    q.includes('விற்பனை செய்ய')
  ) {
    return {
      text: useTamil
        ? '### 🤝 விவசாய பொருட்கள் விற்பனை & மொத்த வியாபாரிகள்:\n\nஎங்கள் **Mandi Market** பக்கத்தில் சரிபார்க்கப்பட்ட மண்டல மொத்த வியாபாரிகள் (Exporters & Mill Owners) தொடர்பு எண்கள் உள்ளன.\n\n1. மண்டி பக்கத்திற்கு செல்லவும்.\n2. **"Find Buyer"** பொத்தானை அழுத்தவும்.\n3. உங்கள் விளைபொருளின் அளவு மற்றும் இடத்தை கூறி நேரடியாக வண்டி எடுத்துச் செல்ல பேசலாம்.'
        : '### 🤝 Direct Buyer Connection & Farmgate Sales:\n\nConnect directly with verified regional exporters and mill owners in our **Mandi Market** tab.\n\n1. Open Mandi Market & Buyers page.\n2. Click **"Find Buyer"** next to your commodity.\n3. Contact verified wholesale buyers directly for farmgate pickup.',
      detectedIntent: 'find_buyers',
      actionLink: { labelEn: 'Open Mandi Market', labelTa: 'மண்டி சந்தைக்கு செல்ல', url: '/agro/market' }
    };
  }

  if (
    q.includes('mandi') || 
    q.includes('market price') || 
    q.includes('spot price') ||
    q.includes('மண்டி') || 
    q.includes('சந்தை விலை')
  ) {
    return {
      text: useTamil
        ? '### 💰 மண்டி சந்தை நேரடி விலை நிலவரம் (தமிழ்நாடு):\n\n• **நெல் (தஞ்சாவூர்):** ₹2,480 / குவிண்டால் (+₹45)\n• **மஞ்சள் (ஈரோடு):** ₹14,850 / குவிண்டால் (+₹320)\n• **தக்காளி (ஒட்டன்சத்திரம்):** ₹420 / பெட்டி (25 கிலோ)\n• **பருத்தி (தேனி):** ₹7,250 / குவிண்டால் (+₹110)'
        : '### 💰 Mandi Market Spot Prices (Tamil Nadu Mandis):\n\n• **Paddy (Thanjavur):** ₹2,480 / Quintal (+₹45)\n• **Turmeric (Erode):** ₹14,850 / Quintal (+₹320)\n• **Tomato (Ottanchatram):** ₹420 / Crate (25kg)\n• **Cotton (Theni):** ₹7,250 / Quintal (+₹110)',
      detectedIntent: 'mandi_market',
      actionLink: { labelEn: 'View Live Mandi', labelTa: 'நேரடி மண்டி பார்க்க', url: '/agro/market' }
    };
  }

  // Ambiguous Price Query (Missing Crop Name)
  if (
    q.includes('what is the price') || 
    q.includes('what price') || 
    q.includes('price of') ||
    q.includes('என்ன விலை')
  ) {
    return {
      text: useTamil
        ? 'எந்த பயிரின் மண்டி சந்தை விலை நிலவரம் வேண்டும்? (எ.கா: நெல், தக்காளி, மஞ்சள், பருத்தி)'
        : 'Which crop\'s market price would you like to check? (e.g. Paddy, Tomato, Turmeric, Cotton)',
      detectedIntent: 'ambiguous_price',
      actionLink: { labelEn: 'Open Mandi Market', labelTa: 'மண்டி சந்தைக்கு செல்ல', url: '/agro/market' }
    };
  }

  // ==================================================
  // 10. SOIL & CROP ADVISOR
  // ==================================================
  if (
    q.includes('suitable for my soil') || 
    q.includes('which crop is suitable') || 
    q.includes('soil advice') || 
    q.includes('crop advisor') || 
    q.includes('crop recommendation') ||
    q.includes('soil test') ||
    q.includes('மண்') || 
    q.includes('பயிர் தேர்வு') ||
    q.includes('நிலத்திற்கு') ||
    q.includes('உகந்த பயிர்')
  ) {
    return {
      text: useTamil
        ? '### 🌱 மண் பரிசோதனை & உகந்த பயிர் பரிந்துரை (Soil Advisor):\n\nஉங்கள் நிலத்தின் மண் வகை (வண்டல் மண், கரிசல் மண், செம்மண்), pH நிலை மற்றும் N-P-K சத்து அளவுகளை உள்ளிட்டால் அறிவியல் பூர்வமாக உகந்த 3 பயிர்களை எங்கள் கணினி பரிந்துரைக்கும்.\n\n**உதாரணம்:**\nதழைச்சத்து 140 kg/ha, சாம்பல் சத்து 165 kg/ha மற்றும் pH 6.8 கொண்ட வண்டல் மண்ணிற்கு **நெல் (TNAU CO-51)** மற்றும் **மஞ்சள் (ஈரோடு BSR-2)** 96% உகந்தது.'
        : '### 🌱 Soil & Crop Suitability Advisor:\n\nEnter your soil test values (Nitrogen, Phosphorus, Potassium, pH, Soil Type, and Land Acreage) to receive scientifically calculated crop suitability scores and estimated net profit per acre.\n\n**Example Match:**\nFor Alluvial Loam with N=140, K=165, and pH=6.8, **Paddy (TNAU CO-51)** and **Turmeric (Erode BSR-2)** yield a 96% suitability score.',
      detectedIntent: 'soil_crop_advisor',
      actionLink: { labelEn: 'Open Soil Advisor', labelTa: 'மண் பரிசோதனைக்கு செல்ல', url: '/agro/recommend' }
    };
  }

  // ==================================================
  // 11. GOVERNMENT SCHEMES & SUBSIDIES
  // ==================================================
  if (
    q.includes('government scheme') || 
    q.includes('schemes') || 
    q.includes('subsidy') || 
    q.includes('subsidies') || 
    q.includes('solar pump') || 
    q.includes('pm-kisan') ||
    q.includes('மானிய') || 
    q.includes('அரசு திட்டம்')
  ) {
    return {
      text: useTamil
        ? '### ⚡ தமிழக அரசு விவசாய மானிய திட்டங்கள்:\n\n1. **70% சூரியசக்தி பம்புசெட் மானியம்:** 5HP-10HP சோலார் பம்புகளுக்கு ₹2,40,000 வரை மானியம்.\n2. **சொட்டுநீர் பாசன மானியம் (Micro-Irrigation):** சிறு மற்றும் குறு விவசாயிகளுக்கு 100% மானியம்.\n3. **PM-KISAN சம்மான் நிதி:** ஆண்டுக்கு ₹6,000 நேரடி உதவித் தொகை (3 தவணைகள்).\n4. **பிரதான் மந்திரி பயிர் காப்பீட்டுத் திட்டம் (PMFBY):** இயற்கை பேரிடர் இழப்பீடு.'
        : '### ⚡ Tamil Nadu Agricultural Subsidies & Schemes:\n\n1. **70% Solar Agriculture Pump Subsidy:** Capital subsidy up to ₹2.4 Lakhs for 5HP to 10HP pumpsets.\n2. **Micro-Irrigation (Drip/Sprinkler):** 100% subsidy for small/marginal farmers.\n3. **PM-KISAN Samman Nidhi:** ₹6,000 annual direct financial benefit in 3 instalments.\n4. **Pradhan Mantri Fasal Bima Yojana (PMFBY):** Crop insurance coverage against natural calamities.',
      detectedIntent: 'govt_schemes',
      actionLink: { labelEn: 'View Govt Schemes', labelTa: 'அரசு திட்டங்களை பார்க்க', url: '/agro/schemes' }
    };
  }

  // ==================================================
  // 12. WEATHER & AGRICULTURAL RISKS
  // ==================================================
  if (
    q.includes('weather') || 
    q.includes('rain') || 
    q.includes('temperature') || 
    q.includes('forecast') ||
    q.includes('வானிலை') || 
    q.includes('மழை')
  ) {
    return {
      text: useTamil
        ? '### 🌤️ விவசாய வானிலை & அபாய எச்சரிக்கை (Thanjavur Delta Zone):\n\n• **வெப்பநிலை:** 32°C (அதிகபட்சம்) / 24°C (குறைந்தபட்சம்)\n• **ஈரப்பதம்:** 78%\n• **மழை வாய்ப்பு:** 40% மிதமான மழை வாய்ப்பு\n• **விவசாய எச்சரிக்கை:** பூக்கும் தருணத்தில் உள்ள நெல் பயிர்களுக்கு நோய் பரவாமல் இருக்க வடிநீர் வசதியை தயார் நிலையில் வைக்கவும்.'
        : '### 🌤️ Agricultural Weather Intelligence (Thanjavur Delta Zone):\n\n• **Temperature:** 32°C High / 24°C Low\n• **Relative Humidity:** 78%\n• **Precipitation:** 40% chance of light monsoon showers\n• **Agri Risk Alert:** Ensure proper field drainage to prevent moisture accumulation during flowering stage.',
      detectedIntent: 'weather',
      actionLink: { labelEn: 'Open Weather Hub', labelTa: 'வானிலை மையம்', url: '/agro' }
    };
  }

  // ==================================================
  // 13. INTENT FALLBACK (GUIDED OPTIONS)
  // ==================================================
  return {
    text: useTamil
      ? 'நீங்கள் எந்த தகவலை கேட்கிறீர்கள் என்று தெளிவாக புரியவில்லை. கீழே உள்ள முக்கிய தலைப்புகளில் ஒன்றை தேர்வு செய்யலாம் அல்லது உங்கள் கேள்வியை தெளிவாக கேட்கலாம்:\n\n1. 🛠️ **புகார் பதிவு செய்ய** (Report Infrastructure Problem)\n2. 🔎 **புகார் நிலை அறிய** (Track Complaint ID)\n3. 🔬 **பயிர் நோய் கண்டறிய** (Crop Disease Doctor)\n4. 💰 **மண்டி சந்தை விலை** (Live Mandi Rates)\n5. 🌱 **மண் பரிசோதனை** (Soil & Crop Advisor)\n6. 🗺️ **கிராம சாட்டிலைட் வரைபடம்** (GIS Map)\n7. ⚡ **அரசு மானிய திட்டங்கள்** (Government Schemes)'
      : 'I am not fully sure what you are asking. Please choose from one of the topics below or ask a specific question:\n\n1. 🛠️ **Report Infrastructure Problem**\n2. 🔎 **Track Complaint Status**\n3. 🔬 **Crop Disease Cure & Diagnosis**\n4. 💰 **Live Mandi Market Prices**\n5. 🌱 **Soil & Crop Suitability Advisor**\n6. 🗺️ **Interactive Village GIS Map**\n7. ⚡ **Government Subsidies & Schemes**',
    detectedIntent: 'fallback',
    actionLink: { labelEn: 'Browse Dashboard', labelTa: 'முகப்பு பலகை', url: '/agro' }
  };
}

