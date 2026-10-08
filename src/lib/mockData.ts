import { 
  Complaint, 
  WorkerProfile, 
  FarmerProfile, 
  CropRecommendation, 
  DiseaseDiagnosis, 
  MandiPrice, 
  WholesalerBuyer, 
  GovtScheme, 
  WeatherData 
} from '../types';

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'RF-2026-101',
    title: 'Main Street Solar Light Defective & Blinking',
    category: 'street_light',
    description: 'The solar street light near the village temple intersection has been flickering and going dark at night, causing safety issues for women and elderly walking late.',
    location: {
      address: 'Near Mariamman Temple, East Street',
      village: 'Ammapettai',
      panchayat: 'Ammapettai Gram Panchayat',
      district: 'Thanjavur',
      state: 'Tamil Nadu',
      lat: 10.7905,
      lng: 79.1378,
    },
    photoBefore: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=80',
    photoAfter: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=800&auto=format&fit=crop&q=80',
    severity: 'high',
    status: 'verified',
    reportedBy: {
      name: 'Murugesan K.',
      phone: '+91 98421 78901',
    },
    assignedWorker: {
      id: 'WRK-01',
      name: 'Selvakumar R.',
      phone: '+91 94432 11029',
      specialization: 'Electrical & Solar Systems',
    },
    assignedAt: '2026-08-20T09:30:00Z',
    repairedAt: '2026-08-21T14:15:00Z',
    verifiedAt: '2026-08-22T10:00:00Z',
    repairNotes: 'Replaced faulty 40W LED driver unit and cleaned dust accumulation on 100W monocrystalline solar panel. Re-aligned pole battery connection.',
    materialsUsed: ['40W LED Luminaire Kit', 'Solar Charge Controller 12V/10A', '10m Weatherproof Cable'],
    citizenRating: 5,
    citizenFeedback: 'Prompt action by panchayat team! The street light is bright and working properly now. Thank you.',
    createdAt: '2026-08-19T18:45:00Z',
    updatedAt: '2026-08-22T10:00:00Z',
  },
  {
    id: 'RF-2026-102',
    title: 'Severe Road Pothole & Waterlogging near Primary Health Sub-Centre',
    category: 'road_pothole',
    description: 'Monsoon runoff has created a deep 2-foot trench across the main connecting road. Two two-wheeler skidding incidents reported yesterday.',
    location: {
      address: 'Hospital Road, opposite PHC Gate',
      village: 'Kalligudi',
      panchayat: 'Kalligudi Panchayat Union',
      district: 'Madurai',
      state: 'Tamil Nadu',
      lat: 9.7214,
      lng: 77.9421,
    },
    photoBefore: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    photoAfter: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    severity: 'critical',
    status: 'in_progress',
    reportedBy: {
      name: 'Dr. Kavitha S.',
      phone: '+91 97890 23412',
    },
    assignedWorker: {
      id: 'WRK-02',
      name: 'Palanivel M.',
      phone: '+91 98940 55671',
      specialization: 'Civil & Road Infrastructure',
    },
    assignedAt: '2026-08-22T08:00:00Z',
    createdAt: '2026-08-21T16:20:00Z',
    updatedAt: '2026-08-22T08:30:00Z',
  },
  {
    id: 'RF-2026-103',
    title: 'Drinking Water Pipeline Burst & Pressure Drop',
    category: 'water_supply',
    description: 'Main 3-inch PVC distribution pipe leaking drinking water into ditch. 45 households in West Colony have received zero tap water for 24 hours.',
    location: {
      address: 'Water Tank Ward 4, West Colony',
      village: 'Sulur Rural',
      panchayat: 'Sulur Town Panchayat',
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      lat: 11.0269,
      lng: 77.1264,
    },
    photoBefore: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80',
    severity: 'critical',
    status: 'assigned',
    reportedBy: {
      name: 'Annamalai V.',
      phone: '+91 94421 66890',
    },
    assignedWorker: {
      id: 'WRK-03',
      name: 'Ramu S.',
      phone: '+91 97500 88210',
      specialization: 'Plumbing & Hydraulic Pipeline',
    },
    assignedAt: '2026-08-22T09:15:00Z',
    createdAt: '2026-08-22T06:10:00Z',
    updatedAt: '2026-08-22T09:15:00Z',
  },
  {
    id: 'RF-2026-104',
    title: 'Clogged Drainage Causing Mosquito Breeding near Govt School',
    category: 'drainage',
    description: 'Stormwater drainage canal blocked by silt and plastic waste. Foul smell and dengue risk for 320 children studying at Govt Middle School.',
    location: {
      address: 'School Lane, Ward 2',
      village: 'Alangudi',
      panchayat: 'Alangudi Gram Panchayat',
      district: 'Pudukkottai',
      state: 'Tamil Nadu',
      lat: 10.3601,
      lng: 78.9805,
    },
    photoBefore: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    severity: 'high',
    status: 'reported',
    reportedBy: {
      name: 'Headmaster S. Ramanathan',
      phone: '+91 98402 33499',
    },
    createdAt: '2026-08-22T11:40:00Z',
    updatedAt: '2026-08-22T11:40:00Z',
  },
  {
    id: 'RF-2026-105',
    title: 'Public Sanitation Complex Flush Valve Broken',
    category: 'public_toilet',
    description: 'Women section flushing cistern and door latch damaged. Needs immediate sanitization and replacement of dual-flush valve.',
    location: {
      address: 'Weekly Santhai Ground',
      village: 'Omalur',
      panchayat: 'Omalur Town Panchayat',
      district: 'Salem',
      state: 'Tamil Nadu',
      lat: 11.7454,
      lng: 78.0416,
    },
    photoBefore: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    photoAfter: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop&q=80',
    severity: 'medium',
    status: 'repaired',
    reportedBy: {
      name: 'Lakshmi Devi',
      phone: '+91 99430 45120',
    },
    assignedWorker: {
      id: 'WRK-03',
      name: 'Ramu S.',
      phone: '+91 97500 88210',
      specialization: 'Plumbing & Hydraulic Pipeline',
    },
    assignedAt: '2026-08-21T10:00:00Z',
    repairedAt: '2026-08-22T15:30:00Z',
    repairNotes: 'Installed new heavy-duty brass ball valve and replaced stainless steel door latch. Disinfected entire toilet block with bleaching powder.',
    materialsUsed: ['Brass Cistern Valve', 'SS Latch', 'Bleaching Powder 5kg'],
    createdAt: '2026-08-20T14:10:00Z',
    updatedAt: '2026-08-22T15:30:00Z',
  }
];

export const WORKERS_LIST: WorkerProfile[] = [
  {
    id: 'WRK-01',
    name: 'Selvakumar R.',
    phone: '+91 94432 11029',
    specialization: 'Electrical & Solar Systems',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    activeTasks: 1,
    completedTasks: 38,
    rating: 4.9,
    status: 'on_duty',
  },
  {
    id: 'WRK-02',
    name: 'Palanivel M.',
    phone: '+91 98940 55671',
    specialization: 'Civil & Road Infrastructure',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    activeTasks: 2,
    completedTasks: 54,
    rating: 4.8,
    status: 'on_duty',
  },
  {
    id: 'WRK-03',
    name: 'Ramu S.',
    phone: '+91 97500 88210',
    specialization: 'Plumbing & Hydraulic Pipeline',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    activeTasks: 1,
    completedTasks: 42,
    rating: 4.7,
    status: 'available',
  },
  {
    id: 'WRK-04',
    name: 'Dhanalakshmi K.',
    phone: '+91 96290 77312',
    specialization: 'Sanitation & Solid Waste Management',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    activeTasks: 0,
    completedTasks: 61,
    rating: 4.95,
    status: 'available',
  }
];

export const INITIAL_FARMER_PROFILE: FarmerProfile = {
  id: 'FARM-TN-8092',
  name: 'Muthusamy Gounder',
  phone: '+91 98428 54321',
  village: 'Pattukkottai Rural',
  panchayat: 'Pattukkottai Block',
  district: 'Thanjavur',
  soilType: 'alluvial',
  landSizeAcres: 4.5,
  primaryCrop: 'Paddy (Ponni Rice)',
  irrigationSource: 'borewell',
  nitrogen: 140,
  phosphorus: 55,
  potassium: 165,
  ph: 6.8,
};

export const CROP_PRESETS_RECOMMENDATIONS: CropRecommendation[] = [
  {
    id: 'CROP-01',
    cropName: 'Paddy (TNAU CO-51 / CR-1009)',
    cropNameTamil: 'நெல் (TNAU CO-51 / பொன்னி)',
    suitabilityScore: 96,
    icon: '🌾',
    expectedYield: '28-32 Quintals / Acre',
    expectedYieldTamil: '28-32 குவிண்டால் / ஏக்கர்',
    investmentPerAcre: '₹ 22,000',
    estimatedProfit: '₹ 48,000 - ₹ 58,000 / Acre',
    waterRequirement: 'High',
    waterRequirementTamil: 'அதிகம்',
    durationDays: '115 - 130 Days',
    marketDemand: 'Very High',
    reasons: [
      'Optimal Nitrogen (140 kg/ha) and balanced alluvial loam soil',
      'High MSP buffer supported by direct procurement centres (DPC)',
      'Subsidized canal water and solar borewell match peak flowering stage'
    ],
    reasonsTamil: [
      'மண்ணில் தழைச்சத்து (140 kg/ha) மற்றும் வண்டல் மண் அமைப்பு சிறப்பானது',
      'நேரடி நெல் கொள்முதல் நிலையங்கள் (DPC) மூலம் நிலையான கொள்முதல் விலை உத்தரவாதம்',
      'கால்வாய் மற்றும் போர்வெல் பாசனத்திற்கு உகந்த குறுகிய கால ரகம்'
    ]
  },
  {
    id: 'CROP-02',
    cropName: 'Turmeric (Erode Local / BSR-2)',
    cropNameTamil: 'மஞ்சள் (ஈரோடு லோக்கல் / BSR-2)',
    suitabilityScore: 91,
    icon: '🟡',
    expectedYield: '25-30 Quintals (Cured) / Acre',
    expectedYieldTamil: '25-30 குவிண்டால் (பதப்படுத்தப்பட்டது) / ஏக்கர்',
    investmentPerAcre: '₹ 38,000',
    estimatedProfit: '₹ 1,10,000 - ₹ 1,45,000 / Acre',
    waterRequirement: 'Medium',
    waterRequirementTamil: 'நடுத்தரம்',
    durationDays: '270 Days',
    marketDemand: 'Very High',
    reasons: [
      'High soil organic carbon and potassium level (165 kg/ha) accelerates rhizome growth',
      'Erode & Salem Mandis offering premium spot rates (>₹14,500/Q)',
      'Low pest susceptibility with neem cake base dressing'
    ],
    reasonsTamil: [
      'மண்ணில் உள்ள சாம்பல் சத்து (165 kg/ha) மஞ்சள் கிழங்கு பெருக்கத்திற்கு மிகச் சிறந்தது',
      'ஈரோடு மற்றும் சேலம் மண்டிகளில் குவிண்டாலுக்கு ₹14,500-க்கு மேல் அதிக லாப விலை நிலவரம்',
      'வேப்பெண்ணெய் கரைசல் மூலம் குறைந்த பூச்சி தாக்குதல் மற்றும் அதிக ஏற்றுமதி தரம்'
    ]
  },
  {
    id: 'CROP-03',
    cropName: 'Groundnut (TMV-14 / VRI-8)',
    cropNameTamil: 'வேர்க்கடலை (மணிலா TMV-14 / VRI-8)',
    suitabilityScore: 88,
    icon: '🥜',
    expectedYield: '18-22 Quintals / Acre',
    expectedYieldTamil: '18-22 குவிண்டால் / ஏக்கர்',
    investmentPerAcre: '₹ 16,500',
    estimatedProfit: '₹ 42,000 - ₹ 52,000 / Acre',
    waterRequirement: 'Low',
    waterRequirementTamil: 'குறைவு',
    durationDays: '105 Days',
    marketDemand: 'High',
    reasons: [
      'Naturally enriches soil Nitrogen via root nodule Rhizobium fixation',
      'Requires 40% less water than wetland paddy crops',
      'High oil-mill wholesale demand across regional markets'
    ],
    reasonsTamil: [
      'வேர் முடிச்சுகள் மூலம் மண்ணில் தழைச்சத்தை இயற்கையாகவே அதிகரிக்கும் பயிர்',
      'நெல்லை விட 40% குறைந்த நீர் தேவையுடன் குறுகிய காலத்தில் நல்ல அறுவடை',
      'எண்ணெய் ஆலைகளின் உடனடி நேரடி கொள்முதல் தேவை'
    ]
  }
];

