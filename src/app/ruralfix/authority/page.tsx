'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../../lib/context/AppContext';
import { Complaint, WorkerProfile } from '../../../types';
import { BeforeAfterSlider } from '../../../components/BeforeAfterSlider';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HardHat, 
  Clock, 
  Search, 
  Star, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function AuthorityPage() {
  const { 
    complaints, 
    workers, 
    assignWorkerToComplaint, 
    verifyComplaintByAuthority, 
    language 
  } = useApp();

  const [selectedComplaintForVerification, setSelectedComplaintForVerification] = useState<Complaint | null>(null);
  const [selectedComplaintForAssign, setSelectedComplaintForAssign] = useState<Complaint | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workers[0]?.id || '');
  const [officerRating, setOfficerRating] = useState<number>(5);
  const [officerRemarks, setOfficerRemarks] = useState<string>('Repairs inspected on-site. Work meets quality standard.');

  const pendingTriage = complaints.filter(c => c.status === 'reported');
  const inProgressList = complaints.filter(c => c.status === 'assigned' || c.status === 'in_progress');
  const readyToVerify = complaints.filter(c => c.status === 'repaired');
  const verifiedList = complaints.filter(c => c.status === 'verified');

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaintForAssign || !selectedWorkerId) return;

    assignWorkerToComplaint(selectedComplaintForAssign.id, selectedWorkerId);
    setSelectedComplaintForAssign(null);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaintForVerification) return;

    verifyComplaintByAuthority(
      selectedComplaintForVerification.id,
      officerRating,
      officerRemarks
    );

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSelectedComplaintForVerification(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Panchayat Officer Authority Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {language === 'ta' ? 'பஞ்சாயத்து நிர்வாக மையம் & சரிபார்ப்பு' : 'Authority Triage & Verification Command'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            AI-assisted grievance prioritization, worker dispatch, and before/after repair certification.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-900">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Audit Protocol: 100% Photo Proof Enforced</span>
        </div>
      </div>

      {/* Authority KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Pending Triage</span>
          <h3 className="text-2xl font-black text-rose-600 mt-1">{pendingTriage.length}</h3>
          <p className="text-[10px] text-rose-600">Requires Dispatch</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">In-Field Repair</span>
          <h3 className="text-2xl font-black text-amber-600 mt-1">{inProgressList.length}</h3>
          <p className="text-[10px] text-amber-600">Workers Dispatched</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Ready for Verification</span>
          <h3 className="text-2xl font-black text-indigo-600 mt-1">{readyToVerify.length}</h3>
          <p className="text-[10px] text-indigo-600">Awaiting Officer Stamp</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Verified & Certified</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{verifiedList.length}</h3>
          <p className="text-[10px] text-emerald-600">Archived with Proof</p>
        </div>
      </div>

      {/* Section 1: Verification Queue (Action Needed) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Work Completed Queue – Ready for Official Verification ({readyToVerify.length})
            </h2>
          </div>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
            Compare Before / After
          </span>
        </div>

        {readyToVerify.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            ✓ No pending repair submissions. All completed work has been audited and verified.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readyToVerify.map(comp => (
              <div key={comp.id} className="p-4 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/30 to-white space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-700">{comp.id}</span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5">{comp.title}</h3>
                    <p className="text-xs text-slate-500">{comp.location.village}, {comp.location.district}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    Repaired
                  </span>
                </div>

                {comp.photoAfter && (
                  <BeforeAfterSlider
                    beforeImage={comp.photoBefore}
                    afterImage={comp.photoAfter}
                    beforeLabel="Before"
                    afterLabel="Repaired"
                    height="h-44"
                  />
                )}

                <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                  <p><strong>Worker Notes:</strong> {comp.repairNotes || 'Completed standard repair protocol.'}</p>
                </div>

                <button
                  onClick={() => setSelectedComplaintForVerification(comp)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Inspect & Approve Verification Stamp</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: AI Triage & Worker Assignment Pipeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Grievance Triage & Field Assignment Matrix
            </h2>
          </div>
          <span className="text-xs text-slate-400">Sorted by AI Severity</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Complaint ID</th>
                <th className="py-3 px-3">Issue Title</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">AI Severity</th>
                <th className="py-3 px-3">Current Worker</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{c.id}</td>
                  <td className="py-3 px-3 font-medium text-slate-900 max-w-xs truncate">{c.title}</td>
                  <td className="py-3 px-3 text-slate-600">{c.location.village}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                      c.severity === 'high' ? 'bg-amber-100 text-amber-700' :
                      'bg-sky-100 text-sky-700'
                    }`}>
                      {c.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {c.assignedWorker ? (
                      <span className="font-semibold text-emerald-800">
                        👨‍🔧 {c.assignedWorker.name}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      c.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                      c.status === 'repaired' ? 'bg-indigo-100 text-indigo-800' :
                      c.status === 'in_progress' ? 'bg-sky-100 text-sky-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {c.status === 'reported' ? (
                      <button
                        onClick={() => setSelectedComplaintForAssign(c)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm"
                      >
                        Assign Worker →
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedComplaintForAssign(c)}
                        className="text-indigo-600 hover:text-indigo-800 font-bold px-2 py-1"
                      >
                        Re-assign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Assign Worker */}
      {selectedComplaintForAssign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Dispatch Crew</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedComplaintForAssign.title}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedComplaintForAssign.id}</p>
              </div>
              <button
                onClick={() => setSelectedComplaintForAssign(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Select Certified Maintenance Worker
                </label>
                <div className="space-y-2">
                  {workers.map(w => (
                    <label
                      key={w.id}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedWorkerId === w.id
                          ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 font-bold text-emerald-950'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="worker"
                          value={w.id}
                          checked={selectedWorkerId === w.id}
                          onChange={(e) => setSelectedWorkerId(e.target.value)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <p className="font-bold">{w.name}</p>
                          <p className="text-[11px] text-slate-500 font-normal">{w.specialization}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {w.activeTasks} active tasks
                        </span>
                        <p className="text-[10px] text-amber-500 font-bold mt-0.5">★ {w.rating}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaintForAssign(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md shadow-emerald-600/20"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Official Audit Verification */}
      {selectedComplaintForVerification && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 border border-slate-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Official Certification</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedComplaintForVerification.title}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedComplaintForVerification.id}</p>
              </div>
              <button
                onClick={() => setSelectedComplaintForVerification(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {selectedComplaintForVerification.photoAfter && (
              <div className="space-y-1">
                <BeforeAfterSlider
                  beforeImage={selectedComplaintForVerification.photoBefore}
                  afterImage={selectedComplaintForVerification.photoAfter}
                  beforeLabel="Reported"
                  afterLabel="Repaired"
                  height="h-56"
                />
              </div>
            )}

            <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Panchayat Officer Audit Remarks</label>
                <textarea
                  rows={2}
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quality Satisfaction Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setOfficerRating(star)}
                      className={`text-lg transition-transform ${star <= officerRating ? 'text-amber-500 scale-110' : 'text-slate-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaintForVerification(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Reject / Request Re-work
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-xl text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Certify & Officially Close Grievance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
