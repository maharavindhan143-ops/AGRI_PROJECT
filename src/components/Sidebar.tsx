'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../lib/context/AppContext';
import { 
  LayoutDashboard, 
  Wrench, 
  Building2, 
  HardHat, 
  Tractor, 
  Stethoscope, 
  Sparkles, 
  TrendingUp, 
  Award, 
  MapPin, 
  Bot, 
  FileText,
  PhoneCall
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { t, complaints, role, language } = useApp();

  const pendingComplaintsCount = complaints.filter(c => c.status === 'reported' || c.status === 'assigned').length;
  const readyToVerifyCount = complaints.filter(c => c.status === 'repaired').length;

  const navSections = [
    {
      titleEn: 'Main Overview',
      titleTa: 'முதன்மை பலகை',
      items: [
        {
          href: '/',
          labelEn: 'Dashboard',
          labelTa: 'முகப்பு பலகை',
          icon: <LayoutDashboard className="w-4 h-4 text-emerald-600" />,
          badge: null,
        },
        {
          href: '/map',
          labelEn: 'Village GIS Map',
          labelTa: 'கிராம வரைபடம்',
          icon: <MapPin className="w-4 h-4 text-sky-600" />,
          badge: 'Live',
          badgeColor: 'bg-sky-100 text-sky-800 font-bold',
        },
      ],
    },
    {
      titleEn: '1. Village Grievances (RuralFix)',
      titleTa: '1. கிராம புகார்கள் (ரூரல்ஃபிக்ஸ்)',
      items: [
        {
          href: '/ruralfix',
          labelEn: 'Complaint Status & Tracker',
          labelTa: 'புகார் நிலை & சரிசெய்தல்',
          icon: <Wrench className="w-4 h-4 text-amber-600" />,
          badge: pendingComplaintsCount > 0 ? `${pendingComplaintsCount}` : null,
          badgeColor: 'bg-amber-100 text-amber-900 font-bold',
        },
        {
          href: '/ruralfix/authority',
          labelEn: 'Panchayat Officer Hub',
          labelTa: 'பஞ்சாயத்து அதிகாரி மையம்',
          icon: <Building2 className="w-4 h-4 text-indigo-600" />,
          badge: readyToVerifyCount > 0 ? `${readyToVerifyCount} Verify` : null,
          badgeColor: 'bg-indigo-100 text-indigo-800 font-bold',
          highlightForRole: 'authority',
        },
        {
          href: '/ruralfix/worker',
          labelEn: 'Field Worker Task Board',
          labelTa: 'களப்பணியாளர் வேலைகள்',
          icon: <HardHat className="w-4 h-4 text-amber-700" />,
          badge: null,
          highlightForRole: 'worker',
        },
      ],
    },
    {
      titleEn: '2. Smart Farming (Agro MedKnow)',
      titleTa: '2. விவசாய வழிகாட்டி (AI)',
      items: [
        {
          href: '/agro',
          labelEn: 'Farmer Hub & Weather',
          labelTa: 'விவசாய மையம் & வானிலை',
          icon: <Tractor className="w-4 h-4 text-green-600" />,
          badge: null,
          highlightForRole: 'farmer',
        },
        {
          href: '/agro/disease-detect',
          labelEn: 'AI Leaf Disease Doctor',
          labelTa: 'இலை மருத்துவர் (AI)',
          icon: <Stethoscope className="w-4 h-4 text-emerald-600" />,
          badge: 'Doctor',
          badgeColor: 'bg-emerald-100 text-emerald-800 font-black',
        },
        {
          href: '/agro/recommend',
          labelEn: 'Soil & Crop Advisor',
          labelTa: 'மண் பரிசோதனை & பயிர் தேர்வு',
          icon: <Sparkles className="w-4 h-4 text-green-600" />,
          badge: null,
        },
        {
          href: '/agro/market',
          labelEn: 'Mandi Market & Buyers',
          labelTa: 'மண்டி நேரடி விலை',
          icon: <TrendingUp className="w-4 h-4 text-sky-600" />,
          badge: 'Spot',
          badgeColor: 'bg-emerald-100 text-emerald-800 font-bold',
        },
        {
          href: '/agro/schemes',
          labelEn: 'Govt Schemes & Subsidies',
          labelTa: 'அரசு மானியங்கள் & கடன்',
          icon: <Award className="w-4 h-4 text-purple-600" />,
          badge: 'DBT',
          badgeColor: 'bg-purple-100 text-purple-800 font-bold',
        },
      ],
    },
    {
      titleEn: '3. Voice AI & Reports',
      titleTa: '3. குரல் AI & அறிக்கை',
      items: [
        {
          href: '/ai-assistant',
          labelEn: 'AgroBot Voice Assistant',
          labelTa: 'உழவன் தோழன் (குரல் AI)',
          icon: <Bot className="w-4 h-4 text-purple-600" />,
          badge: 'Voice',
          badgeColor: 'bg-amber-100 text-amber-900 font-black',
        },
        {
          href: '/reports',
          labelEn: 'Panchayat Audit Report',
          labelTa: 'பஞ்சாயத்து அறிக்கை & PDF',
          icon: <FileText className="w-4 h-4 text-slate-700" />,
          badge: 'PDF',
          badgeColor: 'bg-slate-200 text-slate-800 font-bold',
        },
      ],
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block bg-white border-r border-slate-200 min-h-[calc(100vh-4.5rem)] p-4 space-y-6">
      
      {/* Active Persona Box */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider">
            {language === 'ta' ? 'தற்போதைய பயனர் நிலை:' : 'Active Persona:'}
          </span>
        </div>
        <p className="text-sm font-black text-slate-900 mt-1 capitalize">
          {role === 'citizen' && '👤 கிராமத்து பொதுமகன்'}
          {role === 'authority' && '🏛️ பஞ்சாயத்து அதிகாரி'}
          {role === 'worker' && '🔧 களப்பணியாளர்'}
          {role === 'farmer' && '🌾 விவசாயி / உழவர்'}
          {role === 'admin' && '⚙️ நிர்வாகி'}
        </p>
      </div>

      {/* Navigation Groups */}
      <nav className="space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
              {language === 'ta' ? section.titleTa : section.titleEn}
            </h3>
            <div className="mt-1 space-y-1">
              {section.items.map(item => {
                const isActive = pathname === item.href;
                const isRoleTarget = item.highlightForRole === role;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 text-xs font-bold rounded-xl transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : isRoleTarget
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className={`p-1 rounded-lg ${isActive ? 'text-white' : 'bg-slate-100'}`}>
                        {item.icon}
                      </span>
                      <span>{language === 'ta' ? item.labelTa : item.labelEn}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white font-bold' : item.badgeColor
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Village Emergency Numbers Card */}
      <div className="pt-4 border-t border-slate-200">
        <div className="p-3.5 bg-gradient-to-br from-green-50 to-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5 text-xs">
          <div className="flex items-center space-x-2 text-emerald-950 font-black">
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ta' ? 'இலவச உதவி எண்கள்' : 'Free Village Helplines'}</span>
          </div>
          <p className="text-[11px] text-emerald-900 font-bold">
            {language === 'ta' ? 'குறைதீர்ப்பு:' : 'Panchayat:'} <a href="tel:18004251556" className="text-emerald-700 underline font-mono">1800-425-1556</a>
          </p>
          <p className="text-[11px] text-emerald-900 font-bold">
            {language === 'ta' ? 'கிசான் உதவி:' : 'Kisan Help:'} <a href="tel:18001801551" className="text-emerald-700 underline font-mono">1800-180-1551</a>
          </p>
        </div>
      </div>

    </aside>
  );
};
