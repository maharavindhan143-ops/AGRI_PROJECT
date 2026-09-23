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
  speakText: (text: string, forceLanguage?: Language) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  activeNotification: string | null;
  dismissNotification: () => void;
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
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Load from local storage on mount
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

  const speakText = (text: string, forceLanguage?: Language) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = forceLanguage || language;
    utterance.lang = targetLang === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
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
        isSpeaking,
        stopSpeaking,
        activeNotification,
        dismissNotification,
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