export const CROP_DISEASE_DATABASE: DiseaseDiagnosis[] = [
  {
    id: 'DIS-01',
    crop: 'Paddy / Rice',
    cropTamil: 'நெல் பயிர்',
    diseaseName: 'Rice Blast (Magnaporthe oryzae)',
    diseaseNameTamil: 'நெல் குலை நோய் (Rice Blast)',
    diseaseType: 'fungal',
    diseaseTypeTamil: 'பூஞ்சான் நோய்',
    pathogenName: 'Magnaporthe oryzae (Fungus)',
    confidence: 94.8,
    severity: 'severe',
    severityTamil: 'தீவிரமானது',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800&auto=format&fit=crop&q=80',
    severityExplanation: 'Spindle-shaped leaf spots and node rot detected. Immediate blast management required.',
    severityExplanationTamil: 'இலைகளில் குலை நோய் புள்ளிகள் மற்றும் கணு அழுகல் தென்படுகிறது. உடனே கட்டுப்படுத்த நடவடிக்கை எடுக்கவும்.',
    causes: [
      'High relative humidity (>90%) and night temperatures between 20-24°C',
      'Excessive nitrogen fertilizer top dressing exceeding recommended dose',
      'High plant density blocking wind flow and sunlight',
      'Leaf wetness persisting for more than 12 consecutive hours',
      'Infected rice stubble or wild grass hosts around paddy bunds'
    ],
    causesTamil: [
      'அதிக காற்றில் ஈரப்பதம் (>90%) மற்றும் இரவு நேரத்தில் 20-24°C வெப்பநிலை',
      'பரிந்துரைக்கப்பட்ட அளவை விட அதிக யூரியா இடுதல்',
      'அடர்ந்த நடவு காரணமாக பயிர்களிடையே காற்றோட்டம் இல்லாமை',
      'இலைகளில் 12 மணி நேரத்திற்கும் மேலாக பனி/தண்ணீர் தேங்கியிருத்தல்',
      'வயல் வரப்புகளில் உள்ள பாதிக்கப்பட்ட பயிர் கழிவுகள்'
    ],
    symptoms: [
      'Spindle-shaped / diamond-like lesions with greyish-white centres and reddish-brown margins',
      'Node rot turning dark brown to black, causing stems to snap easily',
      'Neck blast affecting panicle base resulting in chaffy unfilled grains'
    ],
    symptomsTamil: [
      'இலைகளில் நடுப்பகுதி சாம்பல் நிறமாகவும் ஓரங்கள் பழுப்பு நிறமாகவும் கொண்ட கண் வடிவ புள்ளிகள்',
      'கணுக்கள் கறுத்து எளிதில் முறிந்து விழுதல்',
      'கதிர் கழுத்து பகுதி அழுகி கதிர் முனையில் பால் பிடிக்காமல் பதராக மாறுதல்'
    ],
    immediateActions: [
      'Inspect nearby rice tiller rows for spindle-shaped lesions.',
      'Pause all nitrogen/urea fertilizer applications immediately.',
      'Drain excess standing water from paddy fields for 48 hours to lower humidity.',
      'Avoid evening overhead irrigation.',
      'Apply recommended blast-specific bio-control or approved fungicide.'
    ],
    immediateActionsTamil: [
      'அருகில் உள்ள நெல் பயிர் வரிசைகளில் கண் வடிவ புள்ளிகள் உள்ளதா என பரிசோதிக்கவும்.',
      'யூரியா உரங்கள் இடுவதை உடனடியாக நிறுத்தவும்.',
      'வயலில் தேங்கியுள்ள தண்ணீரை 48 மணி நேரம் வடித்து காற்றில் ஈரப்பதத்தை குறைக்கவும்.',
      'மாலை வேளையில் மேலிருந்து தண்ணீர் தெளிப்பதை தவிர்க்கவும்.',
      'பரிந்துரைக்கப்பட்ட இயற்கை அல்லது இரசாயன பூஞ்சான்கொல்லியை தெளிக்கவும்.'
    ],
    culturalControl: [
      'Maintain 25cm alleyways every 2.5 meters for wind movement',
      'Balanced NPK fertilization based on soil test card'
    ],
    culturalControlTamil: [
      'வயலில் 2.5 மீட்டருக்கு ஒரு 25 செ.மீ பார் இடைவெளி அமைத்தல்',
      'மண் பரிசோதனைப்படி சரியான அளவில் தழைச்சத்து இடுதல்'
    ],
    biologicalControl: [
      'Foliar spray of Pseudomonas fluorescens @ 10g/L in early morning',
      'Apply 3% Panchagavya mixed with sour buttermilk'
    ],
    biologicalControlTamil: [
      'சூடோமோனாஸ் புளோரசன்ஸ் திரவம் லிட்டருக்கு 10 கிராம் தெளிக்கவும்',
      '3% பஞ்சகவ்யா கரைசலுடன் புளித்த மோர் கலந்து தெளிக்கவும்'
    ],
    organicTreatment: [
      'Spray Pseudomonas fluorescens liquid bio-agent @ 10ml / litre of water in early morning',
      'Apply Panchagavya 3% (300ml in 10L water) mixed with sour buttermilk spray to inhibit fungal mycelium'
    ],
    organicTreatmentTamil: [
      'சூடோமோனாஸ் புளோரசன்ஸ் திரவ நுண்ணுயிர் ஒரு லிட்டர் தண்ணீருக்கு 10 மிலி கலந்து காலை வேளையில் தெளிக்கவும்',
      '3% பஞ்சகவ்யா கரைசலுடன் புளித்த மோர் கலந்து தெளித்து பூஞ்சான் வளர்ச்சியை கட்டுப்படுத்தவும்'
    ],
    chemicalTreatment: [
      'Recommended active ingredient: Tricyclazole 75% WP @ 0.6g / litre of water.',
      'Alternative approved active ingredient: Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml / litre.',
      'Safety Disclaimer: Follow product label directions and consult local agricultural department officers before spraying.'
    ],
    chemicalTreatmentTamil: [
      'பரிந்துரைக்கப்பட்ட மருந்து: டிரைசைக்ளசோல் 75% WP லிட்டருக்கு 0.6 கிராம் வீதம் தெளிக்கவும்.',
      'மாற்று மருந்து: அஸோக்ஸிஸ்ட்ரோபின் + டைபனோகோனசோல் 1 மிலி லிட்டருக்கு கலந்து தெளிக்கவும்.',
      'பாதுகாப்பு குறிப்பு: மருந்து பாட்டில் விபரங்களை படித்து, உள்ளூர் வேளாண்மை அலுவலரின் ஆலோசனையைப் பெறவும்.'
    ],
    prevention: [
      'Perform seed treatment with Trichoderma viride @ 4g/kg seed prior to nursery sowing',
      'Use resistant varieties such as CO-51, ADT-45, or TPS-5',
      'Destroy previous crop stubble to eliminate overwintering spores'
    ],
    preventionTamil: [
      'விதைப்பதற்கு முன் டிரைக்கோடெர்மா விரிடி 4 கிராம் / கிலோ விதை நேர்த்தி செய்யவும்',
      'குலை நோயை எதிர்க்கும் CO-51, ADT-45 ரகங்களை சாகுபடி செய்யவும்',
      'கடந்த பருவத்தின் பயிர் கழிவுகளை எரத்து பூஞ்சான் வித்துக்களை அழிக்கவும்'
    ],
    isVerifiedData: true,
    audioSpeechEn: 'Warning: Rice blast fungal infection detected with 94.8% confidence. Please spray Tricyclazole at 0.6g per litre or Pseudomonas bio-formulation. Pause urea application.',
    audioSpeechTa: 'எச்சரிக்கை: நெல் பயிரில் குலை நோய் 94.8 சதவீதம் துல்லியமாக கண்டறியப்பட்டுள்ளது. உடனடியாக டிரைசைக்ளசோல் அல்லது சூடோமோனாஸ் தெளிக்கவும். யூரியா இடுவதை நிறுத்தவும்.'
  },
  {
    id: 'DIS-01B',
    crop: 'Paddy / Rice',
    cropTamil: 'நெல் பயிர்',
    diseaseName: 'Rice Brown Spot (Bipolaris oryzae)',
    diseaseNameTamil: 'நெல் பழுப்பு இலைப்புள்ளி நோய் (Brown Spot)',
    diseaseType: 'fungal',
    diseaseTypeTamil: 'பூஞ்சான் நோய்',
    pathogenName: 'Helminthosporium oryzae (Fungus)',
    confidence: 92.4,
    severity: 'moderate',
    severityTamil: 'மிதமானது',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    severityExplanation: 'Oval sesame-like brown spots detected. Indicates soil nutrient starvation (Potassium/Zinc deficiency).',
    severityExplanationTamil: 'எள் அளவு பழுப்பு நிற புள்ளிகள் தென்படுகிறது. மண்ணில் பொட்டாஷ் மற்றும் துத்தநாக ஊட்டச்சத்து குறைபாட்டை உணர்த்துகிறது.',
    causes: [
      'Nutrient starvation, particularly Potassium (K), Manganese, and Zinc deficiency',
      'Un-irrigated dry moisture stress followed by sudden flooding',
      'Poor, alkaline or acid-sulfate soil with low organic carbon',
      'Use of un-treated infected seed lots from poor harvest seasons'
    ],
    causesTamil: [
      'மண்ணில் பொட்டாசியம் (K) மற்றும் துத்தநாக ஊட்டச்சத்து குறைபாடு',
      'வறட்சிக்கு பின் திடீரென அதிக தண்ணீர் பாய்ச்சுதல்',
      'களிமண் அல்லது குறைந்த கரிம சத்துள்ள மண் வளம்',
      'விதை நேர்த்தி செய்யப்படாத விதைகளைப் பயன்படுத்துதல்'
    ],
    symptoms: [
      'Small circular to oval sesame-seed shaped brown spots with yellow halos',
      'Lesions coalescence causing leaf tip blight and premature foliage drying',
      'Dark brown discoloration on grain husk reducing seed germination quality'
    ],
    symptomsTamil: [
      'இலைகளில் எள் விதை போன்ற வட்ட வடிவ பழுப்பு நிற புள்ளிகள் சுற்றிலும் மஞ்சள் நிற வளையத்துடன் தோன்றுதல்',
      'புள்ளிகள் ஒன்றுசேர்ந்து இலை நுனிகள் காய்ந்து கருகிப்போதல்',
      'நெல் மணிகளின் உமியில் பழுப்பு நிற புள்ளிகள் தோன்றி விதையின் தரம் குறைதல்'
    ],
    immediateActions: [
      'Apply Muriate of Potash (MOP) @ 25 kg/acre as top dressing to correct potassium deficit.',
      'Foliar spray of 0.5% Zinc Sulphate + 1% Urea solution.',
      'Maintain continuous thin water layer (2-3 cm) in paddy fields.',
      'Avoid completely drying out sandy loam fields.'
    ],
    immediateActionsTamil: [
      'பொட்டாஷ் உரத்தை ஏக்கருக்கு 25 கிலோ மேலுரமாக இடவும்.',
      '0.5% துத்தநாக சல்பேட் + 1% யூரியா கரைசலை இலைகளில் தெளிக்கவும்.',
      'வயலில் 2-3 செ.மீ நீர்மட்டம் எப்போதும் இருக்குமாறு பாசனம் செய்யவும்.',
      'மண் முற்றிலும் காய்ந்து போவதை தவிர்க்கவும்.'
    ],
    culturalControl: [
      'Apply farmyard manure (FYM) @ 5 tonnes/acre to replenish soil micronutrients',
      'Correct soil pH using lime amendment in acidic soils'
    ],
    culturalControlTamil: [
      'ஏக்கருக்கு 5 டன் தொழு உரம் இட்டு மண்ணின் நுண்ணூட்டத்தை உயர்த்தவும்',
      'அமில மண்ணில் சுண்ணாம்பு இட்டு மண் வளத்தை சீரமைக்கவும்'
    ],
    biologicalControl: [
      'Seed treatment with Pseudomonas fluorescens @ 10g/kg seed',
      'Foliar spray of neem cake extract 5%'
    ],
    biologicalControlTamil: [
      'சூடோமோனாஸ் நுண்ணுயிரி மூலம் கிலோ விதைக்கு 10 கிராம் விதை நேர்த்தி செய்யவும்',
      '5% வேப்பங்கொட்டை கரைசல் தெளிக்கவும்'
    ],
    organicTreatment: [
      'Foliar spray of 0.5% Zinc Sulphate + 1% Sour Buttermilk slurry',
      'Apply neem cake @ 100 kg/acre into standing soil base'
    ],
    organicTreatmentTamil: [
      '0.5% துத்தநாக சல்பேட் மற்றும் புளித்த மோர் கரைசல் தெளிக்கவும்',
      'ஏக்கருக்கு 100 கிலோ வேப்பம் பிண்ணாக்கு அடிஉரமாக இடவும்'
    ],
    chemicalTreatment: [
      'Recommended active ingredient: Mancozeb 75% WP @ 2g / litre OR Edifenphos 50% EC @ 1ml / litre.',
      'Alternative approved option: Carbendazim 12% + Mancozeb 63% WP @ 2g / litre.',
      'Safety Disclaimer: Follow product label directions and consult local agricultural department officers before spraying.'
    ],
    chemicalTreatmentTamil: [
      'பரிந்துரைக்கப்பட்ட மருந்து: மேன்கோசெப் 75% WP லிட்டருக்கு 2 கிராம் வீதம் தெளிக்கவும்.',
      'மாற்று மருந்து: கார்பென்டசிம் + மேன்கோசெப் கூட்டு மருந்து லிட்டருக்கு 2 கிராம் தெளிக்கவும்.',
      'பாதுகாப்பு குறிப்பு: மருந்து பாட்டில் விபரங்களை படித்து, உள்ளூர் வேளாண்மை அலுவலரின் ஆலோசனையைப் பெறவும்.'
    ],
    prevention: [
      'Hot water seed soak treatment at 52°C for 10 minutes prior to germination',
      'Balanced fertilization ensuring adequate Potassium and micronutrient application',
      'Avoid seed collection from infected crop fields'
    ],
    preventionTamil: [
      'விதைப்பதற்கு முன் விதைகளை 52°C வெந்நீரில் 10 நிமிடம் ஊறவைத்து விதை நேர்த்தி செய்யவும்',
      'சீரான முறையில் பொட்டாஷ் மற்றும் நுண்ணூட்ட உரங்களை இடவும்',
      'பாதிக்கப்பட்ட வயலில் இருந்து விதைகளை சேகரிப்பதை தவிர்க்கவும்'
    ],
    isVerifiedData: true,
    audioSpeechEn: 'Paddy Brown Spot identified. Apply Muriate of Potash and foliar Zinc Sulphate spray to correct soil nutrient deficiency.',
    audioSpeechTa: 'நெல் பயிரில் பழுப்பு இலைப்புள்ளி நோய் உள்ளது. பொட்டாஷ் மற்றும் துத்தநாக சல்பேட் தெளித்து ஊட்டச்சத்து குறைபாட்டை சரிசெய்யவும்.'
  },
  {
    id: 'DIS-02',
    crop: 'Tomato',
    cropTamil: 'தக்காளி பயிர்',
    diseaseName: 'Tomato Early Blight (Alternaria solani)',
    diseaseNameTamil: 'தக்காளி இலை கருகல் நோய் (Early Blight)',
    diseaseType: 'fungal',
    diseaseTypeTamil: 'பூஞ்சான் நோய்',
    pathogenName: 'Alternaria solani (Fungus)',
    confidence: 96.2,
    severity: 'moderate',
    severityTamil: 'மிதமானது',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=800&auto=format&fit=crop&q=80',
    severityExplanation: 'Fungal concentric target rings on lower foliage. Action required to prevent fruit sunscald.',
    severityExplanationTamil: 'அடிப்பகுதி இலைகளில் வட்ட வளைய புள்ளிகள் உள்ளது. காய்கள் பாதிப்படைவதை தடுக்க உடனே நடவடிக்கை எடுக்கவும்.',
    causes: [
      'Warm ambient temperatures (24-29°C) accompanied by heavy dew or rainfall',
      'Raindrop splash transferring soil-borne fungal spores onto lower mature leaves',
      'Continuous cultivation of solanaceous crops (tomato, chilli, brinjal) without rotation',
      'Potassium deficiency weakening cell wall defense against Alternaria fungus'
    ],
    causesTamil: [
      'வெப்பமான வானிலை (24-29°C) மற்றும் அதிக பனி/மழை சேருதல்',
      'மழைத்துளி தெறிப்பதன் மூலம் மண்ணில் உள்ள பூஞ்சான் விதைகள் கீழ் இலைகளில் பரவுதல்',
      'தக்காளி, மிளகாய், கத்தரி பயிர்களை பயிர் சுழற்சி இன்றி தொடர்ந்து சாகுபடி செய்தல்',
      'மண்ணில் சாம்பல் சத்து (பொட்டாஷ்) குறைபாடு'
    ],
    symptoms: [
      'Concentric target-board rings on lower mature leaves surrounding dark brown spots',
      'Yellow chlorotic halos around necrotic spots causing leaf yellowing and premature leaf drop',
      'Sunken dark leathery lesions at stem end of tomato fruits'
    ],
    symptomsTamil: [
      'அடிப்பகுதி இலைகளில் வட்ட வளையங்களுடன் கூடிய பழுப்பு நிற புள்ளிகள் தோன்றுதல்',
      'புள்ளிகளை சுற்றி இலை மஞ்சள் நிறமாக மாறி இலைகள் உதிர்ந்துபோதல்',
      'தக்காளி காய்களின் காம்பு பகுதியில் கருமையான பள்ளமான புள்ளிகள் தோன்றுதல்'
    ],
    immediateActions: [
      'Prune lower affected leaves up to 15 cm from ground level.',
      'Apply clean straw mulch on soil to stop splash dispersal of spores.',
      'Switch to drip irrigation to keep tomato foliage dry.',
      'Remove and destroy pruned infected leaves away from field.',
      'Inspect developing tomato fruit clusters daily.'
    ],
    immediateActionsTamil: [
      'தரைமட்டத்திலிருந்து 15 செ.மீ உயரம் வரையிலான பாதிக்கப்பட்ட கீழ் இலைகளை வெட்டி எறியவும்.',
      'மண்ணிலிருந்து பூஞ்சான் தெறிக்காமல் இருக்க வைக்கோல் மூடாக்கு இடவும்.',
      'சொட்டு நீர் பாசனம் மூலம் இலைகளில் தண்ணீர் படாமல் பார்த்துக்கொள்ளவும்.',
      'வெட்டிய இலைகளை வயலுக்கு வெளியே தூர எரிக்கவும்.',
      'காய்களில் புள்ளிகள் வருகிறதா என தினமும் பரிசோதிக்கவும்.'
    ],
    culturalControl: [
      'Staking tomato plants using bamboo poles to lift vines off moist soil',
      'Maintain 60cm x 45cm wider planting spacing'
    ],
    culturalControlTamil: [
      'மூங்கில் குச்சிகள் மூலம் தக்காளி செடிகளை தரையில் படாதவாறு கட்டி வளர்த்தல்',
      '60 செ.மீ x 45 செ.மீ இடைவெளியில் செடிகளை நடவு செய்தல்'
    ],
    biologicalControl: [
      'Foliar spray of Trichoderma harzianum @ 5g/litre',
      'Spray 10% ginger-garlic extract mixed with wood ash slurry'
    ],
    biologicalControlTamil: [
      'டிரைக்கோடெர்மா ஹார்சியானம் லிட்டருக்கு 5 கிராம் தெளிக்கவும்',
      'இஞ்சி பூண்டு பச்சை மிளகாய் கரைசல் மற்றும் சாம்பல் தெளிப்பு'
    ],
    organicTreatment: [
      'Spray ginger-garlic-chilli 10% extract mixed with wood ash slurry',
      'Foliar spray of Trichoderma harzianum @ 5g/litre of water'
    ],
    organicTreatmentTamil: [
      'இஞ்சி பூண்டு பச்சை மிளகாய் கரைசல் மற்றும் சாம்பல் தெளிப்பு',
      'டிரைக்கோடெர்மா ஹார்சியானம் லிட்டருக்கு 5 கிராம் தெளிக்கவும்'
    ],
    chemicalTreatment: [
      'Recommended active ingredient: Mancozeb 75% WP @ 2.5g / litre OR Chlorothalonil 75% WP @ 2g / litre.',
      'Alternative approved active ingredient: Copper Oxychloride (COC 50% WP) @ 3g / litre.',
      'Safety Disclaimer: Follow product label directions and consult local agricultural department officers before spraying.'
    ],
    chemicalTreatmentTamil: [
      'பரிந்துரைக்கப்பட்ட மருந்து: மேன்கோசெப் 75% WP லிட்டருக்கு 2.5 கிராம் அல்லது குளோரோதலோனில் 2 கிராம் தெளிக்கவும்.',
      'மாற்று மருந்து: காப்பர் ஆக்ஸிகுளோரைடு (COC) 3 கிராம் லிட்டருக்கு கலந்து தெளிக்கவும்.',
      'பாதுகாப்பு குறிப்பு: மருந்து பாட்டில் விபரங்களை படித்து, உள்ளூர் வேளாண்மை அலுவலரின் ஆலோசனையைப் பெறவும்.'
    ],
    prevention: [
      'Rotate tomato with non-solanaceous crops such as maize, legumes, or paddy',
      'Use drip irrigation instead of overhead sprinklers to keep foliage dry',
      'Soil solarization during hot summer months before transplanting'
    ],
    preventionTamil: [
      'தக்காளிக்கு பின் சோளம், பருப்பு வகைகளை சுழற்சி முறையில் சாகுபடி செய்யவும்',
      'இலைகளில் தண்ணீர் படாதவாறு சொட்டு நீர் பாசன முறையை பயன்படுத்தவும்',
      'கோடை காலத்தில் கோடை உழவு செய்து மண்ணை சூரிய வெப்பத்தில் ஆறப்போடவும்'
    ],
    isVerifiedData: true,
    audioSpeechEn: 'Tomato Early Blight detected with 96% confidence. Apply Mancozeb spray and ensure drip irrigation does not wet leaves.',
    audioSpeechTa: 'தக்காளி பயிரில் இலை கருகல் நோய் கண்டறியப்பட்டுள்ளது. மேன்கோசெப் அல்லது காப்பர் மருந்து தெளித்து இலைகளை உலர வைக்கவும்.'
  },
  {
    id: 'DIS-02B',
    crop: 'Tomato',
    cropTamil: 'தக்காளி பயிர்',
    diseaseName: 'Tomato Late Blight (Phytophthora infestans)',
    diseaseNameTamil: 'தக்காளி பிந்திய கருகல் நோய் (Late Blight)',
    diseaseType: 'fungal',
    diseaseTypeTamil: 'பூஞ்சான் நோய் (Water Mold)',
    pathogenName: 'Phytophthora infestans (Oomycete)',
    confidence: 95.1,
    severity: 'severe',
    severityTamil: 'தீவிரமானது',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=800&auto=format&fit=crop&q=80',
    severityExplanation: 'Rapid destructive water-soaked lesions detected. High risk of complete field destruction within 4 font days.',
    severityExplanationTamil: 'வேகமாக பரவும் நீர் ஊறிய கருகல் புள்ளிகள் உள்ளது. 4 நாட்களில் வயல் முற்றிலும் கருகும் அபாயம்.',
    causes: [
      'Cool temperatures (15-21°C) combined with extended relative humidity > 90%',
      'Persistent fog, cloud cover, and prolonged leaf wetness',
      'Airborne sporangia travelling long distances across tomato and potato fields',
      'Over-saturated soil moisture from heavy monsoon spells'
    ],
    causesTamil: [
      'குளிர்ந்த வானிலை (15-21°C) மற்றும் தொடர் மேகமூட்டம்/ஈரப்பதம் (> 90%)',
      'அடர்ந்த பனி மற்றும் இலைகளில் தொடர்ந்து தண்ணீர் தேங்குதல்',
      'காற்றின் மூலம் வேகமாக பரவும் பூஞ்சான் வித்துக்கள்',
      'மழைக்காலத்தில் வயலில் நீர் தேங்குதல்'
    ],
    symptoms: [
      'Large irregular water-soaked dark green to black lesions on leaf margins and tips',
      'White cottony fungal growth visible on undersides of affected leaves during humid mornings',
      'Firm brown greasy rot spreading rapidly over developing green and red tomato fruits'
    ],
    symptomsTamil: [
      'இலை ஓரங்களில் நீர் ஊறிய பெரிய கரும்பச்சை மற்றும் பழுப்பு நிற கருகல் புள்ளிகள்',
      'அதிகாலையில் இலைகளின் அடிப்பகுதியில் வெள்ளை நிற பஞ்சு போன்ற பூஞ்சான் வளர்ச்சி தோன்றுதல்',
      'தக்காளி காய்களில் வேகமாக பரவும் பழுப்பு நிற அழுகல் புள்ளிகள்'
    ],
    immediateActions: [
      'Immediately spray systemic oomycete-specific fungicide upon first symptom onset.',
      'Remove and destroy infected vines and rotted fruits immediately by deep burial.',
      'Stop all overhead sprinkler irrigation.',
      'Warn neighboring tomato/potato farmers as spores travel rapidly in wind currents.'
    ],
    immediateActionsTamil: [
      'நோய் கண்டவுடனே வீரியமிக்க பூஞ்சான்கொல்லியை உடனடியாக தெளிக்கவும்.',
      'பாதிக்கப்பட்ட செடிகள் மற்றும் அழுகிய காய்களை வெட்டி குழியில் புதைத்து அழிக்கவும்.',
      'தெளிப்பு நீர் பாசனத்தை முற்றிலும் நிறுத்தவும்.',
      'அருகில் உள்ள விவசாயிகளுக்கு எச்சரிக்கை செய்யவும்.'
    ],
    culturalControl: [
      'Destroy self-sown volunteer tomato and potato plants around bunds',
      'Improve field drainage to ensure zero water stagnation'
    ],
    culturalControlTamil: [
      'வரப்புகளில் தானாக முளைக்கும் தக்காளி, உருளைச் செடிகளை அழித்துவிடவும்',
      'வயலில் நீர் தேங்காதவாறு வடிகால் வசதியை மேம்படுத்தவும்'
    ],
    biologicalControl: [
      'Foliar spray of Pseudomonas fluorescens @ 10g/L + Copper Hydroxide',
      'Foliar application of fermented cow milk filtrate'
    ],
    biologicalControlTamil: [
      'சூடோமோனாஸ் திரவம் லிட்டருக்கு 10 கிராம் தெளிக்கவும்',
      'புளித்த பால் தெளிப்பு கரைசல் பயன்படுத்துதல்'
    ],
    organicTreatment: [
      'Spray Copper Hydroxide @ 2g/litre mixed with sour buttermilk',
      'Apply Trichoderma viride enriched bio-compost to root zone'
    ],
    organicTreatmentTamil: [
      'காப்பர் ஹைட்ராக்சைடு 2 கிராம் லிட்டருக்கு புளித்த மோருடன் கலந்து தெளிக்கவும்',
      'டிரைக்கோடெர்மா விரிடி கலந்த மண்புழு உரம் இடுதல்'
    ],
    chemicalTreatment: [
      'Recommended systemic active ingredient: Cymoxanil 8% + Mancozeb 64% WP @ 2g / litre OR Metalaxyl 8% + Mancozeb 64% WP @ 2g / litre.',
      'Alternative curative active ingredient: Dimethomorph 50% WP @ 1g / litre.',
      'Safety Disclaimer: Follow product label directions and consult local agricultural department officers before spraying.'
    ],
    chemicalTreatmentTamil: [
      'பரிந்துரைக்கப்பட்ட கூட்டு மருந்து: மெட்டாலாக்ஸில் + மேன்கோசெப் லிட்டருக்கு 2 கிராம் வீதம் தெளிக்கவும்.',
      'மாற்று மருந்து: டைமித்தோமார்ப் 50% WP லிட்டருக்கு 1 கிராம் கலந்து தெளிக்கவும்.',
      'பாதுகாப்பு குறிப்பு: மருந்து பாட்டில் விபரங்களை படித்து, உள்ளூர் வேளாண்மை அலுவலரின் ஆலோசனையைப் பெறவும்.'
    ],
    prevention: [
      'Plant certified blight-resistant tomato hybrids during rainy seasons',
      'Avoid growing tomato adjacent to potato crops',
      'Prophylactic protective spray of Mancozeb @ 2.5g/L before cold rainy weather sets in'
    ],
    preventionTamil: [
      'மழைக்காலத்தில் நோய் எதிர்ப்புத் திறன் கொண்ட ஹைபிரிட் தக்காளிகளை நடவு செய்யவும்',
      'உருளைக்கிழங்கு வயலுக்கு அருகில் தக்காளி சாகுபடி செய்வதை தவிர்க்கவும்',
      'மழைக்காலத்திற்கு முன் முன்னெச்சரிக்கையாக மேன்கோசெப் மருந்தை தெளிக்கவும்'
    ],
    isVerifiedData: true,
    audioSpeechEn: 'Warning: Tomato Late Blight detected. Spray Metalaxyl plus Mancozeb immediately and remove infected plant debris.',
    audioSpeechTa: 'எச்சரிக்கை: தக்காளியில் பிந்திய கருகல் நோய் உள்ளது. உடனடியாக மெட்டாலாக்ஸில் + மேன்கோசெப் மருந்து தெளித்து அழுகிய செடிகளை அழிக்கவும்.'
  },
  {
    id: 'DIS-02C',
    crop: 'Potato',
    cropTamil: 'உருளைக்கிழங்கு பயிர்',
    diseaseName: 'Potato Late Blight (Phytophthora infestans)',
    diseaseNameTamil: 'உருளைக்கிழங்கு பிந்திய கருகல் நோய் (Late Blight)',
    diseaseType: 'fungal',
    diseaseTypeTamil: 'பூஞ்சான் நோய் (Water Mold)',
    pathogenName: 'Phytophthora infestans (Oomycete)',
    confidence: 94.5,
    severity: 'severe',
    severityTamil: 'தீவிரமானது',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
    severityExplanation: 'Tuber rot threat detected. Immediate systemic spray needed to protect underground potato yield.',
    severityExplanationTamil: 'கிழங்கு அழுகும் அபாயம் உள்ளது. உருளைக்கிழங்கு மகசூலை பாதுகாக்க உடனடியாக மருந்து தெளிக்கவும்.',
    causes: [
      'Cool temperatures (12-18°C) with persistent night dew and fog',
      'Infected seed tubers planted during early season',
      'High soil wetness allowing zoospores to swim into tuber eyes',
      'Dense foliage canopy holding humidity'
    ],
    causesTamil: [
      'குளிர்ந்த வானிலை (12-18°C) மற்றும் தொடர் இரவு பனிமூட்டம்',
      'பாதிக்கப்பட்ட விதை உருளைக்கிழங்கை நடுதல்',
      'மண்ணில் அதிக தண்ணீர் தேங்கி பூஞ்சான் வித்துக்கள் கிழங்கிற்கு பரவுதல்',
      'செடிகள் அடர்த்தியாக வளர்ந்து காற்றில் ஈரப்பதம் தங்குதல்'
    ],
    symptoms: [
      'Water-soaked dark brown flecks on leaf tips rapidly expanding into dead brown blotches',
      'White mildew growth on lower leaf surfaces during early morning dampness',
      'Reddish-brown dry firm rot extending into potato tuber flesh below ground'
    ],
    symptomsTamil: [
      'இலை நுனிகளில் பழுப்பு நிற கருகல் புள்ளிகள் வேகமாக பரவுதல்',
      'அதிகாலை வேளையில் இலையின் அடியில் வெள்ளை பூஞ்சான் படலம் தோன்றுதல்',
      'உருளைக்கிழங்கின் உட்பகுதியில் சிகப்பு-பழுப்பு நிற அழுகல் ஏற்படுதல்'
    ],
    immediateActions: [
      'Spray systemic Metalaxyl + Mancozeb combination immediately.',
      'Earthing up soil around potato ridges to prevent spores reaching tubers.',
      'Cut foliage (haulm destruction) 10 days before harvest if late blight is active.',
      'Do not harvest tubers in wet muddy soil conditions.'
    ],
    immediateActionsTamil: [
      'மெட்டாலாக்ஸில் + மேன்கோசெப் கூட்டு மருந்தை உடனடியாக தெளிக்கவும்.',
      'கிழங்குகளுக்கு பூஞ்சான் பரவாமல் இருக்க உருளைப் பார்களில் மண் அணைக்கவும்.',
      'அறுவடைக்கு 10 நாட்களுக்கு முன் பாதிக்கப்பட்ட மேல் செடிகளை வெட்டி அப்புறப்படுத்தவும்.',
      'ஈரமான சேற்று மண்ணில் அறுவடை செய்வதை தவிர்க்கவும்.'
    ],
    culturalControl: [
      'Dehaulming (cutting green tops) when disease strikes near harvest',
      'Planting certified disease-free seed tubers'
    ],
    culturalControlTamil: [
      'அறுவடை நேரத்தில் செடியின் மேல் பகுதியை வெட்டி அப்புறப்படுத்துதல்',
      'சான்றளிக்கப்பட்ட நோய் இல்லாத விதை கிழங்குகளை பயன்படுத்துதல்'
    ],
    biologicalControl: [
      'Trichoderma viride soil application @ 2.5 kg/acre',
      'Pseudomonas fluorescens tuber dip before planting'
    ],
    biologicalControlTamil: [
      'டிரைக்கோடெர்மா விரிடி உயிர் பூஞ்சானை ஏக்கருக்கு 2.5 கிலோ மண்ணில் இடுதல்',
      'நடுவதற்கு முன் சூடோமோனாஸ் கரைசலில் கிழங்கை ஊறவைத்தல்'
    ],
    organicTreatment: [
      'Tuber dip treatment with Pseudomonas fluorescens @ 10g/L',
      'Foliar spray of Copper Oxychloride @ 3g/L'
    ],
    organicTreatmentTamil: [
      'சூடோமோனாஸ் கரைசலில் கிழங்கை ஊறவைத்து நடுதல்',
      'காப்பர் ஆக்ஸிகுளோரைடு 3 கிராம் லிட்டருக்கு கலந்து தெளிக்கவும்'
    ],
    chemicalTreatment: [
      'Recommended active ingredient: Metalaxyl 8% + Mancozeb 64% WP @ 2g / litre OR Cymoxanil 8% + Mancozeb 64% WP @ 2g / litre.',
      'Alternative approved active ingredient: Phenamidone 10% + Mancozeb 50% WDG @ 2g / litre.',
      'Safety Disclaimer: Follow product label directions and consult local agricultural department officers before spraying.'
    ],
    chemicalTreatmentTamil: [
      'பரிந்துரைக்கப்பட்ட மருந்து: மெட்டாலாக்ஸில் + மேன்கோசெப் 2 கிராம் லிட்டருக்கு கலந்து தெளிக்கவும்.',
      'மாற்று மருந்து: பெனாமிடோன் + மேன்கோசெப் 2 கிராம் லிட்டருக்கு தெளிக்கவும்.',
      'பாதுகாப்பு குறிப்பு: மருந்து பாட்டில் விபரங்களை படித்து, உள்ளூர் வேளாண்மை அலுவலரின் ஆலோசனையைப் பெறவும்.'
    ],
    prevention: [
      'Plant late blight resistant cultivars like Kufri Girdhari or Kufri Jyoti',
      'Store seed tubers in cold storage with proper air ventilation',
      'Avoid furrow irrigation overtopping potato ridges'
    ],
    preventionTamil: [
      'குஃப்ரி ஜோதி போன்ற நோய் எதிர்ப்பு உருளை ரகங்களை சாகுபடி செய்யவும்',
      'விதை கிழங்குகளை நல்ல காற்றோட்டமுள்ள குளிர்பதன கிடங்கில் சேமிக்கவும்',
      'பார்களின் மேல் தண்ணீர் வழியாதவாறு பார்த்து பாசனம் செய்யவும்'
    ],
    isVerifiedData: true,
    audioSpeechEn: 'Potato Late Blight detected. Execute haulm cutting if near harvest and apply Metalaxyl plus Mancozeb spray.',
    audioSpeechTa: 'உருளைக்கிழங்கில் பிந்திய கருகல் நோய் உள்ளது. மெட்டாலாக்ஸில் + மேன்கோசெப் தெளித்து கிழங்கிற்கு மண் அணைக்கவும்.'
  },
  {
    id: 'DIS-03',
    crop: 'Cotton',
    cropTamil: 'பருத்தி பயிர்',
    diseaseName: 'Cotton Bacterial Blight / Black Arm (Xanthomonas malvacearum)',
    diseaseNameTamil: 'பருத்தி கோண இலைப்புள்ளி & கருந்தண்டு நோய்',
    diseaseType: 'bacterial',
    diseaseTypeTamil: 'பாக்டீரியா நோய்',
    pathogenName: 'Xanthomonas citri pv. malvacearum (Bacteria)',
    confidence: 91.5,
    severity: 'moderate',
    severityTamil: 'மிதமானது',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=80',
    severityExplanation: 'Angular vein-bound spots and stem blackening detected. Treat now to prevent boll drop.',
    severityExplanationTamil: 'இலைகளில் கோண புள்ளிகள் மற்றும் தண்டு கறுப்பது தென்படுகிறது. காய் உதிர்வதை தடுக்க உடனே மருந்து தெளிக்கவும்.',
    causes: [
      'Seed-borne bacterial infection surviving inside fuzzy un-delinted seeds',
      'Splashing monsoon rain driven by high wind currents spreading bacteria',
      'High relative humidity (> 85%) and temperature between 28-35°C',
      'Crop injuries caused by sucking pests allowing bacterial entry'
    ],
    causesTamil: [
      'பஞ்சு நீக்கம் செய்யப்படாத விதைகளின் மூலம் பாக்டீரியா பரவுதல்',
      'காற்றோடு கூடிய மழைத்துளிகள் மூலம் பக்கத்து செடிகளுக்கு பரவுதல்',
      'காற்றில் அதிக ஈரப்பதம் (> 85%) மற்றும் 28-35°C வெப்பநிலை',
      'சாறு உறிஞ்சும் பூச்சிகளால் ஏற்படும் காயங்கள் வழியாக பாக்டீரியா புகுதல்'
    ],
    symptoms: [
      'Angular translucent water-soaked spots bounded by leaf veinlets turning dark brown',
      'Black elongated girdling lesions on stem branches causing "black arm" dieback',
      'Sunken water-soaked circular spots on cotton bolls resulting in stained lint'
    ],
    symptomsTamil: [
      'இலை நரம்புகளுக்கு இடையே கோண வடிவத்தில் நீர் ஊறிய பழுப்பு புள்ளிகள் தோன்றுதல்',
      'தண்டுகளில் கறுப்பு நிறமாக காய்ந்து கருந்தண்டு உருவாகி செடி முறிதல்',
      'பருத்தி காய்களில் நீர் ஊறிய புள்ளிகள் தோன்றி பஞ்சு தரம் கெடுதல்'
    ],
    immediateActions: [
      'Remove severely blackened branches and infected leaves from field.',
      'Do not conduct inter-cultivation weeding when crop canopy is wet with morning dew.',
      'Control sucking pests (thrips/aphids) to prevent bacterial entry wounds.',
      'Spray recommended bactericide mixed with copper formulation.',
      'Ensure field drainage after heavy rainfall.'
    ],
    immediateActionsTamil: [
      'பாதிக்கப்பட்ட இலைகள் மற்றும் கருத்த கிளைகளை வெட்டி எரிக்கவும்.',
      'காலை பனி ஈரப்பதம் இருக்கும்போது வயலில் வேலை செய்வதை தவிர்க்கவும்.',
      'சாறு உறிஞ்சும் பூச்சிகளை கட்டுப்படுத்தி செடிகளில் காயம் ஏற்படுவதை தவிர்க்கவும்.',
      'பரிந்துரைக்கப்பட்ட பாக்டீரியா எதிர்ப்பு மருந்தை தெளிக்கவும்.',
      'மழைநீரை வயலில் தேங்காமல் வடித்துவிடவும்.'
    ],
    culturalControl: [
      'Acid delinting of cotton seeds using commercial Sulphuric Acid (100ml/kg seed)',
      'Clean field cultivation removing infected cotton crop stubble'
    ],
    culturalControlTamil: [
      'விதைப்பதற்கு முன் சல்பூரிக் அமிலம் கொண்டு விதை நேர்த்தி செய்தல்',
      'கடந்த பருவத்தின் பாதிக்கப்பட்ட பருத்தி குச்சிகளை அகற்றி வயலை சுத்தமாக வைத்தல்'
    ],
    biologicalControl: [
      'Pseudomonas fluorescens seed treatment @ 10g/kg seed',
      'Foliar spray of 10% cow dung urine filtrate + turmeric'
    ],
    biologicalControlTamil: [
      'சூடோமோனாஸ் மூலம் கிலோ விதைக்கு 10 கிராம் விதை நேர்த்தி செய்யவும்',
      '10% மாட்டு கோமியம் மற்றும் மஞ்சள் தூள் கரைசல் தெளித்தல்'
    ],
    organicTreatment: [
      'Spray 10% cow dung urine filtrate mixed with turmeric powder @ 5g/L',
      'Foliar spray of Bacillus subtilis bio-fungicide @ 10g/L'
    ],
    organicTreatmentTamil: [
      '10% மாட்டு கோமியம் மற்றும் மஞ்சள் தூள் கலந்த கரைசல் தெளிக்கவும்',
      'பேசில்லஸ் சப்டிலிஸ் பாக்டீரியா கரைசல் லிட்டருக்கு 10 கிராம் தெளிக்கவும்'
    ],
    chemicalTreatment: [
      'Recommended active ingredient combination: Streptocycline 100mg (0.1g) + Copper Oxychloride 50% WP @ 2.5g in 1 litre of water.',
      'Alternative approved active ingredient: Copper Hydroxide 77% WP @ 2g / litre.',
      'Safety Disclaimer: Follow product label directions and consult local agricultural department officers before spraying.'
    ],
    chemicalTreatmentTamil: [
      'பரிந்துரைக்கப்பட்ட பாக்டீரியா கூட்டு மருந்து: ஸ்ட்ரெப்டோசைக்ளின் 100 மில்லிகிராம் + காப்பர் ஆக்ஸிகுளோரைடு 2.5 கிராம் ஒரு லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்.',
      'மாற்று மருந்து: காப்பர் ஹைட்ராக்சைடு 2 கிராம் லிட்டருக்கு தெளிக்கவும்.',
      'பாதுகாப்பு குறிப்பு: மருந்து பாட்டில் விபரங்களை படித்து, உள்ளூர் வேளாண்மை அலுவலரின் ஆலோசனையைப் பெறவும்.'
    ],
    prevention: [
      'Always sow acid-delinted certified cotton seeds',
      'Avoid growing susceptible cotton varieties in endemic wet zones',
      'Follow 2-year crop rotation with sorghum, maize, or finger millet'
    ],
    preventionTamil: [
      'எப்போதும் அமில விதை நேர்த்தி செய்யப்பட்ட சான்றளிக்கப்பட்ட விதைகளை விதைக்கவும்',
      'அதிக மழை பெறும் பகுதிகளில் நோய் வாய்ப்படும் ரகங்களை தவிர்க்கவும்',
      'சோளம், மக்காச்சோளத்துடன் 2 வருட பயிர் சுழற்சி மேற்கொள்ளவும்'
    ],
    isVerifiedData: true,
    audioSpeechEn: 'Bacterial blight spotted on cotton. Spray Streptocycline combined with Copper Oxychloride.',
    audioSpeechTa: 'பருத்தி பயிரில் கோண இலைப்புள்ளி நோய் உள்ளது. ஸ்ட்ரெப்டோசைக்ளின் மற்றும் காப்பர் மருந்து சேர்த்து தெளிக்கவும்.'
  },
  {
    id: 'DIS-03B',
    crop: 'Cotton',
    cropTamil: 'பருத்தி பயிர்',
    diseaseName: 'Cotton American Bollworm Damage (Helicoverpa armigera)',
    diseaseNameTamil: 'பருத்தி அமெரிக்கன் காய் புழு தாக்குதல் (Bollworm)',
    diseaseType: 'pest_damage',
    diseaseTypeTamil: 'பூச்சி தாக்குதல் (Pest Damage)',
    pathogenName: 'Helicoverpa armigera (Insect Larva)',
    confidence: 93.8,
    severity: 'severe',
    severityTamil: 'தீவிரமானது',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=80',
    severityExplanation: 'Bollworm larvae feeding inside cotton bolls detected. Immediate pest management needed to prevent square drop.',
    severityExplanationTamil: 'பருத்தி காய்களுக்குள் காய் புழு துளையிட்டு உண்பது தென்படுகிறது. பூ மற்றும் காய் உதிர்வதை தடுக்க உடனே மருந்து தெளிக்கவும்.',
    causes: [
      'Continuous warm weather encouraging multiple pest generations per season',
      'Presence of alternate host crops (pigeon pea, chickpea, tomato) nearby',
      'Indiscriminate synthetic pyrethroid sprays killing natural predators (spiders/lacewings)',
      'Delayed crop sowing exposing young bolls to peak moth flight'
    ],
    causesTamil: [
      'தொடர் வெப்பமான வானிலையால் புழுக்களின் எண்ணிக்கை வேகமாக பெருகுதல்',
      'அருகில் துவரை, கொண்டைக்கடலை, தக்காளி போன்ற மாற்றுப் பயிர்கள் இருத்தல்',
      'இயற்கை எதிரிகளான சிலந்தி, பொறிவண்டுகளை அழிக்கும் மருந்துகளை கண்டபடி தெளித்தல்',
      'காலம் தாழ்த்திய விதைப்பினால் காய் பிடிக்கும் தருணத்தில் தாய் அந்துப்பூச்சிகள் பெருகல்'
    ],
    symptoms: [
      'Circular bored holes on cotton squares and young bolls with fecal pellets accumulated outside',
      'Larva feeding with head inserted inside boll and body hanging outside',
      'Premature flared-up square dropping and hollow damaged bolls'
    ],
    symptomsTamil: [
      'பருத்தி பிஞ்சுகள் மற்றும் காய்களில் வட்ட வடிவில் துளைகளும் வெளியே புழுவின் கழிவுகளும் இருத்தல்',
      'புழு தலையை காய்க்குள் நுழைத்து உடற்பகுதியை வெளியே தொங்கவிட்டபடி உண்பது',
      'பூ பிஞ்சுகள் மலர்ந்து உதிர்ந்துபோதல் மற்றும் காய்கள் துளையிடப்பட்டு வீணாதல்'
    ],
    immediateActions: [
      'Install Helicoverpa pheromone traps @ 5 traps/acre for moth monitoring.',
      'Handpick and destroy large visible caterpillars from cotton plants.',
      'Erect bird perches @ 20/acre to encourage predatory birds to feed on larvae.',
      'Spray recommended bio-insecticide (HaNPV) or botanical neem formulation.',
      'Apply approved larvicide if pest crosses economic threshold level (ETL).'
    ],
    immediateActionsTamil: [
      'அந்துப்பூச்சிகளை கவர ஏக்கருக்கு 5 வீதம் ஹெலிகோவெர்பா மோகன பொறிகளை (Pheromone Traps) வைக்கவும்.',
      'செடிகளில் உள்ள பெரிய புழுக்களை கைகளால் பிடித்து அழிக்கவும்.',
      'குருவிகள் அமர்ந்து புழுக்களை உண்ண ஏக்கருக்கு 20 பறவை தாங்கிகளை அமைக்கவும்.',
      'HaNPV வைரஸ் கரைசல் அல்லது வேப்ப எண்ணெய் தெளிக்கவும்.',
      'பொருளாதார சேத நிலையை தாண்டும் போது பரிந்துரைக்கப்பட்ட புழுக்கொல்லி மருந்தை தெளிக்கவும்.'
    ],
    culturalControl: [
      'Sow trap crops like okra or marigold (1 row for every 10 rows of cotton)',
      'Intercrop cotton with cowpea or green gram to harbor beneficial beneficial insects'
    ],
    culturalControlTamil: [
      'வரப்புப் பயிராக வெண்டி அல்லது செவ்வந்திப் பூ நட்டு தாய் அந்துப்பூச்சிகளை கவர்தல்',
      'தட்டப்பயறு அல்லது பாசிப்பயறை ஊடுபயிராக நட்டு நன்மை செய்யும் பூச்சிகளை பெருக்குதல்'
    ],
    biologicalControl: [
      'Release Trichogramma chilonis egg parasitoid @ 50,000/acre at weekly intervals',
      'Spray Helicoverpa NPV (HaNPV) @ 250 LE/acre with 0.1% jaggery in evening'
    ],
    biologicalControlTamil: [
      'ட்ரைக்கோகிரம்மா ஒட்டுண்ணி அட்டைகளை ஏக்கருக்கு 50,000 வீதம் வயலில் கட்டுதல்',
      'HaNPV வைரஸ் கரைசல் 250 LE ஏக்கருக்கு மாலை வேளையில் வெல்லத்துடன் கலந்து தெளித்தல்'
    ],
    organicTreatment: [
      'Spray Neem Seed Kernel Extract (NSKE) 5% with soap nut emulsion',
      'Foliar spray of Bacillus thuringiensis (Bt) formulation @ 2g/L'
    ],
    organicTreatmentTamil: [
      '5% வேப்பங்கொட்டைச்சாறு (NSKE) சோப்பு திரவத்துடன் கலந்து தெளிக்கவும்',
      'பேசில்லஸ் துரிஞ்சியென்சிஸ் (Bt) உயிர் மருந்து லிட்டருக்கு 2 கிராம் தெளிக்கவும்'
    ],
    chemicalTreatment: [
      'Recommended active ingredient: Chlorantraniliprole 18.5% SC @ 0.3ml / litre OR Emamectin Benzoate 5% SG @ 0.4g / litre.',
      'Alternative approved active ingredient: Spinetoram 11.7% SC @ 1ml / litre.',
      'Safety Disclaimer: Follow product label directions and consult local agricultural department officers before spraying.'
    ],
    chemicalTreatmentTamil: [
      'பரிந்துரைக்கப்பட்ட புழுக்கொல்லி: குளோரான்ட்ரானிலிப்ரோல் 18.5% SC லிட்டருக்கு 0.3 மிலி அல்லது எமாமெக்டின் பென்சோயேட் 0.4 கிராம் தெளிக்கவும்.',
      'மாற்று மருந்து: ஸ்பினடோரம் 11.7% SC லிட்டருக்கு 1 மிலி கலந்து தெளிக்கவும்.',
      'பாதுகாப்பு குறிப்பு: மருந்து பாட்டில் விபரங்களை படித்து, உள்ளூர் வேளாண்மை அலுவலரின் ஆலோசனையைப் பெறவும்.'
    ],
    prevention: [
      'Deep summer plowing to expose overwintering bollworm pupae to scorching sun',
      'Plant Bt-cotton hybrids containing Cry toxins for built-in bollworm protection',
      'Avoid excessive nitrogen fertilization which causes lush foliage attracting moths'
    ],
    preventionTamil: [
      'ஆழமான கோடை உழவு செய்து மண்ணில் உள்ள கூட்டுப்புழுக்களை சூரிய வெப்பத்திற்கு வெளிப்படுத்துதல்',
      'Bt-பருத்தி ரகங்களை சாகுபடி செய்தல்',
      'அதிக யூரியா இடுவதை தவிர்க்கவும்'
    ],
    isVerifiedData: true,
    audioSpeechEn: 'Cotton Bollworm attack detected. Set up pheromone traps and spray Chlorantraniliprole or NSKE 5%.',
    audioSpeechTa: 'பருத்தி காய் புழு தாக்குதல் உள்ளது. மோகன பொறி வைத்து குளோரான்ட்ரானிலிப்ரோல் அல்லது வேப்பங்கொட்டைச்சாறு தெளிக்கவும்.'
  },
  {
    id: 'DIS-04',
    crop: 'Banana',
    cropTamil: 'வாழை பயிர்',
    diseaseName: 'Sigatoka Leaf Spot (Mycosphaerella musicola)',
    diseaseNameTamil: 'வாழை சிகடோகா இலைப்புள்ளி நோய்',
    diseaseType: 'fungal',
    diseaseTypeTamil: 'பூஞ்சான் நோய்',
    pathogenName: 'Mycosphaerella musicola (Fungus)',
    confidence: 93.0,
    severity: 'mild',
    severityTamil: 'லேசானது',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80',
    severityExplanation: 'Early yellow streaks detected on lower leaves. Prune infected foliage to protect bunch weight.',
    severityExplanationTamil: 'ஆரம்ப கட்ட மஞ்சள் கோடுகள் தென்படுகிறது. வாழைத்தார் எடையை பாதுகாக்க காய்ந்த இலைகளை உடனே வெட்டவும்.',
    causes: [
      'High atmospheric humidity (> 80%) and stagnant irrigation water around pseudostem',
      'Over-crowded side sucker density restricting wind passage through canopy',
      'Windward air currents dispersing fungal ascospores across banana plantations',
      'Shaded damp microclimate under un-pruned dried lower leaves'
    ],
    causesTamil: [
      'காற்றில் அதிக ஈரப்பதம் (> 80%) மற்றும் மரத்தின் அடியில் தண்ணீர் தேங்குதல்',
      'அதிகப்படியான பக்கக் கன்றுகள் வளர்ந்து காற்றோட்டம் தடைபடுதல்',
      'காற்றின் மூலம் பூஞ்சான் வித்துக்கள் பரவுதல்',
      'காய்ந்த இலைகளை வெட்டாமல் நிழல் மற்றும் ஈரப்பதம் மிகுதல்'
    ],
    symptoms: [
      'Minute yellowish-green streaks parallel to leaf side veins',
      'Streaks expanding into oval dark brown spots with grey centres and yellow halos',
      'Extensive leaf destruction reducing green foliage area and banana bunch weight up to 40%'
    ],
    symptomsTamil: [
      'இலை நரம்புகளுக்கு இணையாக சிறிய மஞ்சள் கோடுகள் தோன்றுதல்',
      'கோடுகள் பெரிதாகி நடுவில் சாம்பல் நிற புள்ளிகளாக மாறுதல்',
      'இலைகள் காய்ந்து வாழைத்தாரின் எடை மற்றும் தரம் குறைதல்'
    ],
    immediateActions: [
      'Desucker banana plants leaving only 1 strong follower sucker per mat.',
      'Prune severely spotted and dried lower leaves immediately.',
      'De-weed plantation floor and clear drainage trenches.',
      'Foliar spray of mineral oil mixed with recommended fungicide.',
      'Inspect newly emerging top heart leaf.'
    ],
    immediateActionsTamil: [
      'தேவையில்லாத பக்கக் கன்றுகளை வெட்டி 1 தாய்க்கன்று மட்டும் விட்டுப் பராமரிக்கவும்.',
      'பாதிக்கப்பட்ட மற்றும் காய்ந்த கீழ் இலைகளை வெட்டி அப்புறப்படுத்தவும்.',
      'வாழை மரத்தைச் சுற்றி தண்ணீர் தேங்காதவாறு வடிகால் அமைக்கவும்.',
      'பரிந்துரைக்கப்பட்ட பூஞ்சான்கொல்லி மருந்தை மினரல் ஆயிலுடன் கலந்து தெளிக்கவும்.',
      'புதிதாக வரும் குருத்து இலையை கண்காணிக்கவும்.'
    ],
    culturalControl: [
      'Maintain 1.8m x 1.8m spacing for Cavendish/Grand Naine varieties',
      'Desuckering every 45 days to keep canopy open'
    ],
    culturalControlTamil: [
      'வாழைக்கு 1.8 மீ x 1.8 மீ இடைவெளி பராமரித்தல்',
      '45 நாட்களுக்கு ஒருமுறை பக்கக் கன்றுகளை வெட்டி அகற்றுதல்'
    ],
    biologicalControl: [
      'Foliar spray of Pseudomonas fluorescens @ 10g/L mixed with 1% mineral oil',
      'Spray 5% Neem oil emulsion'
    ],
    biologicalControlTamil: [
      'சூடோமோனாஸ் திரவம் லிட்டருக்கு 10 கிராம் மினரல் ஆயிலுடன் தெளித்தல்',
      '5% வேப்பெண்ணெய் கரைசல் தெளிப்பு'
    ],
    organicTreatment: [
      'Foliar spray of 1% Mineral oil emulsified with mild liquid soap',
      'Spray 5% Ginger-Neem leaf decoction'
    ],
    organicTreatmentTamil: [
      '1% மினரல் ஆயில் (Mineral Oil) சோப்பு திரவத்துடன் கலந்து தெளிக்கவும்',
      '5% இஞ்சி வேப்பிலை கஷாயம் தெளிக்கவும்'
    ],
    chemicalTreatment: [
      'Recommended active ingredient: Propiconazole 25% EC @ 1ml / litre mixed with 1ml mineral oil OR Difenoconazole 25% EC @ 1ml / litre.',
      'Alternative approved active ingredient: Carbendazim 50% WP @ 1g / litre.',
      'Safety Disclaimer: Follow product label directions and consult local agricultural department officers before spraying.'
    ],
    chemicalTreatmentTamil: [
      'பரிந்துரைக்கப்பட்ட மருந்து: புரோபிகோனசோல் 25% EC லிட்டருக்கு 1 மிலி மினரல் ஆயிலுடன் கலந்து தெளிக்கவும்.',
      'மாற்று மருந்து: கார்பென்டசிம் 50% WP 1 கிராம் லிட்டருக்கு தெளிக்கவும்.',
      'பாதுகாப்பு குறிப்பு: மருந்து பாட்டில் விபரங்களை படித்து, உள்ளூர் வேளாண்மை அலுவலரின் ஆலோசனையைப் பெறவும்.'
    ],
    prevention: [
      'Keep banana plantation clean by regular leaf pruning before rainy season',
      'Ensure deep field drainage channels between every 2 rows',
      'Avoid overhead sprinkler irrigation'
    ],
    preventionTamil: [
      'மழைக்காலத்திற்கு முன் காய்ந்த இலைகளை வெட்டி வயலை சுத்தமாக வைத்திருங்கள்',
      'ஒவ்வொரு 2 வரிசைக்கும் இடையே நல்ல வடிகால் வாய்க்கால் அமைக்கவும்',
      'தெளிப்பு நீர் பாசனத்தை தவிர்க்கவும்'
    ],
    isVerifiedData: true,
    audioSpeechEn: 'Banana Sigatoka leaf spot identified. Prune dried lower leaves and spray Propiconazole with mineral oil.',
    audioSpeechTa: 'வாழையில் சிகடோகா இலைப்புள்ளி தென்படுகிறது. காய்ந்த இலைகளை வெட்டிவிட்டு புரோபிகோனசோல் தெளிக்கவும்.'
  },
  {
    id: 'DIS-05',
    crop: 'Chilli',
    cropTamil: 'மிளகாய் பயிர்',
    diseaseName: 'Chilli Anthracnose / Fruit Rot (Colletotrichum capsici)',
    diseaseNameTamil: 'மிளகாய் காய் அழுகல் & பழ அழுகல் நோய் (Anthracnose)',
    diseaseType: 'fungal',
    diseaseTypeTamil: 'பூஞ்சான் நோய்',
    pathogenName: 'Colletotrichum capsici (Fungus)',
    confidence: 94.1,
    severity: 'severe',
    severityTamil: 'தீவிரமானது',
    image: 'https://images.unsplash.com/photo-1588879460418-e39540b61678?w=800&auto=format&fit=crop&q=80',
    severityExplanation: 'Sunken dark lesions detected on ripening chilli fruits. High risk of marketable yield loss.',
    severityExplanationTamil: 'பழுக்கும் மிளகாய் காய்களில் கருமையான அழுகல் புள்ளிகள் உள்ளது. பழங்கள் வீணாவதை தடுக்க உடனே மருந்து தெளிக்கவும்.',
    causes: [
      'High relative humidity (> 80%) and warm temperature (28-30°C) during fruit ripening stage',
      'Fungal spores transmitted through infected seed lots',
      'Overhead irrigation splashing fungal conidia from infected leaves to developing chilli pods',
      'Un-cleared infected dried chilli pods lying on soil bed'
    ],
    causesTamil: [
      'காய் பழுக்கும் தருணத்தில் காற்றில் அதிக ஈரப்பதம் (> 80%) மற்றும் 28-30°C வெப்பநிலை',
      'பாதிக்கப்பட்ட விதைகளின் மூலம் பூஞ்சான் பரவுதல்',
      'மேலிருந்து தண்ணீர் தெளிக்கும்போது இலைகளில் உள்ள பூஞ்சான் காய்களில் தெறித்தல்',
      'வயலில் கிடக்கும் அழுகிய காய் கழிவுகள்'
    ],
    symptoms: [
      'Circular sunken dark black spots with concentric rings of acervuli on ripe chilli fruits',
      'Infected pods dry prematurely, turn straw-colored, and drop off',
      'Die-back symptoms starting from top twigs moving downwards with black discoloration'
    ],
    symptomsTamil: [
      'பழுத்த மிளகாய் காய்களில் வட்ட வடிவில் பள்ளமான கறுப்பு நிற அழுகல் புள்ளிகள் தோன்றுதல்',
      'பாதிக்கப்பட்ட காய்கள் காய்ந்து வைக்கோல் நிறமாக மாறி உதிர்ந்துபோதல்',
      'செடியின் மேல் நுனி கிளைகள் காய்ந்து கீழே கருமையாக பரவுதல் (Die-back)'
    ],
    immediateActions: [
      'Harvest ripe chilli pods immediately and remove infected dry fruits.',
      'Prune dried die-back twigs 2 cm below infected mark.',
      'Stop overhead sprinkler watering.',
      'Spray recommended systemic fungicide.',
      'Separate healthy pods from spotted pods during sun-drying.'
    ],
    immediateActionsTamil: [
      'பழுத்த காய்களை உடனடியாக அறுவடை செய்து பாதிக்கப்பட்ட காய்களை அகற்றுங்கள்.',
      'காய்ந்த நுனி கிளைகளை 2 செ.மீ கீழே வரை வெட்டி அகற்றுங்கள்.',
      'தெளிப்பு நீர் பாசனத்தை நிறுத்தவும்.',
      'பரிந்துரைக்கப்பட்ட பூஞ்சான்கொல்லியை தெளிக்கவும்.',
      'காய்களை காயவைக்கும் போது பாதிக்கப்பட்ட காய்களை தனியாக பிரிக்கவும்.'
    ],
    culturalControl: [
      'Clean sun-drying of harvested chillies on tarpaulin sheets (never on bare soil)',
      'Maintain 45cm x 30cm spacing'
    ],
    culturalControlTamil: [
      'அறுவடை செய்த மிளகாயை தார்பாயில் காயவைத்தல் (வெறும் தரையில் காயவைக்கக்கூடாது)',
      '45 செ.மீ x 30 செ.மீ இடைவெளி பராமரித்தல்'
    ],
    biologicalControl: [
      'Seed treatment with Trichoderma viride @ 4g/kg seed',
      'Foliar spray of Pseudomonas fluorescens @ 10g/L'
    ],
    biologicalControlTamil: [
      'டிரைக்கோடெர்மா விரிடி மூலம் கிலோ விதைக்கு 4 கிராம் விதை நேர்த்தி',
      'சூடோமோனாஸ் திரவம் லிட்டருக்கு 10 கிராம் தெளித்தல்'
    ],
    organicTreatment: [
      'Spray Neem oil 3000 PPM @ 3ml/L with liquid soap surfactant',
      'Foliar spray of Panchagavya 3%'
    ],
    organicTreatmentTamil: [
      '3000 PPM வேப்பெண்ணெய் கரைசல் லிட்டருக்கு 3 மிலி தெளிக்கவும்',
      '3% பஞ்சகவ்யா கரைசல் தெளித்தல்'
    ],
    chemicalTreatment: [
      'Recommended active ingredient: Azoxystrobin 23% SC @ 1ml / litre OR Difenoconazole 25% EC @ 1ml / litre.',
      'Alternative approved active ingredient: Copper Oxychloride 50% WP @ 3g / litre.',
      'Safety Disclaimer: Follow product label directions and consult local agricultural department officers before spraying.'
    ],
    chemicalTreatmentTamil: [
      'பரிந்துரைக்கப்பட்ட மருந்து: அஸோக்ஸிஸ்ட்ரோபின் 23% SC லிட்டருக்கு 1 மிலி அல்லது டைபனோகோனசோல் 1 மிலி தெளிக்கவும்.',
      'மாற்று மருந்து: காப்பர் ஆக்ஸிகுளோரைடு 3 கிராம் லிட்டருக்கு கலந்து தெளிக்கவும்.',
      'பாதுகாப்பு குறிப்பு: மருந்து பாட்டில் விபரங்களை படித்து, உள்ளூர் வேளாண்மை அலுவலரின் ஆலோசனையைப் பெறவும்.'
    ],
    prevention: [
      'Always treat chilli seeds with Thiram @ 3g/kg or Trichoderma viride @ 4g/kg before nursery bed sowing',
      'Avoid growing chilli continuously on same land parcel',
      'Collect and burn diseased dried pods after harvest'
    ],
    preventionTamil: [
      'நாற்று நடும் முன் விதைகளை டிரைக்கோடெர்மா விரிடி கொண்டு விதை நேர்த்தி செய்ய வேண்டும்',
      'ஒரே நிலத்தில் தொடர்ந்து மிளகாய் சாகுபடி செய்வதை தவிர்க்கவும்',
      'அறுவடைக்கு பின் பாதிக்கப்பட்ட காய் கழிவுகளை சேகரித்து எரிக்கவும்'
    ],
    isVerifiedData: true,
    audioSpeechEn: 'Chilli Anthracnose fruit rot detected. Harvest ripe fruits and spray Azoxystrobin or Copper Oxychloride.',
    audioSpeechTa: 'மிளகாயில் பழ அழுகல் நோய் உள்ளது. பழுத்த காய்களை அறுவடை செய்து அஸோக்ஸிஸ்ட்ரோபின் அல்லது காப்பர் மருந்து தெளிக்கவும்.'
  }
];


