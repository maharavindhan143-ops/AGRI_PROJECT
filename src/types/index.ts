export type UserRole = 'citizen' | 'authority' | 'worker' | 'farmer' | 'admin';

export type Language = 'en' | 'ta';

export type IssueCategory = 
  | 'street_light' 
  | 'road_pothole' 
  | 'water_supply' 
  | 'public_toilet' 
  | 'school_building' 
  | 'drainage' 
  | 'power_grid'
  | 'other';

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';

export type ComplaintStatus = 
  | 'reported' 
  | 'assigned' 
  | 'in_progress' 
  | 'repaired' 
  | 'verified' 
  | 'rejected';

export interface LocationGeo {
  address: string;
  village: string;
  panchayat: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
}

export interface Complaint {
  id: string;
  title: string;
  category: IssueCategory;
  description: string;
  location: LocationGeo;
  photoBefore: string;
  photoAfter?: string;
  severity: IssueSeverity;
  status: ComplaintStatus;
  reportedBy: {
    name: string;
    phone: string;
    avatar?: string;
  };
  assignedWorker?: {
    id: string;
    name: string;
    phone: string;
    specialization: string;
    avatar?: string;
  };
  assignedAt?: string;
  repairedAt?: string;
  verifiedAt?: string;
  repairNotes?: string;
  materialsUsed?: string[];
  citizenRating?: number;
  citizenFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkerProfile {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  avatar: string;
  activeTasks: number;
  completedTasks: number;
  rating: number;
  status: 'available' | 'on_duty' | 'offline';
}

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  village: string;
  panchayat: string;
  district: string;
  soilType: 'red' | 'black' | 'alluvial' | 'clay' | 'laterite';
  landSizeAcres: number;
  primaryCrop: string;
  irrigationSource: 'borewell' | 'canal' | 'drip' | 'rainfed';
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
}

export interface CropRecommendation {
  id: string;
  cropName: string;
  cropNameTamil: string;
  suitabilityScore: number;
  icon: string;
  expectedYield: string;
  expectedYieldTamil: string;
  investmentPerAcre: string;
  estimatedProfit: string;
  waterRequirement: 'Low' | 'Medium' | 'High';
  waterRequirementTamil: 'குறைவு' | 'நடுத்தரம்' | 'அதிகம்';
  durationDays: string;
  marketDemand: 'High' | 'Moderate' | 'Very High';
  reasons: string[];
  reasonsTamil: string[];
}

export interface DiseaseDiagnosis {
  id: string;
  diseaseName: string;
  diseaseNameTamil: string;
  crop: string;
  cropTamil: string;
  confidence: number;
  diseaseType?: 'fungal' | 'bacterial' | 'viral' | 'pest_damage' | 'deficiency';
  diseaseTypeTamil?: string;
  pathogenName?: string;
  severity: 'mild' | 'moderate' | 'severe';
  severityTamil: 'லேசானது' | 'மிதமானது' | 'தீவிரமானது';
  severityExplanation?: string;
  severityExplanationTamil?: string;
  causes?: string[];
  causesTamil?: string[];
  favorableConditions?: string[];
  favorableConditionsTamil?: string[];
  symptoms: string[];
  symptomsTamil: string[];
  immediateActions?: string[];
  immediateActionsTamil?: string[];
  culturalControl?: string[];
  culturalControlTamil?: string[];
  biologicalControl?: string[];
  biologicalControlTamil?: string[];
  organicTreatment: string[];
  organicTreatmentTamil: string[];
  chemicalTreatment: string[];
  chemicalTreatmentTamil: string[];
  prevention: string[];
  preventionTamil: string[];
  image: string;
  audioSpeechEn?: string;
  audioSpeechTa?: string;
  isVerifiedData?: boolean;
}

export interface MandiPrice {
  id: string;
  crop: string;
  cropTamil: string;
  market: string;
  district: string;
  variety: string;
  pricePerQuintal: number;
  minPrice: number;
  maxPrice: number;
  priceChange24h: number;
  trend: 'up' | 'down' | 'stable';
  bestTimeToSell: string;
  bestTimeToSellTamil: string;
  history: { day: string; price: number }[];
}

export interface WholesalerBuyer {
  id: string;
  name: string;
  company: string;
  location: string;
  district: string;
  cropsWanted: string[];
  verified: boolean;
  contactPhone: string;
  offeredPriceBonus: string;
  rating: number;
}

export interface GovtScheme {
  id: string;
  title: string;
  titleTamil: string;
  category: 'subsidy' | 'loan' | 'insurance' | 'income_support';
  benefitAmount: string;
  benefitAmountTamil: string;
  description: string;
  descriptionTamil: string;
  eligibility: string[];
  eligibilityTamil: string[];
  deadline: string;
  applyUrl: string;
  popularBadge?: boolean;
}

export interface WeatherData {
  temp: number;
  condition: string;
  conditionTamil: string;
  humidity: number;
  windSpeed: number;
  rainfallProbability: number;
  uvIndex: number;
  forecast: {
    day: string;
    temp: number;
    icon: string;
    rainChance: number;
    advisory: string;
    advisoryTamil: string;
  }[];
  activeAlert?: {
    type: 'warning' | 'danger' | 'info';
    title: string;
    titleTamil: string;
    message: string;
    messageTamil: string;
    action: string;
    actionTamil: string;
  };
}
