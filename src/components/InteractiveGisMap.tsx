'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
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
  Minimize2,
  Loader2,
  AlertCircle,
  Satellite,
  Compass,
  Filter
} from 'lucide-react';

interface InteractiveGisMapProps {
  onSelectComplaint?: (complaint: Complaint) => void;
  heightClass?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

type MapProviderType = 'esri_satellite' | 'google_hybrid' | 'osm_roads' | 'carto_dark';

export const InteractiveGisMap: React.FC<InteractiveGisMapProps> = ({
  onSelectComplaint,
  heightClass = 'h-[640px]',
  initialCenter = [20.5937, 78.9629],
  initialZoom = 5,
}) => {
  const { complaints, mandiPrices, weather, language } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const activeTileLayerRef = useRef<any>(null);
  const labelOverlayLayerRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const debounceTimerRef = useRef<any>(null);
  const rootWrapperRef = useRef<HTMLDivElement>(null);

  // Map settings
  const [mapProvider, setMapProvider] = useState<MapProviderType>('esri_satellite');
  const [showLabelsOnSatellite, setShowLabelsOnSatellite] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [mapReady, setMapReady] = useState<boolean>(false);

  // Feature Layers
  const [activeLayers, setActiveLayers] = useState({
    infrastructure: true,
    mandi: true,
    weather: true,
    schemes: true,
  });

  // Search & Geolocation State
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
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState<boolean>(false);

  // Quick Preset Locations
  const presetLocations = [
    { labelEn: 'All India', labelTa: 'அனைத்து இந்தியா', lat: 20.5937, lng: 78.9629, zoom: 5 },
    { labelEn: 'Thanjavur Delta (TN)', labelTa: 'தஞ்சாவூர் டெல்டா', lat: 10.7870, lng: 79.1378, zoom: 12 },
    { labelEn: 'Ammapettai Village', labelTa: 'அம்மாபேட்டை கிராமம்', lat: 10.7905, lng: 79.1378, zoom: 14 },
    { labelEn: 'Erode Mandi Hub', labelTa: 'ஈரோடு மண்டி', lat: 11.3410, lng: 77.7172, zoom: 12 },
    { labelEn: 'Madurai Region', labelTa: 'மதுரை மண்டலம்', lat: 9.9252, lng: 78.1198, zoom: 12 },
    { labelEn: 'Nashik (MH)', labelTa: 'நாசிக் (மகாராஷ்டிரா)', lat: 19.9975, lng: 73.7898, zoom: 11 },
    { labelEn: 'Guntur (AP)', labelTa: 'குண்டூர் (ஆந்திரா)', lat: 16.3067, lng: 80.4365, zoom: 11 },
    { labelEn: 'Wayanad (KL)', labelTa: 'வயநாடு (கேரளா)', lat: 11.6854, lng: 76.1320, zoom: 11 },
    { labelEn: 'Ludhiana (PB)', labelTa: 'லூதியானா (பஞ்சாப்)', lat: 30.9010, lng: 75.8573, zoom: 11 },
  ];

  // Helper to change base tile layer
  const applyTileLayer = useCallback((L: any, map: any, provider: MapProviderType, withLabels: boolean) => {
    if (activeTileLayerRef.current) {
      map.removeLayer(activeTileLayerRef.current);
      activeTileLayerRef.current = null;
    }
    if (labelOverlayLayerRef.current) {
      map.removeLayer(labelOverlayLayerRef.current);
      labelOverlayLayerRef.current = null;
    }

    let baseLayer: any;
    let overlayLayer: any = null;

    if (provider === 'esri_satellite') {
      // High-Resolution Esri World Imagery (Satellite)
      baseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri World Imagery / DigitalGlobe / Earthstar Geographics',
        maxZoom: 19,
        subdomains: ['server', 'services']
      });

      if (withLabels) {
        // Boundaries and road labels overlay
        overlayLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
          attribution: '&copy; Esri Places',
          maxZoom: 19,
          opacity: 0.9
        });
      }
    } else if (provider === 'google_hybrid') {
      // Google Hybrid Satellite
      baseLayer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps Satellite Platform',
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3']
      });
    } else if (provider === 'carto_dark') {
      // Dark GIS Matrix
      baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
        subdomains: 'abcd'
      });
    } else {
      // CartoDB Voyager / OpenStreetMap Detailed Road Map
      baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO Voyager',
        maxZoom: 19,
        subdomains: 'abcd'
      });
    }

    baseLayer.addTo(map);
    activeTileLayerRef.current = baseLayer;

    if (overlayLayer) {
      overlayLayer.addTo(map);
      labelOverlayLayerRef.current = overlayLayer;
    }
  }, []);

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
    }, 300);
  };

  // Perform full search submission
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
        text: language === 'ta' ? '✅ இருப்பிடம் கண்டறியப்பட்டது' : '✅ Location centered',
        type: 'success'
      });
    } else {
      setSearchFeedback({
        text: language === 'ta' 
          ? '❌ இருப்பிடம் கிடைக்கவில்லை. கிராமம், நகரம் அல்லது மாவட்டத்தின் பெயரை முயற்சிக்கவும்.' 
          : '❌ Location not found. Please try another village, town or district name.',
        type: 'error'
      });
    }
  };

  // Apply selected location
  const applySelectedLocation = (loc: LocationSearchResult) => {
    setSearchQuery(loc.name);
    setIsSearchOpen(false);
    setSearchedLocationMarker(loc);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], loc.zoom || 13, {
        duration: 1.5,
      });
      setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 100);
    }

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

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);
  };

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;
    let resizeObserver: ResizeObserver | null = null;

    async function initMap() {
      if (!mapContainerRef.current) return;
      
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Fix standard leaflet icon urls
      try {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      } catch (e) {
        // ignore
      }

      // Clean up previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // 1. Create Map Instance
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        minZoom: 3,
        maxZoom: 19,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Add Custom Attribution Control
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; RuralFix GIS Satellite Engine')
        .addTo(map);

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // 2. Set Tile Layer
      applyTileLayer(L, map, mapProvider, showLabelsOnSatellite);

      // Layer Group for markers
      const markerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = markerGroup;

      // Listen to Zoom level changes
      map.on('zoomend', () => {
        const zoom = map.getZoom();
        if (zoom < 6) setCurrentZoomLevelName('🇮🇳 India (Country View)');
        else if (zoom < 9) setCurrentZoomLevelName('🗺️ State Regional View');
        else if (zoom < 12) setCurrentZoomLevelName('🏛️ District View');
        else setCurrentZoomLevelName('🌾 Village & Farmland Infrastructure View');
      });

      // 3. Render Markers
      renderMarkers(L, markerGroup);
      setMapReady(true);

      // Invalidate size after layout settles to ensure tiles render immediately on desktop
      setTimeout(() => {
        if (isMounted && mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);

      setTimeout(() => {
        if (isMounted && mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 400);

      // Watch container resize
      if (mapContainerRef.current && typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        });
        resizeObserver.observe(mapContainerRef.current);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when mapProvider or showLabelsOnSatellite changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      if (mapInstanceRef.current) {
        applyTileLayer(L.default, mapInstanceRef.current, mapProvider, showLabelsOnSatellite);
      }
    });
  }, [mapProvider, showLabelsOnSatellite, applyTileLayer]);

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
    // A. Searched Location Marker
    if (searchedLocationMarker) {
      const searchedIcon = L.divIcon({
        className: 'searched-loc-pin',
        html: `<div class="relative flex items-center justify-center">
                <div class="absolute w-12 h-12 rounded-full bg-emerald-500/40 animate-ping"></div>
                <div class="w-10 h-10 rounded-full bg-emerald-600 border-2 border-white text-white shadow-2xl flex items-center justify-center text-base font-black cursor-pointer transform hover:scale-125 transition-all">
                  📍
                </div>
              </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const searchMarker = L.marker([searchedLocationMarker.lat, searchedLocationMarker.lng], { icon: searchedIcon });
      searchMarker.bindTooltip(`📍 ${searchedLocationMarker.name}`, { permanent: true, direction: 'top', className: 'bg-emerald-950 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg border border-emerald-400 shadow-xl' });
      searchMarker.on('click', () => {
        applySelectedLocation(searchedLocationMarker);
      });
      searchMarker.addTo(group);
    }

    // B. User Geolocation Marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-loc-pin',
        html: `<div class="relative flex items-center justify-center">
                <div class="w-8 h-8 rounded-full bg-sky-500 border-2 border-white ring-4 ring-sky-500/40 animate-pulse flex items-center justify-center text-white text-xs font-bold shadow-lg">📍</div>
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
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
        
        const badgeColor = isVerified ? 'bg-emerald-500 border-emerald-200 ring-4 ring-emerald-500/20' : isCritical ? 'bg-rose-600 border-rose-200 ring-4 ring-rose-600/30 animate-pulse' : 'bg-amber-500 border-amber-200 ring-4 ring-amber-500/20';
        const iconSymbol = isVerified ? '✓' : isCritical ? '🔴' : '🟠';

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div class="relative w-8 h-8 rounded-full ${badgeColor} border-2 text-white shadow-xl flex items-center justify-center text-xs font-black cursor-pointer hover:scale-125 transition-all">
                  ${iconSymbol}
                </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([c.location.lat, c.location.lng], { icon: customIcon });
        marker.bindTooltip(`<b>${c.title}</b><br/><span style="font-size:10px;color:#64748b;">${c.location.village}, ${c.location.district}</span>`, { direction: 'top', className: 'bg-white text-slate-900 font-sans shadow-lg rounded-lg border border-slate-200 text-xs p-1' });
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
          html: `<div class="w-8 h-8 rounded-full bg-sky-600 border-2 border-white ring-4 ring-sky-500/20 text-white shadow-xl flex items-center justify-center text-sm font-bold cursor-pointer hover:scale-125 transition-all">
                  🌾
                </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([coords.lat, coords.lng], { icon: customIcon });
        marker.bindTooltip(`<b>${language === 'ta' ? m.cropTamil : m.crop}</b>: ₹${m.pricePerQuintal}/Qtl`, { direction: 'top', className: 'bg-white text-slate-900 font-sans shadow-lg rounded-lg border border-slate-200 text-xs p-1' });
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
        html: `<div class="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-xl border-2 border-white flex items-center space-x-1 cursor-pointer hover:scale-110 transition-all">
                <span>🌧️</span>
                <span>Delta Rain Alert</span>
              </div>`,
        iconSize: [130, 30],
        iconAnchor: [65, 15],
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
      const bgColor = item.type === 'complaint' ? 'bg-rose-600 border-white ring-2 ring-rose-500/30' : item.type === 'mandi' ? 'bg-sky-600 border-white ring-2 ring-sky-500/30' : item.type === 'weather' ? 'bg-amber-500 border-white ring-2 ring-amber-500/30' : 'bg-purple-600 border-white ring-2 ring-purple-500/30';

      const customIcon = L.divIcon({
        className: 'extra-leaflet-marker',
        html: `<div class="w-8 h-8 rounded-full ${bgColor} border-2 text-white shadow-xl flex items-center justify-center text-xs font-black cursor-pointer hover:scale-125 transition-all">
                ${symbol}
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon });
      marker.bindTooltip(`<b>${item.title}</b><br/><span style="font-size:10px;color:#64748b;">${item.locationName} (${item.state})</span>`, { direction: 'top', className: 'bg-white text-slate-900 font-sans shadow-lg rounded-lg border border-slate-200 text-xs p-1' });
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
    <div 
      ref={rootWrapperRef}
      className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 rounded-0 h-screen bg-slate-950' : `${heightClass} rounded-3xl`} overflow-hidden border border-slate-300 shadow-2xl bg-slate-950 flex flex-col font-sans transition-all duration-300`}
    >
      
      {/* Top Floating Action & Search Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 pointer-events-auto">
        
        {/* Search Input Form & Autocomplete Dropdown */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 lg:w-80">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-300/90 flex items-center px-3 py-2 space-x-2">
              <button type="submit" aria-label="Search" className="text-emerald-700 hover:text-emerald-900 focus:outline-none flex-shrink-0">
                {isSearching ? (
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 text-emerald-700" />
                )}
              </button>

              <input
                type="text"
                placeholder={language === 'ta' ? 'கிராமம், மாவட்டம் அல்லது மாநிலத்தை தேட...' : 'Search village, town, district, state...'}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
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

          {/* Quick Preset Indian Location Selector */}
          <div className="relative hidden sm:block">
            <select
              onChange={(e) => {
                const target = presetLocations.find(p => p.labelEn === e.target.value);
                if (target && mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo([target.lat, target.lng], target.zoom, { duration: 1.5 });
                }
              }}
              defaultValue="All India"
              className="bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-2 rounded-2xl border border-slate-300 shadow-xl focus:outline-none cursor-pointer hover:bg-slate-50"
            >
              <option disabled>📍 {language === 'ta' ? 'விரைவு இடங்கள்' : 'Jump to Location'}</option>
              {presetLocations.map((p, idx) => (
                <option key={idx} value={p.labelEn}>
                  {language === 'ta' ? p.labelTa : p.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Map Type Mode Switcher & Tools (Satellite HD, Google Hybrid, Road, Dark) */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Base Layer Switcher Pills */}
          <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700 shadow-xl flex items-center space-x-1 text-xs">
            <button
              type="button"
              onClick={() => setMapProvider('esri_satellite')}
              className={`px-2.5 py-1.5 font-bold rounded-xl flex items-center space-x-1.5 transition-all ${
                mapProvider === 'esri_satellite' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'செயற்கைக்கோள் HD' : 'ArcGIS Satellite HD'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMapProvider('google_hybrid')}
              className={`px-2.5 py-1.5 font-bold rounded-xl flex items-center space-x-1.5 transition-all ${
                mapProvider === 'google_hybrid' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🛰️ {language === 'ta' ? 'ஹைப்ரிட்' : 'Google Hybrid'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMapProvider('osm_roads')}
              className={`px-2.5 py-1.5 font-bold rounded-xl flex items-center space-x-1.5 transition-all ${
                mapProvider === 'osm_roads' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🗺️ {language === 'ta' ? 'சாலை' : 'Roadmap'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMapProvider('carto_dark')}
              className={`px-2.5 py-1.5 font-bold rounded-xl flex items-center space-x-1.5 transition-all ${
                mapProvider === 'carto_dark' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🌙 {language === 'ta' ? 'டார்க்' : 'Dark Matrix'}</span>
            </button>
          </div>

          {/* Satellite Labels Toggle (Only for Esri Satellite) */}
          {mapProvider === 'esri_satellite' && (
            <button
              type="button"
              onClick={() => setShowLabelsOnSatellite(prev => !prev)}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-2xl border shadow-xl backdrop-blur-md transition-all ${
                showLabelsOnSatellite ? 'bg-emerald-800/90 text-white border-emerald-600' : 'bg-slate-900/90 text-slate-400 border-slate-700'
              }`}
              title="Toggle Place & Road Labels on Satellite"
            >
              🏷️ {language === 'ta' ? 'பெயர்கள்' : 'Labels'} {showLabelsOnSatellite ? 'ON' : 'OFF'}
            </button>
          )}

          {/* GPS Current Location Button */}
          <button
            type="button"
            onClick={handleLocateUser}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-2xl text-xs shadow-xl flex items-center space-x-1.5 active:scale-95 transition-all"
            title="Locate Current Position"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{language === 'ta' ? 'என் இருப்பிடம்' : 'GPS'}</span>
          </button>

          {/* Layers Filter Dropdown Toggle */}
          <button
            type="button"
            onClick={() => setIsLayerMenuOpen(prev => !prev)}
            className={`px-3 py-2 rounded-2xl text-xs font-bold shadow-xl flex items-center space-x-1.5 border backdrop-blur-md transition-all ${
              isLayerMenuOpen ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ta' ? 'அடுக்குகள்' : 'Layers'}</span>
          </button>

          {/* Fullscreen Expand/Collapse Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white p-2 rounded-2xl text-xs border border-slate-700 shadow-xl transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* GPS Error Alert */}
      {gpsErrorMsg && (
        <div className="absolute top-20 left-4 right-4 md:left-auto md:right-4 z-40 bg-rose-900/95 text-white px-4 py-2.5 rounded-2xl border border-rose-700 shadow-2xl text-xs font-bold flex items-center space-x-2 max-w-md animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 text-rose-300 flex-shrink-0" />
          <span>{gpsErrorMsg}</span>
        </div>
      )}

      {/* Floating Feature Layer Filter Menu */}
      {isLayerMenuOpen && (
        <div className="absolute top-18 right-3 z-30 bg-slate-950/95 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-white text-xs space-y-2 shadow-2xl w-64 animate-in fade-in slide-in-from-top-2 pointer-events-auto">
          <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
            <span className="text-[11px] uppercase font-bold text-slate-400">Map Data Overlays</span>
            <button onClick={() => setIsLayerMenuOpen(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          
          <button
            type="button"
            onClick={() => toggleLayer('infrastructure')}
            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
              activeLayers.infrastructure ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🔴 Infrastructure Redressal</span>
            <span>{activeLayers.infrastructure ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleLayer('mandi')}
            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
              activeLayers.mandi ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌾 Mandi Spot Prices</span>
            <span>{activeLayers.mandi ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleLayer('weather')}
            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
              activeLayers.weather ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌧️ Weather Risk Alerts</span>
            <span>{activeLayers.weather ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleLayer('schemes')}
            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
              activeLayers.schemes ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🟣 Govt Agri Schemes</span>
            <span>{activeLayers.schemes ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      )}

      {/* Center Top Zoom Resolution Pill */}
      <div className="absolute top-16 left-3 z-20 hidden md:flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-white text-[11px] font-bold shadow-xl pointer-events-none">
        <Globe className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '12s' }} />
        <span>{currentZoomLevelName}</span>
      </div>

      {/* Leaflet Canvas Container */}
      <div 
        ref={mapContainerRef} 
        id="ruralfix-gis-map-canvas"
        className="w-full h-full min-h-[350px] flex-1 z-10 block relative"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Marker Detailed Inspector Bottom Sheet */}
      {inspectedMarker && (
        <div className="absolute bottom-6 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-3 max-w-lg mx-auto pointer-events-auto">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-2xl ${inspectedMarker.badgeBg} font-black text-lg flex items-center justify-center`}>
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
                  <span>Center Satellite View</span>
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
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 shadow-md shadow-emerald-600/20"
                >
                  <span>View Full Complaint</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              {inspectedMarker.type === 'mandi' && (
                <a
                  href="/agro/market"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 shadow-md shadow-emerald-600/20"
                >
                  <span>View Mandi Rates & Buyers</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Map Legend Footer (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-20 hidden md:flex items-center space-x-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-800 text-[11px] text-slate-300 pointer-events-none">
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>Critical Grievance</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Pending Repair</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Verified Work</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
          <span>Mandi Hub</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span>Agri Scheme</span>
        </span>
      </div>

    </div>
  );
};
