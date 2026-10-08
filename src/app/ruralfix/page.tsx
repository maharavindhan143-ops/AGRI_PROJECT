'use client';

import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { Complaint, IssueCategory, ComplaintStatus } from '../../types';
import { BeforeAfterSlider } from '../../components/BeforeAfterSlider';
import { ComplaintModal } from '../../components/ComplaintModal';
import { 
  Wrench, 
  Search, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle,
  Lightbulb,
  Car,
  Droplet,
  Trash2,
  School,
  Volume2,
  Zap,
  UserCheck,
  Building2,
  Calendar,
  Check
} from 'lucide-react';

export default function RuralFixPage() {
  const { complaints, language, t, speakText } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeComplaint, setActiveComplaint] = useState<Complaint>(complaints[0]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');

  const filtered = complaints.filter(c => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleTrackSubmit = (e?: React.FormEvent, customId?: string) => {
    if (e) e.preventDefault();
    const idToSearch = (customId || trackingInput).trim().toLowerCase();
    const found = complaints.find(c => c.id.toLowerCase() === idToSearch);
    if (found) {
      setActiveComplaint(found);
    } else if (idToSearch) {
      alert(language === 'ta' ? `புகார் எண் "${idToSearch}" கிடைக்கவில்லை. எ.கா: RF-2026-101` : `Complaint ID "${idToSearch}" not found. Try RF-2026-101 or RF-2026-102.`);
    }
  };

  const getStepState = (targetStep: ComplaintStatus, currentStatus: ComplaintStatus) => {
    const order: ComplaintStatus[] = ['reported', 'assigned', 'in_progress', 'repaired', 'verified'];
    const targetIdx = order.indexOf(targetStep);
    const currentIdx = order.indexOf(currentStatus);

    if (currentIdx > targetIdx) return 'completed';
    if (currentIdx === targetIdx) return 'current';
    return 'upcoming';
  };

  const categoryIcons: Record<string, { icon: React.ReactNode; labelTa: string; labelEn: string }> = {
    street_light: { icon: <Lightbulb className="w-4 h-4 text-amber-500" />, labelTa: 'தெரு விளக்கு', labelEn: 'Street Light' },
    road_pothole: { icon: <Car className="w-4 h-4 text-rose-500" />, labelTa: 'சாலை / பள்ளம்', labelEn: 'Road / Pothole' },
    water_supply: { icon: <Droplet className="w-4 h-4 text-blue-500" />, labelTa: 'குடிநீர் பைப்', labelEn: 'Water Supply' },
    drainage: { icon: <Trash2 className="w-4 h-4 text-emerald-600" />, labelTa: 'சாக்கடை / சுத்தம்', labelEn: 'Waste / Cleanliness' },
    public_toilet: { icon: <Wrench className="w-4 h-4 text-purple-500" />, labelTa: 'பொது கழிப்பறை', labelEn: 'Public Toilet' },
    school_building: { icon: <School className="w-4 h-4 text-indigo-500" />, labelTa: 'கிராமப் பள்ளி', labelEn: 'Village School' },
    power_grid: { icon: <Zap className="w-4 h-4 text-amber-600" />, labelTa: 'மின்சாரம் / ஒயர்', labelEn: 'Electricity' },
    other: { icon: <AlertTriangle className="w-4 h-4 text-slate-500" />, labelTa: 'பிற பொது வசதி', labelEn: 'Other Facility' },
  };

  const playTrackerStatusAudio = () => {
    if (!activeComplaint) return;
    const msgTa = `புகார் எண் ${activeComplaint.id}. தற்போதைய நிலை: ${activeComplaint.status === 'verified' ? 'பஞ்சாயத்து அதிகாரியால் சரிபார்க்கப்பட்டது.' : activeComplaint.status === 'repaired' ? 'பழுது பார்க்கப்பட்டது.' : 'பணி நடந்து வருகிறது.'}`;
    const msgEn = `Complaint ID ${activeComplaint.id}. Current status is ${activeComplaint.status.replace('_', ' ')}. Location ${activeComplaint.location.address}.`;
    speakText(language === 'ta' ? msgTa : msgEn, language);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1">
            <Wrench className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'கிராம குறைதீர்ப்பு போர்ட்டல்' : 'Village Grievance Portal'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'ta' ? 'உங்கள் புகார் நிலையை பார்க்க (Track Your Complaint)' : 'Track Your Complaint'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {language === 'ta' 
              ? 'சமீபத்திய நிலையை அறிய உங்கள் புகார் எண்ணை உள்ளிடவும்.'
              : 'Enter your Complaint ID to see the latest status.'}
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/25 flex items-center space-x-2 self-start sm:self-center active:scale-95 transition-all"
        >
          <PlusCircle className="w-5 h-5 text-slate-950" />
          <span>{language === 'ta' ? '➕ புகாரை பதிவு செய்யுங்கள்' : '➕ Report Problem'}</span>
        </button>
      </div>

      {/* Large Simple Tracker Input Box */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-sky-500/20 space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <span>🔍</span>
            <span>{language === 'ta' ? 'புகார் எண்ணை உள்ளிடவும்' : 'Enter Complaint ID'}</span>
          </h2>
          <p className="text-xs text-sky-200">
            {language === 'ta' ? 'எடுத்துக்காட்டு: RF-2026-101, RF-2026-102' : 'Example: RF-2026-101, RF-2026-102'}
          </p>
        </div>

        <form onSubmit={(e) => handleTrackSubmit(e)} className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <div className="flex-1 w-full relative">
            <input
              type="text"
              placeholder="e.g. RF-2026-101"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="w-full bg-white/10 border-2 border-white/25 rounded-2xl px-4 py-3 text-base text-amber-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono font-black tracking-wider"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all flex-shrink-0"
          >
            {language === 'ta' ? 'புகார் நிலையை காண்க' : 'Track Status'}
          </button>
        </form>
      </div>

      {/* Active Selected Grievance Detailed Timeline Tracker */}
      {activeComplaint && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base font-extrabold text-sky-800 bg-sky-100 px-3 py-1 rounded-xl border border-sky-300">
                  {activeComplaint.id}
                </span>
                <span className={`text-xs px-3 py-0.5 rounded-full font-bold ${
                  activeComplaint.severity === 'critical' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                  activeComplaint.severity === 'high' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                  'bg-sky-100 text-sky-800 border border-sky-200'
                }`}>
                  {activeComplaint.severity === 'critical' || activeComplaint.severity === 'high' ? '⚠️ High Priority' : 'Standard Priority'}
                </span>

                <button
                  onClick={playTrackerStatusAudio}
                  className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                  <span>{language === 'ta' ? '🔊 கேளுங்கள்' : '🔊 Listen'}</span>
                </button>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">{activeComplaint.title}</h2>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>📍 {activeComplaint.location.address}, {activeComplaint.location.village}, {activeComplaint.location.district}</span>
              </p>
            </div>

            {/* Clear Status Pills */}
            <div className="text-left sm:text-right">
              <span className={`inline-block px-4 py-1.5 rounded-2xl text-xs font-black uppercase shadow-sm ${
                activeComplaint.status === 'verified' ? 'bg-emerald-600 text-white' :
                activeComplaint.status === 'repaired' ? 'bg-emerald-500 text-white' :
                activeComplaint.status === 'in_progress' ? 'bg-amber-500 text-slate-950 font-bold' :
                activeComplaint.status === 'assigned' ? 'bg-sky-500 text-white' :
                'bg-sky-600 text-white'
              }`}>
                {activeComplaint.status === 'verified' ? '✅ Verified / Completed' :
                 activeComplaint.status === 'repaired' ? '🟢 Repaired' :
                 activeComplaint.status === 'in_progress' ? '🟠 Repairing' :
                 activeComplaint.status === 'assigned' ? '🟡 Assigned' : '🔵 Reported'}
              </span>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                {language === 'ta' ? 'பதிவு செய்த நாள்:' : 'Reported Date:'} {new Date(activeComplaint.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* 5-Stage Simple Visual Workflow Stepper */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              {language === 'ta' ? 'பணி முன்னேற்ற நிலை:' : 'Complaint Progression Status:'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { key: 'reported' as ComplaintStatus, num: '①', labelTa: 'பதிவு செய்யப்பட்டது', labelEn: 'Reported', subTa: '✓ புகார் பெறப்பட்டது', subEn: '✓ Complaint received' },
                { key: 'assigned' as ComplaintStatus, num: '②', labelTa: 'நியமனம்', labelEn: 'Assigned', subTa: '✓ பணியாளர் நியமிக்கப்பட்டார்', subEn: '✓ Worker assigned' },
                { key: 'in_progress' as ComplaintStatus, num: '③', labelTa: 'பழுதுபார்ப்பு', labelEn: 'Repairing', subTa: '✓ பழுது பார்க்கப்படுகிறது', subEn: '✓ Work in progress' },
                { key: 'repaired' as ComplaintStatus, num: '④', labelTa: 'சரி செய்யப்பட்டது', labelEn: 'Repaired', subTa: '✓ பழுது சரிசெய்யப்பட்டது', subEn: '✓ Repair completed' },
                { key: 'verified' as ComplaintStatus, num: '⑤', labelTa: 'சரிபார்க்கப்பட்டது', labelEn: 'Verified', subTa: '✓ பஞ்சாயத்து அதிகாரி சரிபார்த்தார்', subEn: '✓ Verified by Panchayat' },
              ].map((step, idx) => {
                const state = getStepState(step.key, activeComplaint.status);

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border-2 text-center transition-all ${
                      state === 'completed'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-extrabold'
                        : state === 'current'
                        ? 'bg-amber-50 border-amber-500 text-slate-950 font-black ring-2 ring-amber-400 shadow-md scale-[1.02]'
                        : 'bg-slate-50 border-slate-200 text-slate-400 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <span className="text-xs font-black">{step.num}</span>
                      <span className="text-xs font-bold">{language === 'ta' ? step.labelTa : step.labelEn}</span>
                    </div>
                    <p className="text-[10px] truncate opacity-90 font-medium">{language === 'ta' ? step.subTa : step.subEn}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side by Side Information & Repair Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Visual Photo Proof */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>{language === 'ta' ? '📷 பழுதுபார்ப்பு சான்று (Repair Proof)' : '📷 Repair Proof'}</span>
              </h4>
              {activeComplaint.photoAfter ? (
                <div>
                  <BeforeAfterSlider
                    beforeImage={activeComplaint.photoBefore}
                    afterImage={activeComplaint.photoAfter}
                    beforeLabel={language === 'ta' ? 'முன்பு (Before)' : 'Before'}
                    afterLabel={language === 'ta' ? 'பின்பு (After)' : 'After'}
                    height="h-60"
                  />
                  <p className="text-[11px] text-emerald-800 text-center font-bold mt-1.5">
                    ✓ {language === 'ta' ? 'பழுது பார்க்கப்பட்டு பஞ்சாயத்து அதிகாரியால் சரிபார்க்கப்பட்டது.' : 'Repair completed and verified.'}
                  </p>
                </div>
              ) : (
                <div className="relative h-60 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <img src={activeComplaint.photoBefore} alt="Before" className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-xl shadow-md">
                    ⚠️ {language === 'ta' ? 'பதிவு செய்த படம்' : 'Reported Photo'}
                  </div>
                  <div className="absolute bottom-3 inset-x-3 bg-black/75 backdrop-blur-sm text-white text-xs p-2.5 rounded-xl text-center font-bold">
                    {language === 'ta' ? 'பணியாளர் சரிசெய்து படம் பதிவேற்றுவார்.' : 'On-site field repair in progress.'}
                  </div>
                </div>
              )}
            </div>

            {/* Citizen Information & Department Assignment */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <span>{language === 'ta' ? 'துறை & நிலவர விபரம்:' : 'Department & Progress Information:'}</span>
                </h4>
                
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">{language === 'ta' ? 'பதிவு செய்யப்பட்ட நாள்:' : 'Reported Date:'}</span>
                  <span className="font-bold text-slate-900">{new Date(activeComplaint.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">{language === 'ta' ? 'ஒதுக்கப்பட்ட துறை:' : 'Assigned Department:'}</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {language === 'ta' ? 'கிராம ஊராட்சி பராமரிப்பு குழு' : 'Panchayat Maintenance Division'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">{language === 'ta' ? 'தற்போதைய நிலை:' : 'Current Status:'}</span>
                  <span className="font-bold text-slate-900 capitalize">
                    {activeComplaint.status.replace('_', ' ')}
                  </span>
                </div>

                {activeComplaint.repairNotes && (
                  <div className="py-1">
                    <span className="text-slate-500 block mb-1 font-medium">{language === 'ta' ? 'பணியாளர் பழுதுபார்ப்பு குறிப்பு:' : 'Worker Repair Summary:'}</span>
                    <p className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold">
                      "{activeComplaint.repairNotes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Panchayat Verified Seal */}
              {activeComplaint.status === 'verified' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold flex items-center gap-1.5 text-emerald-900 text-xs sm:text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      {language === 'ta' ? '✓ பஞ்சாயத்து அதிகாரி சரிபார்த்தார்' : '✓ Verified by Panchayat'}
                    </span>
                    <div className="flex text-amber-500 text-sm">
                      {'★'.repeat(activeComplaint.citizenRating || 5)}
                    </div>
                  </div>
                  <p className="text-xs text-emerald-800 italic">
                    "{activeComplaint.citizenFeedback || (language === 'ta' ? 'பணி நல்ல முறையில் முடிந்துள்ளது.' : 'Work completed promptly and verified.')}"
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* My Complaints Registry Cards Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {language === 'ta' ? '📋 கிராம புகார்கள் பட்டியல் (My Complaints)' : '📋 Village Complaints Registry'} ({filtered.length})
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'ta' ? 'புகாரைத் தொட்டு நிலையை நேரடியாகத் தெரிந்துகொள்ளலாம்.' : 'Click any complaint to see its live progress status.'}
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={language === 'ta' ? 'ஊர் பெயர், எண்...' : 'Search village, ID...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Complaints Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map(c => (
            <button
              key={c.id} 
              onClick={() => handleTrackSubmit(undefined, c.id)}
              className={`p-4 rounded-2xl border text-left transition-all space-y-2.5 ${
                activeComplaint?.id === c.id 
                  ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/40 shadow-sm' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-mono font-extrabold text-xs text-sky-800 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                  {c.id}
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full capitalize ${
                  c.status === 'verified' ? 'bg-emerald-600 text-white' :
                  c.status === 'repaired' ? 'bg-emerald-500 text-white' :
                  c.status === 'in_progress' ? 'bg-amber-500 text-slate-950 font-bold' :
                  'bg-sky-600 text-white'
                }`}>
                  {c.status === 'verified' ? '✓ Verified' : c.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xl flex-shrink-0">{categoryIcons[c.category]?.icon || '🛠️'}</span>
                <h4 className="font-extrabold text-xs text-slate-900 truncate flex-1">
                  {c.title}
                </h4>
              </div>

              <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate font-medium">
                <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span>{c.location.address}, {c.location.village}</span>
              </p>
            </button>
          ))}
        </div>
      </div>

      <ComplaintModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onTrackComplaint={(id) => handleTrackSubmit(undefined, id)}
      />

    </div>
  );
}
