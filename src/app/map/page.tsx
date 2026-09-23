'use client';

import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { InteractiveGisMap } from '../../components/InteractiveGisMap';
import { Complaint } from '../../types';
import { 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function MapPage() {
  const { complaints, language } = useApp();
  const [inspectedComplaint, setInspectedComplaint] = useState<Complaint | null>(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'தேசிய செயற்கைக்கோள் வரைபடம்' : 'National Satellite GIS Map'}</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'ta' ? 'இந்திய கிராம ஸ்மார்ட் வரைபடம்' : 'India Village Smart Map'}
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {language === 'ta' 
              ? 'இந்தியா முழுவதும் உள்ள கிராம உள்கட்டமைப்பு, விவசாயம், சந்தைகள் மற்றும் வானிலை அபாயங்களை ஆராயுங்கள்.' 
              : 'Explore village infrastructure, agriculture, markets and weather risks across India.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-700 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm self-start sm:self-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold">{complaints.length} Live Civic Pins</span>
        </div>
      </div>

      {/* Fullscreen Interactive Satellite Map Canvas */}
      <InteractiveGisMap 
        heightClass="h-[640px]" 
        onSelectComplaint={(c) => setInspectedComplaint(c)} 
      />

      {/* Selected Complaint Detailed Inspector Card */}
      {inspectedComplaint && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                {inspectedComplaint.id}
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 mt-2">{inspectedComplaint.title}</h3>
              <p className="text-xs text-slate-500 font-medium">
                {inspectedComplaint.location.address}, {inspectedComplaint.location.village}, {inspectedComplaint.location.district} ({inspectedComplaint.location.state})
              </p>
            </div>
            <button
              onClick={() => setInspectedComplaint(null)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center text-sm"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-500 block mb-0.5 font-medium">Status</span>
              <strong className="text-emerald-700 font-bold capitalize text-sm">{inspectedComplaint.status.replace('_', ' ')}</strong>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-500 block mb-0.5 font-medium">AI Priority</span>
              <strong className="text-rose-600 font-bold uppercase text-sm">{inspectedComplaint.severity}</strong>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-500 block mb-0.5 font-medium">Assigned Worker</span>
              <strong className="text-slate-800 font-bold text-sm">{inspectedComplaint.assignedWorker?.name || 'Pending Worker'}</strong>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <Link
              href="/ruralfix"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <span>Open Public Tracker</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