export const MANDI_PRICES: MandiPrice[] = [
  {
    id: 'MND-01',
    crop: 'Paddy (Ponni / Deluxe)',
    cropTamil: 'நெல் (பொன்னி / டீலக்ஸ்)',
    market: 'Thanjavur Regulated Market',
    district: 'Thanjavur',
    variety: 'Grade A Fine',
    pricePerQuintal: 2480,
    minPrice: 2320,
    maxPrice: 2550,
    priceChange24h: 45,
    trend: 'up',
    bestTimeToSell: 'Hold for 5-7 days. Mill demand rising ahead of festive season.',
    bestTimeToSellTamil: 'அடுத்த 5-7 நாட்களுக்கு இருப்பு வைக்கலாம். பண்டிகை காலத்தால் ஆலைகளின் தேவை அதிகரிக்கிறது.',
    history: [
      { day: 'Mon', price: 2380 },
      { day: 'Tue', price: 2400 },
      { day: 'Wed', price: 2420 },
      { day: 'Thu', price: 2435 },
      { day: 'Fri', price: 2460 },
      { day: 'Sat', price: 2480 },
      { day: 'Sun', price: 2480 },
    ]
  },
  {
    id: 'MND-02',
    crop: 'Turmeric (Finger / Erode)',
    cropTamil: 'மஞ்சள் (விரலி / ஈரோடு)',
    market: 'Erode Semmampalayam Mandi',
    district: 'Erode',
    variety: 'Double Polished Salem Finger',
    pricePerQuintal: 14850,
    minPrice: 13900,
    maxPrice: 15400,
    priceChange24h: 320,
    trend: 'up',
    bestTimeToSell: 'Sell now! Prices at 8-month peak due to export orders.',
    bestTimeToSellTamil: 'இப்போதே விற்கவும்! ஏற்றுமதி ஆர்டர்கள் காரணமாக 8 மாத உச்ச விலையில் உள்ளது.',
    history: [
      { day: 'Mon', price: 13800 },
      { day: 'Tue', price: 14050 },
      { day: 'Wed', price: 14200 },
      { day: 'Thu', price: 14450 },
      { day: 'Fri', price: 14650 },
      { day: 'Sat', price: 14850 },
      { day: 'Sun', price: 14850 },
    ]
  },
  {
    id: 'MND-03',
    crop: 'Tomato (Hybrid Native)',
    cropTamil: 'தக்காளி (நாட்டு / ஹைபிரிட்)',
    market: 'Madurai Mattuthavani Market',
    district: 'Madurai',
    variety: 'Shivam Hybrid Grade 1',
    pricePerQuintal: 3600,
    minPrice: 3200,
    maxPrice: 3900,
    priceChange24h: -150,
    trend: 'down',
    bestTimeToSell: 'Supply influx from neighbouring taluks. Sell immediately to avoid perishability.',
    bestTimeToSellTamil: 'அருகாமை பகுதிகளில் இருந்து வரத்து அதிகம். அழுகும் முன் உடனடியாக விற்கவும்.',
    history: [
      { day: 'Mon', price: 4100 },
      { day: 'Tue', price: 3950 },
      { day: 'Wed', price: 3800 },
      { day: 'Thu', price: 3750 },
      { day: 'Fri', price: 3680 },
      { day: 'Sat', price: 3600 },
      { day: 'Sun', price: 3600 },
    ]
  },
  {
    id: 'MND-04',
    crop: 'Cotton (MCU-5 Long Staple)',
    cropTamil: 'பருத்தி (MCU-5 ரகம்)',
    market: 'Rajapalayam Cotton Market',
    district: 'Virudhunagar',
    variety: 'Long Staple 32mm',
    pricePerQuintal: 7650,
    minPrice: 7200,
    maxPrice: 7900,
    priceChange24h: 80,
    trend: 'up',
    bestTimeToSell: 'Spinning mill procurement active. Favourable pricing.',
    bestTimeToSellTamil: 'நூற்பாலைகளின் நேரடி கொள்முதல் சுறுசுறுப்பாக உள்ளது. நல்ல விலை கிடைக்கும்.',
    history: [
      { day: 'Mon', price: 7400 },
      { day: 'Tue', price: 7450 },
      { day: 'Wed', price: 7500 },
      { day: 'Thu', price: 7550 },
      { day: 'Fri', price: 7600 },
      { day: 'Sat', price: 7650 },
      { day: 'Sun', price: 7650 },
    ]
  },
  {
    id: 'MND-05',
    crop: 'Sugarcane (Co-86032)',
    cropTamil: 'கரும்பு (Co-86032)',
    market: 'Villupuram Sugar Mill Gateway',
    district: 'Villupuram',
    variety: 'High Sucrose Milling Cane',
    pricePerQuintal: 315,
    minPrice: 305,
    maxPrice: 325,
    priceChange24h: 0,
    trend: 'stable',
    bestTimeToSell: 'State FRP + bonus settled at ₹3,150/tonne at factory gate.',
    bestTimeToSellTamil: 'அரசு நிர்ணயித்த கொள்முதல் விலை டன்னுக்கு ₹3,150 ஆலைகளில் நேரடியாக வழங்கப்படுகிறது.',
    history: [
      { day: 'Mon', price: 315 },
      { day: 'Tue', price: 315 },
      { day: 'Wed', price: 315 },
      { day: 'Thu', price: 315 },
      { day: 'Fri', price: 315 },
      { day: 'Sat', price: 315 },
      { day: 'Sun', price: 315 },
    ]
  }
];

