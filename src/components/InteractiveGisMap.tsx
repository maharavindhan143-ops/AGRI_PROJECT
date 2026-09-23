'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../lib/context/AppContext';
import { Complaint, MandiPrice } from '../types';
import { 
  INDIA_LOCATIONS_DATABASE, 
  LocationSearchResult, 
  EXTRA_INDIA_MARKERS, 
  MapMarkerItem,
  fetchGeocodingLocations 
} from '../lib/indiaMapData';
import { 
  MapPin, 
  Layers, 
  Search, 
  Navigation, 
  CheckCircle2, 
  Wrench, 
  CloudRain, 
  ChevronRight,
  X,
  Globe,
  Sparkles,
  Award,
  Maximize2,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface InteractiveGisMapProps {
  onSelectComplaint?: (complaint: Complaint) => void;
  heightClass?: string;
}

export const InteractiveGisMap: React.FC<InteractiveGisMapProps> = ({
  onSelectComplaint,
  heightClass = 'h-[640px]',
}) => {
  const { complaints, mandiPrices, weather, language } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const debounceTimerRef = useRef<any>(null);

  // Map state
  const [mapType, setMapType] = useState<'satellite' | 'roadmap'>('satellite');
  const [activeLayers, setActiveLayers] = useState({
    infrastructure: true,
    mandi: true,
    weather: true,
    schemes: true,
    agriculture: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState<{
    text: string;
    type: 'searching' | 'success' | 'error';
  } | null>(null);

  const [searchedLocationMarker, setSearchedLocationMarker] = useState<LocationSearchResult | null>(null);
  const [currentZoomLevelName, setCurrentZoomLevelName] = useState('🇮🇳 India (Country View)');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string | null>(null);
  const [inspectedMarker, setInspectedMarker] = useState<any>(null);

  // Handle Search Input Change with Debounced Geocoding Autocomplete
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setSearchFeedback(null);

    if (!q.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      setIsSearching(true);
      const results = await fetchGeocodingLocations(q);
      setIsSearching(false);
      setSearchResults(results);
      setIsSearchOpen(results.length > 0);
    }, 350);
  };

  // Perform full search submission (Enter Key or Search Icon Click)
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setIsSearchOpen(false);
    setIsSearching(true);
    setSearchFeedback({
      text: language === 'ta' ? '🔍 இருப்பிடம் தேடப்படுகிறது...' : '🔍 Searching location...',
      type: 'searching'
    });

    const results = await fetchGeocodingLocations(q);
    setIsSearching(false);

    if (results && results.length > 0) {
      const bestMatch = results[0];
      applySelectedLocation(bestMatch);
      setSearchFeedback({
        text: language === 'ta' ? '✅ இருப்பிடம் பெறப்பட்டது' : '✅ Location found',
        type: 'success'
      });
    } else {
      setSearchFeedback({
        text: language === 'ta' 
          ? '❌ இருப்பிடம் கிடைக்கவில்லை. வேறு கிராமம், நகரம், மாவட்டம் அல்லது மாநிலத்தின் பெயரை முயற்சிக்கவும்.' 
          : '❌ Location not found. Please try another village, town, district or state name.',
        type: 'error'
      });
    }
  };

  // Apply selected location (move camera, set marker, set info card)
  const applySelectedLocation = (loc: LocationSearchResult) => {
    setSearchQuery(loc.name);
    setIsSearchOpen(false);
    setSearchedLocationMarker(loc);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], loc.zoom || 13, {
        duration: 1.5,
      });
    }

    // Set inspection overlay card for searched location
    setInspectedMarker({
      type: 'searched_location',
      title: loc.name,
      subtitle: `${loc.district ? loc.district + ' District, ' : ''}${loc.state}${loc.country ? ', ' + loc.country : ''}`,
      displayName: loc.displayName,
      lat: loc.lat.toFixed(6),
      lng: loc.lng.toFixed(6),
      badgeBg: 'bg-emerald-100 text-emerald-900 border border-emerald-300'
    });
  };

  // Handle "📍 My Location"
  const handleLocateUser = () => {
    setGpsErrorMsg(null);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([latitude, longitude], 14, { duration: 1.5 });
          }

          setInspectedMarker({
            type: 'user_location',
            title: language === 'ta' ? 'உங்கள் தற்போதைய இருப்பிடம்' : 'Your Current Location',
            subtitle: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            lat: latitude.toFixed(6),
            lng: longitude.toFixed(6),
            badgeBg: 'bg-sky-100 text-sky-900 border border-sky-300'
          });
        },
        (err) => {
          const errMsg = language === 'ta'
            ? 'உங்கள் தற்போதைய இருப்பிடத்தை காட்ட Location Permission தேவை.'
            : 'Location permission is required to show your current location.';
          setGpsErrorMsg(errMsg);
          setTimeout(() => setGpsErrorMsg(null), 5000);
        }
      );
    } else {
      const errMsg = language === 'ta' ? 'உங்கள் உலாவியில் GPS ஆதரிக்கப்படவில்லை.' : 'Geolocation is not supported by your browser.';
      setGpsErrorMsg(errMsg);
      setTimeout(() => setGpsErrorMsg(null), 5000);
    }
  };

  // Toggle Layer
  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      
      const L = (await import('leaflet')).default;

      if (!isMounted) return;

      // Clean up previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // 1. Create Map Instance centered at India
      const map = L.map(mapContainerRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: false,
      });

      mapInstanceRef.current = map;

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // 2. Set Tile Layer (Default: Google Hybrid Satellite)
      const tileUrl = mapType === 'satellite'
        ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
        : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

      const tileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; Google Maps Platform / RuralFix Satellite',
        maxZoom: 19,
      }).addTo(map);

      // Layer Group for markers
      const markerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = markerGroup;

      // Listen to Zoom level changes to update country->village indicator
      map.on('zoomend', () => {
        const zoom = map.getZoom();
        if (zoom < 6) setCurrentZoomLevelName('🇮🇳 India (Country View)');
        else if (zoom < 9) setCurrentZoomLevelName('🗺️ State View');
        else if (zoom < 12) setCurrentZoomLevelName('🏛️ District View');
        else setCurrentZoomLevelName('🌾 Village Infrastructure View');
      });

      // 3. Render All Combined Markers
      renderMarkers(L, markerGroup);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapType]);

  // Re-render markers when activeLayers, state data, userLocation or searchedLocationMarker changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    
    import('leaflet').then((L) => {
      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
        renderMarkers(L.default, layerGroupRef.current);
      }
    });
  }, [activeLayers, complaints, mandiPrices, userLocation, searchedLocationMarker]);

  // Marker Render Helper Function
  const renderMarkers = (L: any, group: any) => {
    // A. Searched Location Marker (📍 vibrant pin with animated pulsing ring)
    if (searchedLocationMarker) {
      const searchedIcon = L.divIcon({
        className: 'searched-loc-pin',
        html: `<div class="relative flex items-center justify-center">
                <div class="absolute w-10 h-10 rounded-full bg-emerald-500/40 animate-ping"></div>
                <div class="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white text-white shadow-2xl flex items-center justify-center text-sm font-black cursor-pointer transform hover:scale-125 transition-all">
                  📍
                </div>
              </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const searchMarker = L.marker([searchedLocationMarker.lat, searchedLocationMarker.lng], { icon: searchedIcon });
      searchMarker.bindTooltip(`📍 ${searchedLocationMarker.name}`, { permanent: true, direction: 'top', className: 'bg-emerald-950 text-white font-extrabold text-xs px-2 py-1 rounded-lg border border-emerald-400 shadow-lg' });
      searchMarker.on('click', () => {
        applySelectedLocation(searchedLocationMarker);
      });
      searchMarker.addTo(group);
    }

    // B. User Geolocation Marker (if found)
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-loc-pin',
        html: `<div class="w-7 h-7 rounded-full bg-sky-500 border-2 border-white ring-4 ring-sky-500/40 animate-pulse flex items-center justify-center text-white text-xs font-bold">📍</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      const uMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      uMarker.bindTooltip(language === 'ta' ? 'உங்கள் இருப்பிடம்' : 'Your Current Location', { permanent: false, direction: 'top', className: 'text-xs font-bold' });
      uMarker.on('click', () => {
        setInspectedMarker({
          type: 'user_location',
          title: language === 'ta' ? 'உங்கள் தற்போதைய இருப்பிடம்' : 'Your Current Location',
          subtitle: `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`,
          lat: userLocation.lat.toFixed(6),
          lng: userLocation.lng.toFixed(6),
          badgeBg: 'bg-sky-100 text-sky-900 border border-sky-300'
        });
      });
      uMarker.addTo(group);
    }

    // C. Infrastructure Complaints Markers (Red / Orange / Green)
    if (activeLayers.infrastructure) {
      complaints.forEach((c) => {
        const isVerified = c.status === 'verified';
        const isCritical = c.severity === 'critical';
        
        const badgeColor = isVerified ? 'bg-emerald-500 border-emerald-200' : isCritical ? 'bg-rose-600 border-rose-300' : 'bg-amber-500 border-amber-200';
        const iconSymbol = isVerified ? '✓' : isCritical ? '🔴' : '🟠';

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div class="relative w-8 h-8 rounded-full ${badgeColor} border-2 text-white shadow-lg flex items-center justify-center text-xs font-black cursor-pointer hover:scale-125 transition-all">
                  ${iconSymbol}
                </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([c.location.lat, c.location.lng], { icon: customIcon });
        marker.on('click', () => {
          setInspectedMarker({
            type: 'complaint',
            title: c.title,
            subtitle: `${c.id} • ${c.location.village}, ${c.location.district}`,
            location: `${c.location.address}, ${c.location.district}`,
            status: c.status.replace('_', ' ').toUpperCase(),
            severity: c.severity.toUpperCase(),
            data: c,
            badgeBg: isVerified ? 'bg-emerald-100 text-emerald-800' : isCritical ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
          });
        });
        marker.addTo(group);
      });
    }

    // D. Mandi Market Markers (Blue 🔵 / 🌾)
    if (activeLayers.mandi) {
      const mandiCoords: Record<string, { lat: number; lng: number }> = {
        Thanjavur: { lat: 10.7870, lng: 79.1378 },
        Erode: { lat: 11.3410, lng: 77.7172 },
        Madurai: { lat: 9.9252, lng: 78.1198 },
        Virudhunagar: { lat: 9.5872, lng: 77.9579 },
        Villupuram: { lat: 11.9401, lng: 79.4861 },
      };

      mandiPrices.forEach((m) => {
        const coords = mandiCoords[m.district] || { lat: 10.5, lng: 78.2 };
        const customIcon = L.divIcon({
          className: 'mandi-leaflet-marker',
          html: `<div class="w-8 h-8 rounded-full bg-sky-600 border-2 border-sky-200 text-white shadow-lg flex items-center justify-center text-sm font-bold cursor-pointer hover:scale-125 transition-all">
                  🌾
                </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([coords.lat, coords.lng], { icon: customIcon });
        marker.on('click', () => {
          setInspectedMarker({
            type: 'mandi',
            title: `${language === 'ta' ? m.cropTamil : m.crop}`,
            subtitle: `${m.market} (${m.district})`,
            price: `₹${m.pricePerQuintal} / Quintal`,
            trend: m.trend.toUpperCase(),
            advice: language === 'ta' ? m.bestTimeToSellTamil : m.bestTimeToSell,
            data: m,
            badgeBg: 'bg-sky-100 text-sky-900'
          });
        });
        marker.addTo(group);
      });
    }

    // E. Weather Risk Markers (🌧️)
    if (activeLayers.weather) {
      const customIcon = L.divIcon({
        className: 'weather-leaflet-marker',
        html: `<div class="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-xl border border-amber-300 flex items-center space-x-1 cursor-pointer hover:scale-110 transition-all">
                <span>🌧️</span>
                <span>Delta Rain Alert</span>
              </div>`,
        iconSize: [120, 28],
        iconAnchor: [60, 14],
      });

      const marker = L.marker([10.75, 79.05], { icon: customIcon });
      marker.on('click', () => {
        setInspectedMarker({
          type: 'weather',
          title: language === 'ta' ? weather.activeAlert?.titleTamil : weather.activeAlert?.title || 'Heavy Rain Alert',
          subtitle: 'Thanjavur & Delta Agricultural Zone',
          riskLevel: 'Moderate to Heavy Showers (40-70mm)',
          advisory: language === 'ta' ? weather.activeAlert?.actionTamil : weather.activeAlert?.action,
          data: weather,
          badgeBg: 'bg-amber-100 text-amber-900'
        });
      });
      marker.addTo(group);
    }

    // F. Extra India Markers (Kerala, Maharashtra, Gujarat, UP, Karnataka, etc.)
    EXTRA_INDIA_MARKERS.forEach((item) => {
      if (item.type === 'complaint' && !activeLayers.infrastructure) return;
      if (item.type === 'mandi' && !activeLayers.mandi) return;
      if (item.type === 'weather' && !activeLayers.weather) return;
      if (item.type === 'scheme' && !activeLayers.schemes) return;

      const symbol = item.type === 'complaint' ? '🔴' : item.type === 'mandi' ? '🌾' : item.type === 'weather' ? '🌧️' : '🟣';
      const bgColor = item.type === 'complaint' ? 'bg-rose-600 border-rose-200' : item.type === 'mandi' ? 'bg-sky-600 border-sky-200' : item.type === 'weather' ? 'bg-amber-500 border-amber-200' : 'bg-purple-600 border-purple-200';

      const customIcon = L.divIcon({
        className: 'extra-leaflet-marker',
        html: `<div class="w-8 h-8 rounded-full ${bgColor} border-2 text-white shadow-lg flex items-center justify-center text-xs font-black cursor-pointer hover:scale-125 transition-all">
                ${symbol}
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon });
      marker.on('click', () => {
        setInspectedMarker({
          type: item.type,
          title: item.title,
          subtitle: `${item.locationName}, ${item.district} (${item.state})`,
          detailsText: item.detailsText,
          actionLabel: item.actionLabel,
          data: item,
          badgeBg: item.type === 'complaint' ? 'bg-rose-100 text-rose-800' : item.type === 'mandi' ? 'bg-sky-100 text-sky-800' : item.type === 'weather' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
        });
      });
      marker.addTo(group);
    });
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 flex flex-col font-sans`}>
      
      {/* Search Bar & Location Controls (Top Floating) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pointer-events-auto">
        
        {/* Search Input Form & Autocomplete Dropdown */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 flex items-center px-3.5 py-2 space-x-2">
            <button type="submit" className="text-emerald-600 hover:text-emerald-800 focus:outline-none flex-shrink-0">
              {isSearching ? (
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-emerald-600" />
              )}
            </button>

            <input
              type="text"
              placeholder={language === 'ta' ? 'கிராமம், நகரம், மாவட்டம் அல்லது மாநிலத்தை தேட...' : 'Search village, town, district or state...'}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400"
            />

            {searchQuery && (
              <button 
                type="button"
                onClick={() => { setSearchQuery(''); setSearchResults([]); setIsSearchOpen(false); setSearchFeedback(null); }}
                className="text-slate-400 hover:text-slate-600 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Status Feedback Toast */}
          {searchFeedback && (
            <div className={`mt-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-lg border backdrop-blur-md flex items-center space-x-1.5 animate-in fade-in slide-in-from-top-1 ${
              searchFeedback.type === 'searching' 
                ? 'bg-sky-900/90 text-sky-200 border-sky-700' 
                : searchFeedback.type === 'success' 
                ? 'bg-emerald-900/90 text-emerald-200 border-emerald-700' 
                : 'bg-rose-900/90 text-rose-200 border-rose-700'
            }`}>
              {searchFeedback.type === 'searching' && <Loader2 className="w-3 h-3 animate-spin text-sky-300" />}
              {searchFeedback.type === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-300" />}
              {searchFeedback.type === 'error' && <AlertCircle className="w-3 h-3 text-rose-300" />}
              <span>{searchFeedback.text}</span>
            </div>
          )}

          {/* Autocomplete Dropdown Suggestions */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 max-h-64 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
              {searchResults.map((loc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applySelectedLocation(loc)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-emerald-50 transition-colors flex items-center justify-between group border-b border-slate-50 last:border-none"
                >
                  <div className="pr-2">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <strong className="text-slate-900 font-extrabold group-hover:text-emerald-700">{loc.name}</strong>
                    </div>
                    <span className="text-slate-500 text-[11px] block ml-5 font-medium">
                      {loc.district ? `${loc.district}, ` : ''}{loc.state} • {loc.type.toUpperCase()}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Zoom Level Indicator Pill & My Location Button */}
        <div className="flex items-center space-x-2">
          <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700 text-white text-xs font-bold shadow-xl flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span>{currentZoomLevelName}</span>
          </div>

          <button
            type="button"
            onClick={handleLocateUser}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-2xl text-xs shadow-xl flex items-center space-x-1.5 active:scale-95 transition-all"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'ta' ? 'என் இருப்பிடம்' : 'My Location'}</span>
          </button>
        </div>

      </div>

      {/* GPS Permission Error Toast Alert */}
      {gpsErrorMsg && (
        <div className="absolute top-20 left-4 right-4 md:left-auto md:right-4 z-40 bg-rose-900/95 text-white px-4 py-2.5 rounded-2xl border border-rose-700 shadow-2xl text-xs font-bold flex items-center space-x-2 max-w-md animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 text-rose-300 flex-shrink-0" />
          <span>{gpsErrorMsg}</span>
        </div>
      )}

      {/* Layer Toggles & Map Type (Top-Right Floating) */}
      <div className="absolute top-20 right-4 z-20 flex flex-col items-end space-y-2 pointer-events-auto">
        
        {/* Map Type Switcher */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-xl flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              mapType === 'satellite' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🛰️ Satellite
          </button>
          <button
            type="button"
            onClick={() => setMapType('roadmap')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              mapType === 'roadmap' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🗺️ Roadmap
          </button>
        </div>

        {/* Feature Layer Toggles */}
        <div className="bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700 text-white text-xs space-y-1.5 shadow-2xl max-w-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 px-1">Map Layers</div>
          
          <button
            type="button"
            onClick={() => toggleLayer('infrastructure')}
            className={`w-full text-left px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center justify-between transition-all ${
              activeLayers.infrastructure ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🔴 Infrastructure Issues</span>
            <span>{activeLayers.infrastructure ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleLayer('mandi')}
            className={`w-full text-left px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center justify-between transition-all ${
              activeLayers.mandi ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌾 Mandi Spot Prices</span>
            <span>{activeLayers.mandi ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleLayer('weather')}
            className={`w-full text-left px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center justify-between transition-all ${
              activeLayers.weather ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌧️ Weather Risks</span>
            <span>{activeLayers.weather ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleLayer('schemes')}
            className={`w-full text-left px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center justify-between transition-all ${
              activeLayers.schemes ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🟣 Govt Subsidies</span>
            <span>{activeLayers.schemes ? 'ON' : 'OFF'}</span>
          </button>
        </div>

      </div>

      {/* Leaflet Canvas Container */}
      <div ref={mapContainerRef} className="w-full flex-1 z-10" />

      {/* Marker Popup Drawer / Bottom Sheet */}
      {inspectedMarker && (
        <div className="absolute bottom-6 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-3 max-w-lg mx-auto pointer-events-auto">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-2xl ${inspectedMarker.badgeBg} font-black text-base`}>
                {inspectedMarker.type === 'searched_location' && '📍'}
                {inspectedMarker.type === 'user_location' && '📍'}
                {inspectedMarker.type === 'complaint' && '🔴'}
                {inspectedMarker.type === 'mandi' && '🌾'}
                {inspectedMarker.type === 'weather' && '🌧️'}
                {inspectedMarker.type === 'scheme' && '🟣'}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900 leading-tight">
                  {inspectedMarker.title}
                </h4>
                <p className="text-xs text-slate-500 font-semibold">{inspectedMarker.subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setInspectedMarker(null)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 text-xs space-y-2 text-slate-700">
            {/* Searched Location & GPS Location Details Card */}
            {(inspectedMarker.type === 'searched_location' || inspectedMarker.type === 'user_location') && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                {inspectedMarker.displayName && (
                  <p className="text-slate-600 text-[11px] leading-snug font-medium">
                    {inspectedMarker.displayName}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/80">
                  <div>
                    <span className="text-slate-400 block font-medium">Latitude:</span>
                    <strong className="font-mono text-slate-800">{inspectedMarker.lat}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Longitude:</span>
                    <strong className="font-mono text-slate-800">{inspectedMarker.lng}</strong>
                  </div>
                </div>
              </div>
            )}

            {inspectedMarker.type === 'complaint' && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="font-bold text-emerald-700">{inspectedMarker.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Severity Level:</span>
                  <span className="font-bold text-rose-600">{inspectedMarker.severity}</span>
                </div>
              </div>
            )}

            {inspectedMarker.type === 'mandi' && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Market Price:</span>
                  <span className="font-extrabold text-emerald-800">{inspectedMarker.price}</span>
                </div>
                <p className="text-[11px] text-slate-600 pt-1">💡 <strong>Advice:</strong> {inspectedMarker.advice}</p>
              </div>
            )}

            {(inspectedMarker.type === 'weather' || inspectedMarker.type === 'scheme') && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="leading-relaxed font-medium text-slate-800">{inspectedMarker.detailsText || inspectedMarker.advisory}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              {inspectedMarker.type === 'searched_location' && (
                <button
                  type="button"
                  onClick={() => {
                    if (mapInstanceRef.current && inspectedMarker.lat && inspectedMarker.lng) {
                      mapInstanceRef.current.flyTo([parseFloat(inspectedMarker.lat), parseFloat(inspectedMarker.lng)], 14, { duration: 1 });
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 shadow-md shadow-emerald-600/20"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View on Map</span>
                </button>
              )}

              {inspectedMarker.type === 'complaint' && onSelectComplaint && (
                <button
                  type="button"
                  onClick={() => {
                    const cData = inspectedMarker.data;
                    setInspectedMarker(null);
                    onSelectComplaint(cData);
                  }}
                  className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 shadow-md shadow-emerald-600/20"
                >
                  <span>View Complaint</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              {inspectedMarker.type === 'mandi' && (
                <a
                  href="/agro/market"
                  className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 shadow-md shadow-emerald-600/20"
                >
                  <span>View Market & Find Buyer</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Map Legend Footer */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center space-x-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 text-xs text-slate-300">
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>Critical Issue</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Pending Repair</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Verified Work</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
          <span>Mandi Hub</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span>Govt Scheme</span>
        </span>
      </div>

    </div>
  );
};
