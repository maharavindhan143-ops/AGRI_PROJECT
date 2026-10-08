'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Language, 
  Complaint, 
  WorkerProfile, 
  FarmerProfile, 
  MandiPrice, 
  GovtScheme, 
  WeatherData,
  ComplaintStatus
} from '../../types';
import { 
  INITIAL_COMPLAINTS, 
  WORKERS_LIST, 
  INITIAL_FARMER_PROFILE, 
  MANDI_PRICES, 
  GOVT_SCHEMES, 
  CURRENT_WEATHER 
} from '../mockData';
import { translations } from '../translations';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  complaints: Complaint[];
  workers: WorkerProfile[];
  farmerProfile: FarmerProfile;
  weather: WeatherData;
  mandiPrices: MandiPrice[];
  govSchemes: GovtScheme[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>) => Complaint;
  assignWorkerToComplaint: (complaintId: string, workerId: string) => void;
  updateComplaintByWorker: (
    complaintId: string, 
    status: ComplaintStatus, 
    notes?: string, 
    photoAfter?: string, 
    materials?: string[]
  ) => void;
  verifyComplaintByAuthority: (complaintId: string, rating?: number, feedback?: string) => void;
  updateFarmerProfile: (profile: Partial<FarmerProfile>) => void;
  speakText: (text: string, forceLanguage?: Language | 'both', fallbackEnglishText?: string) => void;
  speakBilingual: (tamilText: string, englishText: string) => void;
  isSpeaking: boolean;
  speakingLang: 'ta' | 'en' | 'both' | null;
  stopSpeaking: () => void;
  activeNotification: string | null;
  dismissNotification: () => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  openReportModal: () => void;
  closeReportModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_COMPLAINTS = 'ruralfix_complaints_v1';