export const WHOLESALE_BUYERS: WholesalerBuyer[] = [
  {
    id: 'BUY-01',
    name: 'Karthikeyan Agro Exporters',
    company: 'Karthik Agro Processing Ltd.',
    location: 'Perundurai SIPCOT, Erode',
    district: 'Erode',
    cropsWanted: ['Turmeric (Finger)', 'Dry Ginger', 'Black Pepper'],
    verified: true,
    contactPhone: '+91 98422 99100',
    offeredPriceBonus: '+ ₹150 / Quintal above Mandi Spot',
    rating: 4.9,
  },
  {
    id: 'BUY-02',
    name: 'Cauvery Delta Rice Mills Consortium',
    company: 'Delta Modern Rice Mill',
    location: 'Kumbakonam Road, Thanjavur',
    district: 'Thanjavur',
    cropsWanted: ['Paddy (Ponni)', 'Paddy (CR-1009)', 'Basmati 1121'],
    verified: true,
    contactPhone: '+91 94431 88450',
    offeredPriceBonus: 'Instant Farmgate Truck Pickup & Spot UPI Payment',
    rating: 4.85,
  },
  {
    id: 'BUY-03',
    name: 'Annamalai Cotton Traders',
    company: 'Annamalai Ginning & Pressing Mills',
    location: 'Theni Highway, Rajapalayam',
    district: 'Virudhunagar',
    cropsWanted: ['Cotton (MCU-5)', 'Cotton (DCH-32)', 'Cotton Seeds'],
    verified: true,
    contactPhone: '+91 97880 12399',
    offeredPriceBonus: 'Zero unloading deduction for moisture < 8%',
    rating: 4.7,
  }
];

