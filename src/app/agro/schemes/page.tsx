'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../../lib/context/AppContext';
import { GovtScheme } from '../../../types';
import { 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  ExternalLink, 
  FileText, 
  Search, 
  ShieldCheck, 
  Sparkles,
  Zap,
  DollarSign,
  ChevronRight
} from 'lucide-react';

export default function SchemesPage() {
  const { govSchemes, farmerProfile, language, t } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState<GovtScheme | null>(null);
  const [appliedState, setAppliedState] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState('XXXX-XXXX-8921');
  const [pattaNumber, setPattaNumber] = useState('TN-THJ-2026-4491');

  // Interactive Eligibility Checker States
  const [hasLand, setHasLand] = useState(true);
  const [landAcres, setLandAcres] = useState(farmerProfile.landSizeAcres || 4.5);
  const [hasAadhaarBankLink, setHasAadhaarBankLink] = useState(true);
  const [hasBorewell, setHasBorewell] = useState(true);

  const filtered = govSchemes.filter(s => 
    selectedCategory === 'all' || s.category === selectedCategory
  );

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedState(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 text-xs font-bold mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Government Welfare & Concessional Financial Schemes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {language === 'ta' ? 'அரசு மானியங்கள், பயிர்க்கடன் & நலத்திட்டங்கள்' : 'Agricultural Subsidies, Schemes & Agri-Loans'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Direct farmer benefit transfers, solar pump capital subsidies, PMFBY crop insurance, and KCC loans.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-purple-50 border border-purple-200 px-3.5 py-2 rounded-xl text-xs font-bold text-purple-900 self-start sm:self-center">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Direct Benefit Transfer (DBT) Enabled</span>
        </div>
      </div>

      {/* Interactive Eligibility Quick Match Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-300" />
          <h2 className="text-base font-bold">
            {language === 'ta' ? 'உடனடி தகுதி சரிபார்ப்பு' : 'Instant Eligibility & Subsidy Matcher'}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <label className="p-3 rounded-xl bg-white/10 border border-white/20 flex items-center space-x-2 cursor-pointer hover:bg-white/15">
            <input
              type="checkbox"
              checked={hasLand}
              onChange={(e) => setHasLand(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span>Landholding Farmer (பட்டா உள்ளவர்)</span>
          </label>

          <label className="p-3 rounded-xl bg-white/10 border border-white/20 flex items-center space-x-2 cursor-pointer hover:bg-white/15">
            <input
              type="checkbox"
              checked={hasAadhaarBankLink}
              onChange={(e) => setHasAadhaarBankLink(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span>Aadhaar e-KYC Linked (ஆதார் இணைப்பு)</span>
          </label>

          <label className="p-3 rounded-xl bg-white/10 border border-white/20 flex items-center space-x-2 cursor-pointer hover:bg-white/15">
            <input
              type="checkbox"
              checked={hasBorewell}
              onChange={(e) => setHasBorewell(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span>Well / Borewell (கிணறு / போர்வெல்)</span>
          </label>

          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-center flex flex-col justify-center">
            <span className="text-[10px] text-emerald-200 uppercase font-bold">Eligible Schemes</span>
            <strong className="text-lg font-black text-emerald-300">
              {hasLand && hasAadhaarBankLink ? '4 of 4 Active' : '2 of 4 Active'}
            </strong>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold text-slate-900">
          Available Welfare Schemes ({filtered.length})
        </h2>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              selectedCategory === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory('subsidy')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              selectedCategory === 'subsidy' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ Capital Subsidy
          </button>
          <button
            onClick={() => setSelectedCategory('income_support')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              selectedCategory === 'income_support' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💵 Income Support
          </button>
          <button
            onClick={() => setSelectedCategory('insurance')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              selectedCategory === 'insurance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛡️ Crop Insurance
          </button>
          <button
            onClick={() => setSelectedCategory('loan')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              selectedCategory === 'loan' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏦 KCC Loan
          </button>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(scheme => (
          <div
            key={scheme.id}
            className={`bg-white rounded-2xl border p-6 shadow-sm space-y-4 flex flex-col justify-between transition-all ${
              scheme.popularBadge ? 'border-purple-300 ring-1 ring-purple-400/20' : 'border-slate-200'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  {scheme.popularBadge && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded mb-1 inline-block">
                      ★ High Demand DBT
                    </span>
                  )}
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                    {language === 'ta' ? scheme.titleTamil : scheme.title}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                  {scheme.id}
                </span>
              </div>

              {/* Benefit Highlight Card */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">Grant / Benefit Value</span>
                <strong className="text-base sm:text-lg font-black text-purple-950 block mt-0.5">
                  {language === 'ta' ? scheme.benefitAmountTamil : scheme.benefitAmount}
                </strong>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ta' ? scheme.descriptionTamil : scheme.description}
              </p>

              {/* Eligibility checklist */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Eligibility Criteria
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {(language === 'ta' ? scheme.eligibilityTamil : scheme.eligibility).map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Deadline: <strong className="text-slate-700">{scheme.deadline}</strong>
              </span>
              <button
                onClick={() => {
                  setSelectedSchemeForApply(scheme);
                  setAppliedState(false);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-purple-600/20 flex items-center space-x-1.5 transition-all"
              >
                <span>Apply / Generate Form</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal: Direct Apply & Checklist Generator */}
      {selectedSchemeForApply && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 space-y-4 border border-slate-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Fast-Track Application</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedSchemeForApply.title}</h3>
                <p className="text-xs text-purple-900 font-semibold">{selectedSchemeForApply.benefitAmount}</p>
              </div>
              <button
                onClick={() => setSelectedSchemeForApply(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {appliedState ? (
              <div className="p-6 text-center space-y-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h4 className="text-sm font-extrabold text-purple-950">
                  Pre-Filled Application Generated!
                </h4>
                <p className="text-xs text-purple-800">
                  Your e-KYC documents and Patta record ({pattaNumber}) have been bundled into DBT Grant Ticket <strong className="font-mono">#DBT-2026-8812</strong>.
                </p>
                <div className="pt-2 flex justify-center space-x-2">
                  <a
                    href={selectedSchemeForApply.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-purple-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm inline-flex items-center gap-1.5"
                  >
                    <span>Proceed to Official Govt Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setSelectedSchemeForApply(null)}
                    className="bg-white border border-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Farmer Full Name</label>
                  <input
                    type="text"
                    defaultValue={farmerProfile.name}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Aadhaar Linked No.</label>
                    <input
                      type="text"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Patta / Chitta Reference</label>
                    <input
                      type="text"
                      value={pattaNumber}
                      onChange={(e) => setPattaNumber(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-700 block">Required Verification Enclosures:</span>
                  <div className="space-y-1 text-slate-600">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="accent-purple-600" />
                      <span>Bank Passbook first page with IFSC code</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="accent-purple-600" />
                      <span>Soil Health Card or Adangal extract from VAO</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSchemeForApply(null)}
                    className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md shadow-purple-600/20"
                  >
                    Generate & Submit Application
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
