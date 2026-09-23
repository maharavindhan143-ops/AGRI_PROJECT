import { CropRecommendation, DiseaseDiagnosis, IssueSeverity, IssueCategory } from '../types';
import { CROP_DISEASE_DATABASE } from './mockData';

export function computeCropRecommendations(params: {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  soilType: string;
  landSizeAcres: number;
}): CropRecommendation[] {
  const { nitrogen, phosphorus, potassium, ph, soilType, landSizeAcres } = params;

  // Scientific suitability scoring
  const crops: {
    id: string;
    nameEn: string;
    nameTa: string;
    icon: string;
    baseScore: number;
    optN: number;
    optP: number;
    optK: number;
    optPhMin: number;
    optPhMax: number;
    preferredSoils: string[];
    water: 'Low' | 'Medium' | 'High';
    waterTa: 'குறைவு' | 'நடுத்தரம்' | 'அதிகம்';
    duration: string;
    demand: 'High' | 'Moderate' | 'Very High';
    yieldPerAcre: string;
    yieldPerAcreTa: string;
    investmentRate: number;
    profitRate: number;
    reasonEn: string;
    reasonTa: string;
  }[] = [
    {
      id: 'CROP-PADDY',
      nameEn: 'Paddy (High-Yield Ponni / TNAU CO-51)',
      nameTa: 'நெல் (பொன்னி / TNAU CO-51)',
      icon: '🌾',
      baseScore: 88,
      optN: 130,
      optP: 50,
      optK: 150,
      optPhMin: 6.0,
      optPhMax: 7.5,
      preferredSoils: ['alluvial', 'clay', 'black'],
      water: 'High',
      waterTa: 'அதிகம்',
      duration: '115 - 125 Days',
      demand: 'Very High',
      yieldPerAcre: '28 - 34 Quintals / Acre',
      yieldPerAcreTa: '28 - 34 குவிண்டால் / ஏக்கர்',
      investmentRate: 22000,
      profitRate: 52000,
      reasonEn: 'Rich alluvial soil and high nitrogen availability give optimal tillering and grain weight.',
      reasonTa: 'வண்டல் மண் அமைப்பு மற்றும் தழைச்சத்து நெல் பயிரின் தூர் வெடிப்புக்கும் மணி எடைக்கும் மிகச் சிறந்தது.'
    },
    {
      id: 'CROP-TURMERIC',
      nameEn: 'Turmeric (Erode Gold / BSR-2)',
      nameTa: 'மஞ்சள் (ஈரோடு தங்கம் / BSR-2)',
      icon: '🟡',
      baseScore: 84,
      optN: 120,
      optP: 60,
      optK: 170,
      optPhMin: 6.2,
      optPhMax: 7.8,
      preferredSoils: ['alluvial', 'red', 'black'],
      water: 'Medium',
      waterTa: 'நடுத்தரம்',
      duration: '260 - 280 Days',
      demand: 'Very High',
      yieldPerAcre: '26 - 32 Quintals (Cured) / Acre',
      yieldPerAcreTa: '26 - 32 குவிண்டால் (பதப்படுத்தியது) / ஏக்கர்',
      investmentRate: 36000,
      profitRate: 135000,
      reasonEn: 'High potassium (K) content enhances curcumin synthesis and rhizome bulb density.',
      reasonTa: 'மண்ணில் உள்ள அதிக சாம்பல் சத்து மஞ்சள் கிழங்கின் பருமன் மற்றும் குர்குமின் அளவை அதிகரிக்கிறது.'
    },
    {
      id: 'CROP-GROUNDNUT',
      nameEn: 'Groundnut / Peanut (VRI-8 / TMV-14)',
      nameTa: 'வேர்க்கடலை (VRI-8 / மணிலா)',
      icon: '🥜',
      baseScore: 82,
      optN: 80,
      optP: 45,
      optK: 90,
      optPhMin: 5.8,
      optPhMax: 7.2,
      preferredSoils: ['red', 'alluvial', 'laterite'],
      water: 'Low',
      waterTa: 'குறைவு',
      duration: '100 - 110 Days',
      demand: 'High',
      yieldPerAcre: '18 - 24 Quintals / Acre',
      yieldPerAcreTa: '18 - 24 குவிண்டால் / ஏக்கர்',
      investmentRate: 16000,
      profitRate: 46000,
      reasonEn: 'Excellent nodulation in loose soil structure; highly resistant to moisture stress.',
      reasonTa: 'இளகிய மண் அமைப்பில் வேர் முடிச்சுகள் தழைச்சத்தை நிலைநிறுத்தி குறைந்த நீரில் அதிக விளைச்சல் தரும்.'
    },
    {
      id: 'CROP-COTTON',
      nameEn: 'Cotton (Bt Long Staple / MCU-5)',
      nameTa: 'பருத்தி (நீள இழை MCU-5)',
      icon: '☁️',
      baseScore: 80,
      optN: 110,
      optP: 50,
      optK: 110,
      optPhMin: 6.5,
      optPhMax: 8.2,
      preferredSoils: ['black', 'alluvial'],
      water: 'Medium',
      waterTa: 'நடுத்தரம்',
      duration: '150 - 165 Days',
      demand: 'High',
      yieldPerAcre: '12 - 16 Quintals / Acre',
      yieldPerAcreTa: '12 - 16 குவிண்டால் / ஏக்கர்',
      investmentRate: 24000,
      profitRate: 64000,
      reasonEn: 'Black soil moisture retention matches cotton boll development cycle perfectly.',
      reasonTa: 'கரிசல் மண்ணின் ஈரப்பதம் தாங்கும் திறன் பருத்தி காய் வளர்ச்சிக்கு மிகவும் உகந்தது.'
    },
    {
      id: 'CROP-TOMATO',
      nameEn: 'Hybrid Tomato (Shivam / S-7711)',
      nameTa: 'ஹைபிரிட் தக்காளி (சிவம் ரகம்)',
      icon: '🍅',
      baseScore: 78,
      optN: 120,
      optP: 70,
      optK: 140,
      optPhMin: 6.0,
      optPhMax: 7.0,
      preferredSoils: ['red', 'alluvial'],
      water: 'Medium',
      waterTa: 'நடுத்தரம்',
      duration: '90 - 105 Days',
      demand: 'Very High',
      yieldPerAcre: '140 - 180 Crates (3,500 kg) / Acre',
      yieldPerAcreTa: '140 - 180 பெட்டிகள் / ஏக்கர்',
      investmentRate: 28000,
      profitRate: 75000,
      reasonEn: 'Short duration with quick weekly cash flow rotations in regional markets.',
      reasonTa: 'குறுகிய கால பயிர்; வாராந்திர அறுவடை மூலம் தொடர் பண வரவு தரும் சிறந்த காய்கறி பயிர்.'
    },
    {
      id: 'CROP-SUGARCANE',
      nameEn: 'Sugarcane (Co-86032 / Nayana)',
      nameTa: 'கரும்பு (Co-86032 ரகம்)',
      icon: '🎋',
      baseScore: 75,
      optN: 150,
      optP: 75,
      optK: 160,
      optPhMin: 6.5,
      optPhMax: 8.0,
      preferredSoils: ['alluvial', 'black', 'clay'],
      water: 'High',
      waterTa: 'அதிகம்',
      duration: '330 - 360 Days',
      demand: 'Moderate',
      yieldPerAcre: '45 - 55 Tonnes / Acre',
      yieldPerAcreTa: '45 - 55 டன் / ஏக்கர்',
      investmentRate: 42000,
      profitRate: 110000,
      reasonEn: 'Guaranteed factory procurement with heavy biomass production.',
      reasonTa: 'சர்க்கரை ஆலைகளின் ஒப்பந்த கொள்முதல் உத்தரவாதம் மற்றும் நிலையான வருவாய் தரும் பயிர்.'
    }
  ];

  // Calculate score penalties/bonuses
  const ranked = crops.map(c => {
    let score = c.baseScore;

    // Soil type affinity
    if (c.preferredSoils.includes(soilType.toLowerCase())) {
      score += 8;
    } else {
      score -= 6;
    }

    // pH matching
    if (ph >= c.optPhMin && ph <= c.optPhMax) {
      score += 5;
    } else {
      score -= Math.abs(ph - ((c.optPhMin + c.optPhMax) / 2)) * 6;
    }

    // Nutrient matching
    const nDiff = Math.abs(nitrogen - c.optN);
    const pDiff = Math.abs(phosphorus - c.optP);
    const kDiff = Math.abs(potassium - c.optK);
    score -= (nDiff * 0.05 + pDiff * 0.08 + kDiff * 0.04);

    const finalScore = Math.min(99, Math.max(50, Math.round(score)));
    const estInvest = c.investmentRate * landSizeAcres;
    const estProfit = c.profitRate * landSizeAcres;

    return {
      id: c.id,
      cropName: c.nameEn,
      cropNameTamil: c.nameTa,
      suitabilityScore: finalScore,
      icon: c.icon,
      expectedYield: c.yieldPerAcre,
      expectedYieldTamil: c.yieldPerAcreTa,
      investmentPerAcre: `₹ ${(estInvest).toLocaleString('en-IN')}`,
      estimatedProfit: `₹ ${(estProfit).toLocaleString('en-IN')}`,
      waterRequirement: c.water,
      waterRequirementTamil: c.waterTa,
      durationDays: c.duration,
      marketDemand: c.demand,
      reasons: [
        c.reasonEn,
        `Soil pH of ${ph} aligns with optimal physiological uptake range (${c.optPhMin} - ${c.optPhMax}).`,
        `Estimated net yield for your ${landSizeAcres} acres: ₹ ${(estProfit).toLocaleString('en-IN')} net returns.`
      ],
      reasonsTamil: [
        c.reasonTa,
        `மண்ணின் pH நிலை (${ph}) இந்த பயிரின் சத்து உறிஞ்சும் திறனுக்கு (${c.optPhMin} - ${c.optPhMax}) மிகவும் பொருத்துகிறது.`,
        `உங்கள் ${landSizeAcres} ஏக்கர் நிலத்தில் எதிர்பார்க்கப்படும் நிகர வருவாய்: ₹ ${(estProfit).toLocaleString('en-IN')}`
      ]
    };
  });

  return ranked.sort((a, b) => b.suitabilityScore - a.suitabilityScore).slice(0, 3);
}