export const GOVT_SCHEMES: GovtScheme[] = [
  {
    id: 'SCH-01',
    title: 'PM-KISAN Samman Nidhi Yojana',
    titleTamil: 'பிரதமர் கிசான் சம்மான் நிதி திட்டம்',
    category: 'income_support',
    benefitAmount: '₹ 6,000 / Year (3 Installments of ₹2,000)',
    benefitAmountTamil: 'ஆண்டுக்கு ₹ 6,000 (3 தவணைகளாக ₹2,000)',
    description: 'Direct cash transfer support to all landholding farmer families across India for agricultural and domestic needs.',
    descriptionTamil: 'விவசாயிகளின் இடுபொருள் மற்றும் பராமரிப்பு தேவைகளுக்காக ஆண்டுதோறும் தலா ₹2,000 வீதம் 3 தவணைகளில் நேரடியாக வங்கி கணக்கில் செலுத்தப்படுகிறது.',
    eligibility: [
      'All landholding small and marginal farmers with active Aadhaar linked bank account',
      'e-KYC verification completed on PM-KISAN portal',
      'Valid patta/chitta land ownership record'
    ],
    eligibilityTamil: [
      'நில உரிமையுள்ள சிறு மற்றும் குறு விவசாயிகள், ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்கு',
      'PM-KISAN தளத்தில் e-KYC சரிபார்ப்பு முடித்திருக்க வேண்டும்',
      'செல்லுபடியாகும் பட்டா / சிட்டா ஆவணம்'
    ],
    deadline: 'Open all year round',
    applyUrl: 'https://pmkisan.gov.in',
    popularBadge: true,
  },
  {
    id: 'SCH-02',
    title: 'Tamil Nadu Solar Powered Pump-Set Subsidy Scheme',
    titleTamil: 'தமிழக முதலமைச்சரின் சூரியசக்தி பம்புசெட் மானிய திட்டம்',
    category: 'subsidy',
    benefitAmount: '70% Capital Subsidy (Up to ₹ 2,40,000)',
    benefitAmountTamil: '70% அரசு மானியம் (அதிகபட்சம் ₹ 2,40,000 வரை)',
    description: 'Provision of 5HP to 10HP standalone AC/DC solar agriculture pump sets for farmers without free electricity grid connection.',
    descriptionTamil: 'மின் இணைப்பு இல்லாத விவசாயிகளுக்கு 70 சதவீத மானியத்தில் 5 முதல் 10 HP வரை திறன் கொண்ட சோலார் பம்புசெட்டுகள் அமைத்து தருதல்.',
    eligibility: [
      'Farmers with confirmed open well or borewell having adequate yield',
      'Must have applied in TANGEDCO non-priority waiting list',
      'Preference to SC/ST and women farmers (80% subsidy for SC/ST)'
    ],
    eligibilityTamil: [
      'போதுமான தண்ணீர் ஊற்றுள்ள கிணறு அல்லது போர்வெல் வைத்திருக்கும் விவசாயிகள்',
      'மின்வாரிய காத்திருப்போர் பட்டியலில் பதிவு செய்தவர்கள்',
      'ஆதிதிராவிடர் மற்றும் பெண் விவசாயிகளுக்கு கூடுதல் முன்னுரிமை'
    ],
    deadline: 'Next Batch: 30 September 2026',
    applyUrl: 'https://tnhorticulture.tn.gov.in',
    popularBadge: true,
  },
  {
    id: 'SCH-03',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY Crop Insurance)',
    titleTamil: 'பிரதம மந்திரி பயிர் காப்பீட்டு திட்டம் (PMFBY)',
    category: 'insurance',
    benefitAmount: '100% Sum Insured Coverage against Drought, Flood & Pest',
    benefitAmountTamil: 'வறட்சி, வெள்ளம், பூச்சி தாக்குதலுக்கு எதிரான 100% முழு இழப்பீட்டு காப்பீடு',
    description: 'Comprehensive risk insurance covering all non-preventable natural risks from pre-sowing to post-harvest stages.',
    descriptionTamil: 'விதைப்பு முதல் அறுவடை வரை இயற்கை சீற்றங்களால் பயிர்களுக்கு ஏற்படும் இழப்புகளுக்கு மிகக்குறைந்த பிரிமியத்தில் முழு பாதுகாப்பு.',
    eligibility: [
      'All farmers cultivating notified crops (Paddy, Cotton, Maize, Banana, Turmeric)',
      'Farmer premium share only 1.5% for Rabi and 2.0% for Kharif crops'
    ],
    eligibilityTamil: [
      'அறிவிக்கப்பட்ட பயிர்களை சாகுபடி செய்யும் அனைத்து விவசாயிகள் (நெல், பருத்தி, மக்காச்சோளம் போன்றவை)',
      'விவசாயி செலுத்த வேண்டிய பிரீமியம் வெறும் 1.5% முதல் 2% மட்டுமே'
    ],
    deadline: 'Kharif Cutoff: 15 October 2026',
    applyUrl: 'https://pmfby.gov.in',
    popularBadge: false,
  },
  {
    id: 'SCH-04',
    title: 'Kisan Credit Card (KCC) 4% Concessional Agri-Loan',
    titleTamil: 'கிசான் கிரெடிட் கார்டு (KCC) 4% வட்டியில்லா / குறைந்த வட்டி பயிர்க்கடன்',
    category: 'loan',
    benefitAmount: 'Up to ₹ 3,00,000 Collateral-Free at 4% Effective Interest',
    benefitAmountTamil: '₹ 3,00,000 வரை பிணையில்லா கடன் வெறும் 4% வட்டி மானியத்துடன்',
    description: 'Timely credit support to farmers from the banking system with 3% prompt repayment incentive.',
    descriptionTamil: 'வங்கிகள் மற்றும் தொடக்க வேளாண்மை கூட்டுறவு வங்கிகள் மூலம் உடனடி பயிர்க்கடன் மற்றும் இடுபொருள் கொள்முதல் வசதி.',
    eligibility: [
      'Owner cultivators, tenant farmers, oral lessees and SHG farmer groups',
      'No processing fee for loans up to ₹ 1.60 Lakh'
    ],
    eligibilityTamil: [
      'நில உரிமையாளர்கள், குத்தகை விவசாயிகள் மற்றும் உழவர் உற்பத்தியாளர் குழுக்கள் (FPO)',
      'ரூபாய் 1.60 லட்சம் வரையிலான கடன்களுக்கு எந்தவித ஆவண பிணையும் தேவையில்லை'
    ],
    deadline: 'Always Active at Local PACCS / Nationalised Banks',
    applyUrl: 'https://agricoop.gov.in',
    popularBadge: false,
  }
];

