'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../../lib/context/AppContext';
import { MandiPrice, WholesalerBuyer } from '../../../types';
import { WHOLESALE_BUYERS } from '../../../lib/mockData';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Phone, 
  ShieldCheck, 
  Truck, 
  Search, 
  Sparkles,
  MapPin,
  X,
  ChevronRight,
  Info,
  CheckCircle2,
  Filter
} from 'lucide-react';

export default function MarketPage() {
  const { mandiPrices, language } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'nearby' | 'best_price'>('all');
  const [selectedBuyer, setSelectedBuyer] = useState<WholesalerBuyer | null>(null);
  const [detailCrop, setDetailCrop] = useState<MandiPrice | null>(null);
  const [connectedState, setConnectedState] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState('15 Quintals');

  // Filter crops by search query and category tab
  const filteredMandi = mandiPrices.filter(m => {
    const matchesSearch = 
      m.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.cropTamil.includes(searchQuery) ||
      m.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.district.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'nearby') {
      // Show top regional/nearby markets (Thanjavur, Madurai, Erode)
      return ['Thanjavur', 'Madurai', 'Erode'].includes(m.district);
    }

    if (activeFilter === 'best_price') {
      // Show crops with upward trend or high price
      return m.trend === 'up';
    }

    return true;
  });

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConnectedState(true);
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const getCropEmoji = (cropName: string) => {
    const name = cropName.toLowerCase();
    if (name.includes('paddy') || name.includes('rice') || name.includes('நெல்')) return '🌾';
    if (name.includes('turmeric') || name.includes('மஞ்சள்')) return '🟡';
    if (name.includes('tomato') || name.includes('தக்காளி')) return '🍅';
    if (name.includes('cotton') || name.includes('பருத்தி')) return '☁️';
    if (name.includes('sugarcane') || name.includes('கரும்பு')) return '🎋';
    return '🌱';
  };

  const handleFindBuyer = (crop: MandiPrice) => {
    // Find matching buyer or default to first buyer
    const cropSimpleName = crop.crop.split('(')[0].trim();
    const matchingBuyer = WHOLESALE_BUYERS.find(b => 
      b.cropsWanted.some(c => c.toLowerCase().includes(cropSimpleName.toLowerCase()))
    ) || WHOLESALE_BUYERS[0];

    setSelectedBuyer(matchingBuyer);
    setConnectedState(false);

    // Scroll smoothly to wholesale buyers section
    const buyerSection = document.getElementById('buyers-section');
    if (buyerSection) {
      buyerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Top Header Section */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 -top-10 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-600/60 backdrop-blur-md border border-emerald-400/30 text-emerald-100 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'ta' ? 'நேரலை மண்டி நிலவரம்' : 'Live Mandi Market Rates'}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {language === 'ta' ? 'மண்டி சந்தை விலைகள்' : 'Mandi Market Prices'}
            </h1>
            
            <p className="text-sm sm:text-base text-emerald-100/90 font-medium">
              {language === 'ta' 
                ? 'இன்றைய பயிர் விலைகளை சரிபார்த்து, உங்கள் அருகில் உள்ள வாங்குபவர்களைக் கண்டறியவும்.' 
                : 'Check today’s crop prices and find buyers near you.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl self-start md:self-center">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs">
              <span className="block font-bold text-white">
                {language === 'ta' ? 'அரசு மண்டி நேரடி தகவல்' : 'APMC Regulated Feeds'}
              </span>
              <span className="text-emerald-200 text-[11px]">
                {language === 'ta' ? 'தினசரி புதுப்பிக்கப்படுகிறது' : 'Updated Today'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        
        {/* Simple Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {language === 'ta' ? '🌾 அனைத்துப் பயிர்கள்' : '🌾 All Crops'}
          </button>
          
          <button
            onClick={() => setActiveFilter('nearby')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'nearby'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {language === 'ta' ? '📍 அருகில்' : '📍 Nearby'}
          </button>
          
          <button
            onClick={() => setActiveFilter('best_price')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'best_price'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {language === 'ta' ? '🔥 நல்ல விலை' : '🔥 Best Price'}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={language === 'ta' ? 'பயிர் அல்லது மண்டி தேட...' : 'Search crop or market...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-all font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mandi Crop Cards Grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">
            {language === 'ta' ? 'இன்றைய பயிர் விலைகள்' : 'Today\'s Crop Prices'} ({filteredMandi.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {language === 'ta' ? '1 குவிண்டால் = 100 கிலோ' : '1 Quintal = 100 Kg'}
          </span>
        </div>

        {filteredMandi.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <div className="text-3xl">🔍</div>
            <p className="text-sm font-bold text-slate-700">
              {language === 'ta' ? 'பயிர்கள் எதுவும் கிடைக்கவில்லை' : 'No crops found matching search.'}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
              className="text-xs text-emerald-600 font-bold underline"
            >
              {language === 'ta' ? 'அனைத்து பயிர்களையும் காட்டு' : 'Reset filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMandi.map((m) => {
              const isUp = m.trend === 'up';
              const isDown = m.trend === 'down';
              const cropEmoji = getCropEmoji(m.crop);

              // Simplified crop display name
              const cropDisplayName = language === 'ta' ? m.cropTamil : m.crop.split('(')[0].trim();

              return (
                <div 
                  key={m.id} 
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/40 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group relative overflow-hidden"
                >
                  {/* Card Header: Crop Icon & Name */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                          {cropEmoji}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-lg text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                            {cropDisplayName}
                          </h3>
                          <div className="flex items-center text-xs text-slate-500 font-medium mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
                            <span>{m.market}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Focal Point (Main Focus - Large Font) */}
                    <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-1">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            ₹{m.pricePerQuintal.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold ml-1.5">
                            {language === 'ta' ? '/ குவிண்டால்' : '/ Quintal'}
                          </span>
                        </div>

                        {/* Price Change Indicator */}
                        <div className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center space-x-1 border ${
                          isUp 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                            : isDown 
                            ? 'bg-rose-100 text-rose-800 border-rose-200' 
                            : 'bg-slate-200 text-slate-700 border-slate-300'
                        }`}>
                          {isUp && <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />}
                          {isDown && <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />}
                          {!isUp && !isDown && <Minus className="w-3.5 h-3.5 stroke-[2.5]" />}
                          <span>
                            {m.priceChange24h > 0 ? `+₹${m.priceChange24h}` : `₹${m.priceChange24h}`}
                          </span>
                        </div>
                      </div>

                      {/* Simple Market Status Pill */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-500 text-[11px] font-medium">
                          {language === 'ta' ? 'இன்றைய நிலை:' : 'Market Status:'}
                        </span>
                        <span className={`font-bold text-[11px] px-2 py-0.5 rounded-md ${
                          isUp 
                            ? 'text-emerald-700 bg-emerald-50' 
                            : isDown 
                            ? 'text-rose-700 bg-rose-50' 
                            : 'text-slate-700 bg-slate-100'
                        }`}>
                          {isUp 
                            ? (language === 'ta' ? '🟢 நல்ல விலை' : '🟢 Good price')
                            : isDown 
                            ? (language === 'ta' ? '🔴 விலை குறைந்தது' : '🔴 Price dropped')
                            : (language === 'ta' ? '⚪ நிலையான விலை' : '⚪ Stable price')}
                        </span>
                      </div>
                    </div>

                    {/* Simple Advice Box */}
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start space-x-2">
                      <span className="text-base leading-none">💡</span>
                      <div>
                        <strong className="font-bold text-amber-900 block mb-0.5">
                          {language === 'ta' ? 'ஆலோசனை:' : 'Advice:'}
                        </strong>
                        <p className="text-[11px] font-medium leading-relaxed text-amber-900/90">
                          {language === 'ta' ? m.bestTimeToSellTamil : m.bestTimeToSell}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Find Buyer & View Details */}
                  <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                    <button
                      onClick={() => handleFindBuyer(m)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-1.5 active:scale-[0.98]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'வாங்குபவரை தேடுங்கள்' : 'Find Buyer'}</span>
                    </button>

                    <button
                      onClick={() => setDetailCrop(m)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center space-x-1 border border-slate-200 hover:border-slate-300"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-500" />
                      <span>{language === 'ta' ? 'விவரங்கள்' : 'View Details'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Verified Wholesalers & Direct Farmgate Buyers */}
      <div id="buyers-section" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {language === 'ta' ? 'சரிபார்க்கப்பட்ட வியாபாரிகள் & நேரடி கொள்முதல்' : 'Verified Wholesale Buyers & Direct Farmgate Pickup'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ta' ? 'இடைத்தரகர் கமிஷன் இல்லை • நேரடி வங்கி/UPI பணம்' : 'Zero Middlemen Commission • Direct Spot Payment'}
              </p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold self-start sm:self-center">
            {WHOLESALE_BUYERS.length} {language === 'ta' ? 'வியாபாரிகள் தயார்' : 'Buyers Available'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WHOLESALE_BUYERS.map(buyer => (
            <div 
              key={buyer.id} 
              className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                selectedBuyer?.id === buyer.id 
                  ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20' 
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>{buyer.name}</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{buyer.company}</p>
                  </div>
                  <span className="text-amber-600 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    ★ {buyer.rating}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 bg-white p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
                    <span>{buyer.location}</span>
                  </div>
                  <div className="text-emerald-700 font-bold flex items-start gap-1">
                    <span className="text-emerald-600 font-normal">🎁</span>
                    <span>{buyer.offeredPriceBonus}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {language === 'ta' ? 'தேவைப்படும் பயிர்கள்:' : 'Crops Wanted:'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {buyer.cropsWanted.map((c, i) => (
                      <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedBuyer(buyer);
                  setConnectedState(false);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'நேரடி தொடர்புகொள்ள' : 'Direct Connect & Book Pickup'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: View Details for Advanced Technical Information */}
      {detailCrop && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-5 border border-slate-100 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl">
                  {getCropEmoji(detailCrop.crop)}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {language === 'ta' ? detailCrop.cropTamil : detailCrop.crop}
                  </h3>
                  <p className="text-xs text-slate-500">{detailCrop.market} ({detailCrop.district})</p>
                </div>
              </div>
              <button
                onClick={() => setDetailCrop(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Price & Variety Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {language === 'ta' ? 'ரகம் / தரம்' : 'Variety / Grade'}
                </span>
                <span className="text-xs font-extrabold text-slate-800">{detailCrop.variety}</span>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                  {language === 'ta' ? 'விலை எல்லை' : 'Min - Max Price'}
                </span>
                <span className="text-xs font-extrabold text-emerald-950 font-mono">
                  ₹{detailCrop.minPrice} - ₹{detailCrop.maxPrice}
                </span>
              </div>
            </div>

            {/* 7-Day Trend Bar Chart */}
            <div className="space-y-2 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">
                  {language === 'ta' ? '7 நாட்களின் விலை வரைபடம்' : '7-Day Price History'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {language === 'ta' ? 'கடந்த வார நிலவரம்' : 'Past week trend'}
                </span>
              </div>

              <div className="flex items-end space-x-2 h-24 pt-4">
                {detailCrop.history.map((h, hIdx) => {
                  const min = detailCrop.minPrice * 0.95;
                  const max = detailCrop.maxPrice * 1.05;
                  const heightPct = Math.max(15, Math.min(100, ((h.price - min) / (max - min)) * 100));

                  return (
                    <div key={hIdx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-md transition-all ${
                          hIdx === detailCrop.history.length - 1 
                            ? 'bg-emerald-600' 
                            : 'bg-slate-300 group-hover:bg-slate-400'
                        }`}
                      />
                      <span className="text-[10px] font-bold text-slate-500">{h.day[0]}</span>
                      <div className="absolute -top-7 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                        ₹{h.price}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Full Advisory */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <strong className="font-bold block text-amber-900">
                {language === 'ta' ? 'முழுமையான விற்பனை ஆலோசனை:' : 'Complete Selling Advisory:'}
              </strong>
              <p className="leading-relaxed">
                {language === 'ta' ? detailCrop.bestTimeToSellTamil : detailCrop.bestTimeToSell}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDetailCrop(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                {language === 'ta' ? 'மூடு' : 'Close'}
              </button>
              <button
                onClick={() => {
                  const cropToMatch = detailCrop;
                  setDetailCrop(null);
                  handleFindBuyer(cropToMatch);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20"
              >
                {language === 'ta' ? 'வாங்குபவரை தேடுங்கள்' : 'Find Buyer Now'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Direct Buyer Match Connect */}
      {selectedBuyer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
                  {language === 'ta' ? 'நேரடி வியாபாரி இணைப்பு' : 'Direct Buyer Connect'}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">{selectedBuyer.name}</h3>
                <p className="text-xs text-slate-500">{selectedBuyer.company} • {selectedBuyer.location}</p>
              </div>
              <button
                onClick={() => setSelectedBuyer(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {connectedState ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
                  ✓
                </div>
                <h4 className="text-base font-extrabold text-emerald-950">
                  {language === 'ta' ? 'நேரடி கொள்முதல் கோரிக்கை அனுப்பப்பட்டது!' : 'Farmgate Pickup Request Sent!'}
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  {language === 'ta'
                    ? `${selectedBuyer.name} உங்கள் தொலைபேசி எண்ணை தொடர்புகொண்டு 2 மணி நேரத்திற்குள் லாரி மற்றும் நேரடி பணப் பரிவர்த்தனையை உறுதிசெய்வார்.`
                    : `${selectedBuyer.name} will call you at your registered phone within 2 hours to confirm vehicle dispatch and spot payment.`}
                </p>
                <button
                  onClick={() => setSelectedBuyer(null)}
                  className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-xl text-xs shadow-md shadow-emerald-600/20"
                >
                  {language === 'ta' ? 'சரி' : 'Done'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleConnectSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'உங்கள் பயிர் அளவு (குவிண்டாலில்)' : 'Your Crop Lot Quantity'}
                  </label>
                  <input
                    type="text"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{language === 'ta' ? 'சரிபார்க்கப்பட்ட எண்:' : 'Verified Contact:'}</span>
                    <span className="font-mono font-extrabold text-slate-900">{selectedBuyer.contactPhone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{language === 'ta' ? 'போக்குவரத்து:' : 'Truck Transport:'}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {language === 'ta' ? 'இலவச பண்ணைக்கே லாரி வரும்' : 'Farmgate Pickup Included'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedBuyer(null)}
                    className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-xl text-xs"
                  >
                    {language === 'ta' ? 'ரத்துசெய்' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    {language === 'ta' ? 'நேரடி கோரிக்கை அனுப்பு' : 'Send Direct Connect Request'}
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
