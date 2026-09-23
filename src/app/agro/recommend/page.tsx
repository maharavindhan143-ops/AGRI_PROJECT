'use client';

import React, { useState } from 'react';
import { useApp } from '../../../lib/context/AppContext';
import { computeCropRecommendations } from '../../../lib/aiEngine';
import { CropRecommendation } from '../../../types';
import { 
  Sparkles, 
  Leaf, 
  DollarSign, 
  Calendar, 
  Droplet, 
  TrendingUp, 
  RefreshCw, 
  CheckCircle2,
  Sliders,
  Award
} from 'lucide-react';

export default function CropRecommendationPage() {
  const { farmerProfile, language, t } = useApp();

  const [nitrogen, setNitrogen] = useState<number>(farmerProfile.nitrogen || 140);
  const [phosphorus, setPhosphorus] = useState<number>(farmerProfile.phosphorus || 55);
  const [potassium, setPotassium] = useState<number>(farmerProfile.potassium || 165);
  const [ph, setPh] = useState<number>(farmerProfile.ph || 6.8);
  const [soilType, setSoilType] = useState<string>(farmerProfile.soilType || 'alluvial');
  const [landAcres, setLandAcres] = useState<number>(farmerProfile.landSizeAcres || 4.5);

  const [recommendations, setRecommendations] = useState<CropRecommendation[]>(() => 
    computeCropRecommendations({
      nitrogen: farmerProfile.nitrogen || 140,
      phosphorus: farmerProfile.phosphorus || 55,
      potassium: farmerProfile.potassium || 165,
      ph: farmerProfile.ph || 6.8,
      soilType: farmerProfile.soilType || 'alluvial',
      landSizeAcres: farmerProfile.landSizeAcres || 4.5,
    })
  );

  const handleCompute = (e: React.FormEvent) => {
    e.preventDefault();
    const result = computeCropRecommendations({
      nitrogen,
      phosphorus,
      potassium,
      ph,
      soilType,
      landSizeAcres: landAcres,
    });
    setRecommendations(result);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-md bg-green-100 text-green-800 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Precision Agronomy & Soil Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {language === 'ta' ? 'AI மண் பரிசோதனை & பயிர் பரிந்துரை' : 'AI Crop Recommendation Engine'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Scientifically match your soil chemistry (N-P-K & pH) with high-yield, drought-resilient crops.
          </p>
        </div>

        <div className="text-right self-start sm:self-center">
          <span className="text-xs text-slate-500">Active Soil Baseline:</span>
          <p className="text-xs font-bold text-emerald-800 capitalize">{soilType} Soil • pH {ph}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Soil Chemistry Input Controls (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Soil Nutrients & Parameters</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Real-time Model</span>
          </div>

          <form onSubmit={handleCompute} className="space-y-4 text-xs">
            
            {/* Soil Type */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Soil Texture Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 bg-white capitalize text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="alluvial">Alluvial Soil (வண்டல் மண்)</option>
                <option value="red">Red Loam Soil (செம்மண்)</option>
                <option value="black">Black Regur Soil (கரிசல் மண்)</option>
                <option value="clay">Clayey Soil (களிமண்)</option>
                <option value="laterite">Laterite Soil (சரளை மண்)</option>
              </select>
            </div>

            {/* Land Size */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Land Area:</span>
                <span className="text-emerald-700 font-mono">{landAcres} Acres</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={landAcres}
                onChange={(e) => setLandAcres(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Nitrogen N */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Nitrogen (N) kg/ha:</span>
                <span className="text-emerald-700 font-mono">{nitrogen}</span>
              </div>
              <input
                type="range"
                min="40"
                max="240"
                value={nitrogen}
                onChange={(e) => setNitrogen(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Low (40)</span>
                <span>Optimal (120-140)</span>
                <span>High (240)</span>
              </div>
            </div>

            {/* Phosphorus P */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Phosphorus (P) kg/ha:</span>
                <span className="text-emerald-700 font-mono">{phosphorus}</span>
              </div>
              <input
                type="range"
                min="15"
                max="120"
                value={phosphorus}
                onChange={(e) => setPhosphorus(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Low (15)</span>
                <span>Medium (50)</span>
                <span>High (120)</span>
              </div>
            </div>

            {/* Potassium K */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Potassium (K) kg/ha:</span>
                <span className="text-emerald-700 font-mono">{potassium}</span>
              </div>
              <input
                type="range"
                min="40"
                max="250"
                value={potassium}
                onChange={(e) => setPotassium(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Low (40)</span>
                <span>Optimal (150)</span>
                <span>High (250)</span>
              </div>
            </div>

            {/* Soil pH */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Soil pH Value:</span>
                <span className={`font-mono font-bold ${ph >= 6.0 && ph <= 7.5 ? 'text-emerald-700' : 'text-amber-600'}`}>
                  {ph} ({ph < 6.5 ? 'Slightly Acidic' : ph > 7.5 ? 'Alkaline' : 'Neutral'})
                </span>
              </div>
              <input
                type="range"
                min="5.0"
                max="9.0"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{language === 'ta' ? 'பரிந்துரைகளை கணக்கிடுக' : 'Recompute Recommendations'}</span>
            </button>

          </form>
        </div>

        {/* Right Column: Top 3 Recommended Crops Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Top Ranked Crops for Your Land ({recommendations.length})
            </h2>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Calculated for {landAcres} Acres
            </span>
          </div>

          <div className="space-y-4">
            {recommendations.map((crop, idx) => (
              <div
                key={crop.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 transition-all ${
                  idx === 0 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{crop.icon}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        {idx === 0 && (
                          <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-600" /> Rank #1 Best Match
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-medium">Rank #{idx + 1}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                        {language === 'ta' ? crop.cropNameTamil : crop.cropName}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black text-emerald-600">
                      {crop.suitabilityScore}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">Soil Match</span>
                  </div>
                </div>

                {/* Key Economic & Agronomic Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-medium">Expected Total Yield</span>
                    <strong className="text-slate-800 font-bold block mt-0.5">
                      {language === 'ta' ? crop.expectedYieldTamil : crop.expectedYield}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-medium">Est. Total Investment</span>
                    <strong className="text-slate-800 font-bold block mt-0.5">
                      {crop.investmentPerAcre}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 block font-bold">Projected Net Profit</span>
                    <strong className="text-emerald-700 font-black block mt-0.5 text-sm">
                      {crop.estimatedProfit}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-medium">Crop Cycle & Water</span>
                    <strong className="text-slate-800 font-bold block mt-0.5">
                      {crop.durationDays} • {language === 'ta' ? crop.waterRequirementTamil : crop.waterRequirement} Water
                    </strong>
                  </div>
                </div>

                {/* Scientific Justification Reasons */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <span className="font-bold text-slate-700 text-[11px] block">
                    {language === 'ta' ? 'பரிந்துரைக்கான காரணங்கள்:' : 'AI Agronomic Rationale:'}
                  </span>
                  <ul className="space-y-1 text-slate-600">
                    {(language === 'ta' ? crop.reasonsTamil : crop.reasons).map((reason, rIdx) => (
                      <li key={rIdx} className="flex items-start space-x-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