export const CURRENT_WEATHER: WeatherData = {
  temp: 31,
  condition: 'Scattered Clouds with Isolated Thunderstorms',
  conditionTamil: 'பகுதி மேகமூட்டம் மற்றும் மிதமான மாலை இடியுடன் கூடிய மழை',
  humidity: 74,
  windSpeed: 14,
  rainfallProbability: 65,
  uvIndex: 7,
  forecast: [
    {
      day: 'Today',
      temp: 31,
      icon: '⛈️',
      rainChance: 65,
      advisory: 'Isolated moderate evening showers. Postpone open pesticide dusting.',
      advisoryTamil: 'மாலையில் மிதமான இடிமழைக்கு வாய்ப்பு. மருந்து தெளிப்பதை தள்ளிப்போடவும்.',
    },
    {
      day: 'Tomorrow',
      temp: 32,
      icon: '⛅',
      rainChance: 40,
      advisory: 'Clear morning; suitable for intercultural weeding and nursery beds.',
      advisoryTamil: 'காலை வேளையில் தெளிவான வானிலை; களையெடுத்தல் மற்றும் நடவுக்கு உகந்தது.',
    },
    {
      day: 'Day 3',
      temp: 33,
      icon: '☀️',
      rainChance: 15,
      advisory: 'Bright sunshine. Ideal for sun-drying harvested grains.',
      advisoryTamil: 'நல்ல வெயில் அடிக்கும். அறுவடை செய்த நெல் மற்றும் தானியங்களை காயவைக்க சிறந்தது.',
    },
    {
      day: 'Day 4',
      temp: 30,
      icon: '🌧️',
      rainChance: 80,
      advisory: 'Heavy convection rainfall expected. Ensure field drainage channels are clear.',
      advisoryTamil: 'கனமழை எதிர்பார்க்கப்படுகிறது. வயல் வடிகால் வாய்க்கால்களை தூர்வாரி வைக்கவும்.',
    },
    {
      day: 'Day 5',
      temp: 29,
      icon: '🌧️',
      rainChance: 70,
      advisory: 'Sustained moisture. Monitor for fungal leaf spots on standing pulse crops.',
      advisoryTamil: 'தொடர் ஈரப்பதம் நிலவும். பயறு வகை பயிர்களில் பூஞ்சான் புள்ளிகளை கண்காணிக்கவும்.',
    }
  ],
  activeAlert: {
    type: 'warning',
    title: 'Monsoon Heavy Rain Watch (Next 48 Hours)',
    titleTamil: 'பருவமழை கனமழை முன்னெச்சரிக்கை (அடுத்த 48 மணி நேரம்)',
    message: 'Regional meteorological radar detects convective thunderstorm cloud formation over Delta & Southern districts. Rainfall between 40mm - 70mm expected.',
    messageTamil: 'டெல்டா மற்றும் தென் மாவட்டங்களில் வளிமண்டல மேலடுக்கு சுழற்சி காரணமாக 40 முதல் 70 மிமீ வரை கனமழை பெய்யக்கூடும்.',
    action: 'Avoid applying granular urea or foliar sprays today. Open field drainage bunds.',
    actionTamil: 'இன்று யூரியா இடுவதை தவிர்க்கவும். வயல் வரப்பு வடிகால்களை திறந்து விடவும்.'
  }
};