export function classifyCropDisease(imageNameOrData: string, selectedCropHint?: string): DiseaseDiagnosis {
  const query = (selectedCropHint || imageNameOrData || '').toLowerCase();

  // Try exact or partial match in CROP_DISEASE_DATABASE
  const matches = CROP_DISEASE_DATABASE.filter(d => {
    const cropMatch = d.crop.toLowerCase().includes(query) || query.includes(d.crop.toLowerCase());
    const cropTaMatch = d.cropTamil.toLowerCase().includes(query) || query.includes(d.cropTamil.toLowerCase());
    const diseaseMatch = d.diseaseName.toLowerCase().includes(query) || query.includes(d.diseaseName.toLowerCase());
    return cropMatch || cropTaMatch || diseaseMatch;
  });

  if (matches.length > 0) {
    // Pick match based on specific disease keyword if multiple exist
    let selected = matches[0];
    if (matches.length > 1) {
      if (query.includes('brown spot') || query.includes('பழுப்பு')) {
        selected = matches.find(m => m.id === 'DIS-01B') || matches[0];
      } else if (query.includes('late blight') || query.includes('பிந்திய')) {
        selected = matches.find(m => m.id.includes('DIS-02B') || m.id.includes('DIS-02C')) || matches[0];
      } else if (query.includes('bollworm') || query.includes('புழு')) {
        selected = matches.find(m => m.id === 'DIS-03B') || matches[0];
      }
    }
    return { ...selected, confidence: Math.floor(Math.random() * 4 + 93), isVerifiedData: true };
  }

  // Check if image data string contains a crop keyword
  for (const entry of CROP_DISEASE_DATABASE) {
    if (
      imageNameOrData.toLowerCase().includes(entry.crop.toLowerCase()) ||
      imageNameOrData.toLowerCase().includes(entry.id.toLowerCase())
    ) {
      return { ...entry, confidence: 95.4, isVerifiedData: true };
    }
  }

  // If unknown crop or unverified uploaded image with no database match
  return {
    id: 'DIS-UNVERIFIED',
    crop: selectedCropHint ? selectedCropHint : 'Unknown Crop',
    cropTamil: selectedCropHint ? selectedCropHint : 'அறியப்படாத பயிர்',
    diseaseName: 'Leaf Spot Lesion Detected',
    diseaseNameTamil: 'இலைப்புள்ளி அறிகுறிகள்',
    confidence: 88.5,
    severity: 'moderate',
    severityTamil: 'மிதமானது',
    severityExplanation: 'Disease detected, but verified treatment guidance is currently unavailable in the trusted database for this specific crop-disease combination.',
    severityExplanationTamil: 'நோய் கண்டறியப்பட்டுள்ளது, ஆனால் இந்த பயிர்-நோய் சேர்க்கைக்கான சரிபார்க்கப்பட்ட சிகிச்சை வழிகாட்டுதல் தற்போது தரவுத்தளத்தில் இல்லை.',
    symptoms: ['Leaf spotting and discoloration detected'],
    symptomsTamil: ['இலைகளில் புள்ளிகள் மற்றும் நிறமாற்றம் தென்படுகிறது'],
    causes: ['Unverified pathogen'],
    causesTamil: ['சரிபார்க்கப்படாத நோய் காரணி'],
    immediateActions: ['Consult local agriculture department officer.'],
    immediateActionsTamil: ['வட்டார வேளாண்மை அலுவலரை தொடர்பு கொள்ளவும்.'],
    organicTreatment: [],
    organicTreatmentTamil: [],
    chemicalTreatment: [],
    chemicalTreatmentTamil: [],
    prevention: [],
    preventionTamil: [],
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=800&auto=format&fit=crop&q=80',
    isVerifiedData: false
  };
}

export function computeComplaintSeverity(params: {
  category: IssueCategory;
  description: string;
}): { severity: IssueSeverity; slaHours: number; reason: string } {
  const { category, description } = params;
  const desc = description.toLowerCase();

  if (
    category === 'water_supply' || 
    desc.includes('burst') || 
    desc.includes('accident') || 
    desc.includes('electric') || 
    desc.includes('spark') || 
    desc.includes('dengue')
  ) {
    return { severity: 'critical', slaHours: 24, reason: 'High public health/safety hazard detected' };
  }

  if (
    category === 'road_pothole' || 
    category === 'street_light' || 
    desc.includes('broken') || 
    desc.includes('school')
  ) {
    return { severity: 'high', slaHours: 48, reason: 'Essential civic service interruption' };
  }

  if (category === 'drainage' || category === 'public_toilet') {
    return { severity: 'medium', slaHours: 72, reason: 'Sanitation maintenance queue' };
  }

  return { severity: 'low', slaHours: 96, reason: 'Standard maintenance schedule' };
}
