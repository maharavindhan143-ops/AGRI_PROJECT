'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../../lib/context/AppContext';
import { Complaint, ComplaintStatus } from '../../../types';
import { 
  HardHat, 
  MapPin, 
  Phone, 
  Camera, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Sparkles, 
  Navigation, 
  Send,
  AlertCircle
} from 'lucide-react';

const REPAIR_PROOF_PRESETS = [
  'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop&q=80'
];

export default function WorkerPage() {
  const { 
    complaints, 
    workers, 
    updateComplaintByWorker, 
    language 
  } = useApp();

  const [activeWorkerId, setActiveWorkerId] = useState<string>(workers[0]?.id || 'WRK-01');
  const currentWorker = workers.find(w => w.id === activeWorkerId) || workers[0];

  const [selectedTask, setSelectedTask] = useState<Complaint | null>(null);
  const [repairNotes, setRepairNotes] = useState('');
  const [materialInput, setMaterialInput] = useState('');
  const [materialsList, setMaterialsList] = useState<string[]>(['LED Driver 40W', 'Brass Joint']);
  const [selectedAfterPhoto, setSelectedAfterPhoto] = useState<string>(REPAIR_PROOF_PRESETS[0]);

  // Tasks assigned to current worker
  const myTasks = complaints.filter(c => 
    c.assignedWorker?.id === activeWorkerId || 
    (c.status !== 'verified' && !c.assignedWorker)
  );

  const handleStartWork = (complaint: Complaint) => {
    updateComplaintByWorker(complaint.id, 'in_progress', 'Technician arrived on site and commenced diagnostics.');
  };

  const handleOpenSubmitModal = (complaint: Complaint) => {
    setSelectedTask(complaint);
    setRepairNotes(complaint.repairNotes || 'Completed replacement of worn components and restored normal operation.');
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialInput.trim()) return;
    setMaterialsList([...materialsList, materialInput.trim()]);
    setMaterialInput('');
  };

  const handleSubmitRepaired = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    updateComplaintByWorker(
      selectedTask.id,
      'repaired',
      repairNotes,
      selectedAfterPhoto,
      materialsList
    );

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Worker Header & Profile Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold mb-1">
            <HardHat className="w-3.5 h-3.5" />
            <span>Field Maintenance Crew App</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {language === 'ta' ? 'களப்பணியாளர் பணி பலகை' : 'Worker Task & Repair Dispatch Board'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View assigned work orders, navigate to site, and upload Before/After photo proof.
          </p>
        </div>

        {/* Worker Switcher */}
        <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm self-start sm:self-center">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Active Crew:</span>
          <select
            value={activeWorkerId}
            onChange={(e) => setActiveWorkerId(e.target.value)}
            className="text-xs font-bold text-slate-800 bg-slate-50 p-1.5 rounded-lg border border-slate-200 focus:outline-none"
          >
            {workers.map(w => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.specialization.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Worker Quick Status Summary */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-white border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <img
            src={currentWorker.avatar}
            alt={currentWorker.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow-sm"
          />
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">{currentWorker.name}</h3>
            <p className="text-xs text-amber-800 font-semibold">{currentWorker.specialization}</p>
            <p className="text-[11px] text-slate-500">Phone: {currentWorker.phone}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="text-center">
            <span className="text-slate-500 block text-[10px]">Active Orders</span>
            <strong className="text-base font-black text-amber-700">{myTasks.length}</strong>
          </div>
          <div className="text-center">
            <span className="text-slate-500 block text-[10px]">Completed</span>
            <strong className="text-base font-black text-emerald-700">{currentWorker.completedTasks}</strong>
          </div>
          <div className="text-center">
            <span className="text-slate-500 block text-[10px]">Rating</span>
            <strong className="text-base font-black text-amber-500">★ {currentWorker.rating}</strong>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center justify-between">
          <span>Assigned Work Orders ({myTasks.length})</span>
          <span className="text-xs text-slate-400 font-normal">Step: Assigned → In Progress → Repaired</span>
        </h2>

        {myTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            🎉 All assigned work orders completed! Check back later for new dispatches.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTasks.map(task => {
              const isRepaired = task.status === 'repaired';
              const isInProgress = task.status === 'in_progress';
              const isAssigned = task.status === 'assigned' || task.status === 'reported';

              return (
                <div key={task.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                          {task.id}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 mt-1">{task.title}</h3>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                        task.severity === 'critical' ? 'bg-rose-100 text-rose-700 animate-pulse' :
                        task.severity === 'high' ? 'bg-amber-100 text-amber-700' :
                        'bg-sky-100 text-sky-700'
                      }`}>
                        {task.severity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>

                    {/* Problem Photo Thumbnail */}
                    <div className="relative h-36 rounded-xl overflow-hidden border border-slate-200">
                      <img src={task.photoBefore} alt="Issue" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                        Reported Photo
                      </div>
                    </div>

                    {/* Location & Citizen details */}
                    <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-200/80">
                      <div className="flex items-center text-slate-700 gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{task.location.address}, {task.location.village}</span>
                      </div>
                      <div className="flex items-center text-slate-600 gap-1.5 text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>Citizen: {task.reportedBy.name} ({task.reportedBy.phone})</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons for Worker */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    {isAssigned && (
                      <button
                        onClick={() => handleStartWork(task)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-md shadow-amber-500/20 flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Start Work (Mark In Progress)</span>
                      </button>
                    )}

                    {isInProgress && (
                      <button
                        onClick={() => handleOpenSubmitModal(task)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Submit Repaired Photo Proof →</span>
                      </button>
                    )}

                    {isRepaired && (
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-center text-xs font-bold">
                        ✓ Repair Submitted. Awaiting Authority Verification.
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Submit Repair Proof */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 space-y-4 border border-slate-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 4: Repaired Proof</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedTask.title}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedTask.id}</p>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRepaired} className="space-y-4 text-xs">
              
              {/* Photo Proof Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select / Upload Repaired Condition Photo (After)
                </label>
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-sm flex-shrink-0 relative">
                    <img src={selectedAfterPhoto} alt="Repaired Condition" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-emerald-700 text-white text-[9px] text-center py-0.5">Repaired</span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <p className="text-[11px] text-slate-500">Pick after-repair proof snapshot:</p>
                    <div className="flex space-x-2">
                      {REPAIR_PROOF_PRESETS.map((p, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setSelectedAfterPhoto(p)}
                          className={`w-11 h-11 rounded-lg overflow-hidden border-2 ${
                            selectedAfterPhoto === p ? 'border-emerald-600 scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={p} alt="Preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Repair Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Technical Repair Notes</label>
                <textarea
                  rows={3}
                  required
                  value={repairNotes}
                  onChange={(e) => setRepairNotes(e.target.value)}
                  placeholder="e.g., Replaced 40W LED circuit, cleared pipe obstruction, and re-tested water flow..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              {/* Spares / Materials Used */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Materials / Spare Parts Logged</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {materialsList.map((m, i) => (
                    <span key={i} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-300 text-[11px] flex items-center gap-1">
                      {m}
                      <button
                        type="button"
                        onClick={() => setMaterialsList(materialsList.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add item (e.g. 10m cable, valve)"
                    value={materialInput}
                    onChange={(e) => setMaterialInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-xl text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for Verification</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