const LOCAL_STORAGE_KEY_FARMER = 'agromed_farmer_v1';
const LOCAL_STORAGE_KEY_ROLE = 'ruralfix_role_v1';
const LOCAL_STORAGE_KEY_LANG = 'ruralfix_lang_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('citizen');
  const [language, setLanguageState] = useState<Language>('en');
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [workers, setWorkers] = useState<WorkerProfile[]>(WORKERS_LIST);
  const [farmerProfile, setFarmerProfileState] = useState<FarmerProfile>(INITIAL_FARMER_PROFILE);
  const [weather] = useState<WeatherData>(CURRENT_WEATHER);
  const [mandiPrices] = useState<MandiPrice[]>(MANDI_PRICES);
  const [govSchemes] = useState<GovtScheme[]>(GOVT_SCHEMES);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingLang, setSpeakingLang] = useState<'ta' | 'en' | 'both' | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const activeAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const isCancelledRef = React.useRef(false);

  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  // Load from local storage on mount & pre-fetch voices
  useEffect(() => {
    try {
      const savedComplaints = localStorage.getItem(LOCAL_STORAGE_KEY_COMPLAINTS);
      if (savedComplaints) {
        setComplaints(JSON.parse(savedComplaints));
      }
      const savedFarmer = localStorage.getItem(LOCAL_STORAGE_KEY_FARMER);
      if (savedFarmer) {
        setFarmerProfileState(JSON.parse(savedFarmer));
      }
      const savedRole = localStorage.getItem(LOCAL_STORAGE_KEY_ROLE);
      if (savedRole && ['citizen', 'authority', 'worker', 'farmer', 'admin'].includes(savedRole)) {
        setRoleState(savedRole as UserRole);
      }
      const savedLang = localStorage.getItem(LOCAL_STORAGE_KEY_LANG);
      if (savedLang && (savedLang === 'en' || savedLang === 'ta')) {
        setLanguageState(savedLang as Language);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Pre-fetch browser Speech Synthesis voices
    const loadVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices && availableVoices.length > 0) {
          setVoices(availableVoices);
        }
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem(LOCAL_STORAGE_KEY_ROLE, newRole);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem(LOCAL_STORAGE_KEY_LANG, newLang);
  };

  const t = (key: keyof typeof translations.en): string => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || String(key);
  };

  const addComplaint = (data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>): Complaint => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newId = `RF-2026-${randomNum}`;
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      ...data,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_COMPLAINTS, JSON.stringify(updated));
    setActiveNotification(`New Grievance #${newId} recorded with GPS coordinates!`);
    return newComplaint;
  };

  const assignWorkerToComplaint = (complaintId: string, workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;

    const now = new Date().toISOString();
    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: 'assigned' as ComplaintStatus,
          assignedWorker: {
            id: worker.id,
            name: worker.name,
            phone: worker.phone,
            specialization: worker.specialization,
            avatar: worker.avatar,
          },
          assignedAt: now,
          updatedAt: now,
        };
      }
      return c;
    });

    setComplaints(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_COMPLAINTS, JSON.stringify(updated));

    // Update worker active task count
    setWorkers(workers.map(w => w.id === workerId ? { ...w, activeTasks: w.activeTasks + 1 } : w));
    setActiveNotification(`Grievance #${complaintId} assigned to field worker ${worker.name}.`);
  };

  const updateComplaintByWorker = (
    complaintId: string, 
    status: ComplaintStatus, 
    notes?: string, 
    photoAfter?: string, 
    materials?: string[]
  ) => {
    const now = new Date().toISOString();
    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status,
          repairNotes: notes || c.repairNotes,
          photoAfter: photoAfter || c.photoAfter,
          materialsUsed: materials || c.materialsUsed,
          repairedAt: (status === 'repaired' || status === 'verified') ? now : c.repairedAt,
          updatedAt: now,
        };
      }
      return c;
    });

    setComplaints(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_COMPLAINTS, JSON.stringify(updated));
    setActiveNotification(`Grievance #${complaintId} updated to status: ${status.toUpperCase()}`);
  };

  const verifyComplaintByAuthority = (complaintId: string, rating?: number, feedback?: string) => {
    const now = new Date().toISOString();
    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: 'verified' as ComplaintStatus,
          verifiedAt: now,
          citizenRating: rating || 5,
          citizenFeedback: feedback || 'Work inspected and verified by Panchayat Officer.',
          updatedAt: now,
        };
      }
      return c;
    });

    setComplaints(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_COMPLAINTS, JSON.stringify(updated));
    setActiveNotification(`Grievance #${complaintId} verified and officially closed!`);
  };

  const updateFarmerProfile = (profileUpdate: Partial<FarmerProfile>) => {
    const updated = { ...farmerProfile, ...profileUpdate };
    setFarmerProfileState(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_FARMER, JSON.stringify(updated));
  };

  const sessionIdRef = React.useRef(0);

  const getBestVoice = (targetLang: Language): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    if (!currentVoices || currentVoices.length === 0) return null;

    if (targetLang === 'ta') {
      // Find dedicated Tamil voice
      const tamilVoice = currentVoices.find(v => 
        v.lang.toLowerCase().startsWith('ta') ||
        v.name.toLowerCase().includes('tamil') ||
        v.name.toLowerCase().includes('valluvar') ||
        v.name.toLowerCase().includes('pallavi')
      );
      if (tamilVoice) return tamilVoice;

      // Secondary: any Indian accent voice
      const inVoice = currentVoices.find(v => v.lang.toLowerCase().includes('ta-in') || v.lang.toLowerCase().includes('in'));
      if (inVoice) return inVoice;
    } else {
      // Find dedicated English voice (prefer Indian English or standard)
      const enInVoice = currentVoices.find(v => 
        v.lang.toLowerCase() === 'en-in' || 
        v.name.toLowerCase().includes('india') || 
        v.name.toLowerCase().includes('heera') || 
        v.name.toLowerCase().includes('ravi')
      );
      if (enInVoice) return enInVoice;

      const enVoice = currentVoices.find(v => v.lang.toLowerCase().startsWith('en'));
      if (enVoice) return enVoice;
    }
    return null;
  };

  const stopSpeakingInternal = () => {
    isCancelledRef.current = true;
    if (activeAudioRef.current) {
      const audio = activeAudioRef.current;
      audio.onended = null;
      audio.onerror = null;
      audio.onplay = null;
      audio.pause();
      audio.src = '';
      try {
        audio.removeAttribute('src');
        audio.load();
      } catch {}
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speakUtterancePromise = (text: string, targetLang: Language, session: number): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window) || isCancelledRef.current) {
        resolve();
        return;
      }

      if (sessionIdRef.current !== session) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang === 'ta' ? 'ta-IN' : 'en-IN';
      utterance.rate = targetLang === 'ta' ? 0.9 : 0.95;
      utterance.pitch = 1.0;

      const voice = getBestVoice(targetLang);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        resolve();
      };
      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  const playAudioStream = (text: string, targetLang: Language): Promise<void> => {
    const currentSession = ++sessionIdRef.current;
    isCancelledRef.current = false;
    stopSpeakingInternal();
    isCancelledRef.current = false;

    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      let resolved = false;
      const safeResolve = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      const url = `/api/tts?text=${encodeURIComponent(text)}&lang=${targetLang}`;
      const audio = new Audio();
      activeAudioRef.current = audio;

      let hasFallenBack = false;
      const triggerFallback = () => {
        if (hasFallenBack || sessionIdRef.current !== currentSession || isCancelledRef.current) {
          safeResolve();
          return;
        }
        hasFallenBack = true;
        // Strictly destroy the audio element before fallback to avoid simultaneous dual voice
        audio.onended = null;
        audio.onerror = null;
        audio.onplay = null;
        audio.pause();
        audio.src = '';
        try {
          audio.removeAttribute('src');
          audio.load();
        } catch {}
        if (activeAudioRef.current === audio) {
          activeAudioRef.current = null;
        }
        speakUtterancePromise(text, targetLang, currentSession).then(safeResolve);
      };

      audio.onended = () => {
        if (activeAudioRef.current === audio) {
          activeAudioRef.current = null;
        }
        safeResolve();
      };

      audio.onerror = () => {
        triggerFallback();
      };

      audio.src = url;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (sessionIdRef.current !== currentSession || isCancelledRef.current) {
            safeResolve();
            return;
          }
          if (audio.paused && !hasFallenBack) {
            triggerFallback();
          }
        });
      }
    });
  };

  const speakNatural = async (text: string, targetLang: Language) => {
    await playAudioStream(text, targetLang);
  };

  const speakBilingual = async (tamilText: string, englishText: string) => {
    // Speaks single clear voice based on the active user language
    const targetLang: Language = language === 'ta' ? 'ta' : 'en';
    const textToSpeak = language === 'ta' ? tamilText : englishText;
    await speakText(textToSpeak, targetLang);
  };

  const speakText = async (text: string, forceLanguage?: Language | 'both', fallbackEnglishText?: string) => {
    stopSpeaking();
    isCancelledRef.current = false;
    const targetLang: Language = (forceLanguage === 'both' ? language : forceLanguage) || language;
    const textToPlay = (forceLanguage === 'both' && fallbackEnglishText)
      ? (language === 'ta' ? text : fallbackEnglishText)
      : text;

    setIsSpeaking(true);
    setSpeakingLang(targetLang);

    await speakNatural(textToPlay, targetLang);

    setIsSpeaking(false);
    setSpeakingLang(null);
  };

  const stopSpeaking = () => {
    sessionIdRef.current++;
    stopSpeakingInternal();
    setIsSpeaking(false);
    setSpeakingLang(null);
  };

  const dismissNotification = () => setActiveNotification(null);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        complaints,
        workers,
        farmerProfile,
        weather,
        mandiPrices,
        govSchemes,
        addComplaint,
        assignWorkerToComplaint,
        updateComplaintByWorker,
        verifyComplaintByAuthority,
        updateFarmerProfile,
        speakText,
        speakBilingual,
        isSpeaking,
        speakingLang,
        stopSpeaking,
        activeNotification,
        dismissNotification,
        isReportModalOpen,
        setIsReportModalOpen,
        openReportModal,
        closeReportModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
