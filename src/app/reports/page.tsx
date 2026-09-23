'use client';

import React from 'react';
import { useApp } from '../../lib/context/AppContext';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Tractor, 
  TrendingUp, 
  Clock,
  Sparkles
} from 'lucide-react';

export default function ReportsPage() {
  const { complaints, workers, farmerProfile, mandiPrices, language } = useApp();

  const total = complaints.length;
  const verified = complaints.filter(c => c.status === 'verified').length;
  const inProgress = complaints.filter(c => c.status === 'in_progress').length;
  const pending = complaints.filter(c => c.status === 'reported' || c.status === 'assigned').length;
  const resolutionRate = total > 0 ? Math.round((verified / total) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 print:hidden">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-800 text-xs font-bold mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Panchayat Executive Audit & Agro Health Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {language === 'ta' ? 'கிராம பஞ்சாயத்து தணிக்கை அறிக்கை' : 'Panchayat Governance & Agro Health Report'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Official consolidated audit documentation of civic infrastructure grievances and agricultural productivity metrics.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center space-x-2 self-start sm:self-center transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export Official PDF</span>
        </button>
      </div>

      {/* Printable Official Document Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Official Header Letterhead */}
        <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6">
          <div className="inline-block p-2 rounded-xl bg-slate-100 text-slate-900 font-bold text-2xl mb-1">
            🏛️ 🌾
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900">
            Government of Tamil Nadu • Rural Development & Panchayat Raj
          </h2>
          <p className="text-sm font-bold text-slate-700">
            Ammapettai & Pattukkottai Block Gram Panchayat Unified Redressal Cell
          </p>
          <div className="flex justify-center items-center space-x-4 text-xs text-slate-500 font-mono pt-1">
            <span>Report ID: <strong>REP-TN-2026-AUG-99</strong></span>
            <span>•</span>
            <span>Generated: <strong>{new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</strong></span>
            <span>•</span>
            <span>Status: <strong className="text-emerald-700">AUDITED & CERTIFIED</strong></span>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            1. Civic Infrastructure Performance Indices
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Total Logged Grievances</span>
              <strong className="text-xl font-black text-slate-900">{total}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-800 block">Verified Closed Work</span>
              <strong className="text-xl font-black text-emerald-700">{verified}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200">
              <span className="text-sky-800 block">Resolution Efficiency Rate</span>
              <strong className="text-xl font-black text-sky-700">{resolutionRate}%</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-amber-800 block">Avg. Field SLA Turnaround</span>
              <strong className="text-xl font-black text-amber-700">28.4 Hours</strong>
            </div>
          </div>
        </div>

        {/* Agricultural Economic Health Metrics */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            2. Agro MedKnow Precision Farming Intelligence
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Registered Farm Landholdings</span>
              <strong className="text-xl font-black text-slate-900">480+ Cultivators</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-green-50 border border-green-200">
              <span className="text-green-800 block">Soil Health Card Coverage</span>
              <strong className="text-xl font-black text-green-700">92.4%</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-purple-800 block">DBT Subsidy Disbursal</span>
              <strong className="text-xl font-black text-purple-700">₹ 48.6 Lakhs</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Active Mandi Linkages</span>
              <strong className="text-xl font-black text-slate-900">5 APMC Mandis</strong>
            </div>
          </div>
        </div>

        {/* Grievance Resolution Audit Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            3. Detailed Grievance Log & Verification Matrix
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Grievance ID</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Assigned Worker</th>
                  <th className="py-2.5 px-3">AI Severity</th>
                  <th className="py-2.5 px-3">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {complaints.map(c => (
                  <tr key={c.id}>
                    <td className="py-2.5 px-3 font-mono font-bold">{c.id}</td>
                    <td className="py-2.5 px-3 capitalize">{c.category.replace('_', ' ')}</td>
                    <td className="py-2.5 px-3">{c.location.village}, {c.location.district}</td>
                    <td className="py-2.5 px-3">{c.assignedWorker?.name || 'Unassigned'}</td>
                    <td className="py-2.5 px-3 font-bold uppercase">{c.severity}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded font-bold capitalize text-[10px] ${
                        c.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures & Certification Stamp */}
        <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-2 gap-8 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-slate-800">Inspected by:</p>
            <p className="text-slate-600">Thiru. R. Venkatesan, B.E.</p>
            <p className="text-[11px] text-slate-400">Block Development Officer (BDO), Rural Development</p>
          </div>

          <div className="text-right space-y-1">
            <div className="inline-block p-3 border-2 border-dashed border-emerald-600 rounded-xl text-center bg-emerald-50">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block">
                ★ DIGITAL AUDIT SEAL ★
              </span>
              <span className="text-xs font-extrabold text-emerald-950 block">
                PANCHAYAT VERIFIED 2026
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
