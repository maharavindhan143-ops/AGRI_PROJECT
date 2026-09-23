export interface LocationSearchResult {
  name: string;
  state: string;
  district?: string;
  country?: string;
  displayName?: string;
  type: 'state' | 'district' | 'village' | 'town' | 'city' | 'location';
  lat: number;
  lng: number;
  zoom: number;
}

/**
 * Fetch real geocoding search results from OpenStreetMap Nominatim API
 * scoped to India with English and Tamil language resolution.
 */
export async function fetchGeocodingLocations(query: string): Promise<LocationSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // 1. Check local preset database for instant match
  const localMatches = INDIA_LOCATIONS_DATABASE.filter(loc =>
    loc.name.toLowerCase().includes(trimmed.toLowerCase()) ||
    loc.state.toLowerCase().includes(trimmed.toLowerCase())
  );

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&countrycodes=in&addressdetails=1&limit=6&accept-language=en,ta`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RuralFix-AgroMedKnow-Map/1.0'
      }
    });

    if (!response.ok) {
      return localMatches;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return localMatches;
    }

    const apiResults: LocationSearchResult[] = data.map((item: any) => {
      const address = item.address || {};
      const name = item.name || address.village || address.town || address.city || address.county || address.state || trimmed;
      const state = address.state || 'India';
      const district = address.state_district || address.county || address.district || '';
      const country = address.country || 'India';
      const placeType = item.type || item.class || 'location';

      let zoom = 14; // Default zoom for town/village
      if (placeType === 'state') zoom = 7;
      else if (placeType === 'administrative' || item.addresstype === 'county' || item.addresstype === 'district') zoom = 11;
      else if (placeType === 'city') zoom = 12;

      return {
        name,
        state,
        district,
        country,
        displayName: item.display_name,
        type: placeType as any,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        zoom,
      };
    });

    // Merge API results with local matches (deduplicating by close lat/lng)
    const combined = [...apiResults];
    localMatches.forEach(lm => {
      if (!combined.some(c => Math.abs(c.lat - lm.lat) < 0.05 && Math.abs(c.lng - lm.lng) < 0.05)) {
        combined.push(lm);
      }
    });

    return combined;
  } catch (error) {
    console.warn('Geocoding API network/fetch error, falling back to local database:', error);
    return localMatches;
  }
}


export const INDIA_LOCATIONS_DATABASE: LocationSearchResult[] = [
  // Tamil Nadu
  { name: 'Thanjavur', state: 'Tamil Nadu', type: 'district', lat: 10.7870, lng: 79.1378, zoom: 11 },
  { name: 'Ammapettai', state: 'Tamil Nadu', type: 'village', lat: 10.7905, lng: 79.1378, zoom: 14 },
  { name: 'Madurai', state: 'Tamil Nadu', type: 'district', lat: 9.9252, lng: 78.1198, zoom: 11 },
  { name: 'Kalligudi', state: 'Tamil Nadu', type: 'village', lat: 9.7214, lng: 77.9421, zoom: 14 },
  { name: 'Erode', state: 'Tamil Nadu', type: 'district', lat: 11.3410, lng: 77.7172, zoom: 11 },
  { name: 'Coimbatore', state: 'Tamil Nadu', type: 'district', lat: 11.0168, lng: 76.9558, zoom: 11 },
  { name: 'Salem', state: 'Tamil Nadu', type: 'district', lat: 11.6643, lng: 78.1460, zoom: 11 },
  { name: 'Villupuram', state: 'Tamil Nadu', type: 'district', lat: 11.9401, lng: 79.4861, zoom: 11 },
  { name: 'Pudukkottai', state: 'Tamil Nadu', type: 'district', lat: 10.3833, lng: 78.8167, zoom: 11 },
  { name: 'Tamil Nadu', state: 'Tamil Nadu', type: 'state', lat: 11.1271, lng: 78.6569, zoom: 7 },

  // Kerala
  { name: 'Wayanad', state: 'Kerala', type: 'district', lat: 11.6854, lng: 76.1320, zoom: 11 },
  { name: 'Palakkad', state: 'Kerala', type: 'district', lat: 10.7867, lng: 76.6548, zoom: 11 },
  { name: 'Kerala', state: 'Kerala', type: 'state', lat: 10.8505, lng: 76.2711, zoom: 8 },

  // Karnataka
  { name: 'Mandya', state: 'Karnataka', type: 'district', lat: 12.5218, lng: 76.8951, zoom: 11 },
  { name: 'Bengaluru Rural', state: 'Karnataka', type: 'district', lat: 13.2257, lng: 77.5750, zoom: 11 },
  { name: 'Karnataka', state: 'Karnataka', type: 'state', lat: 15.3173, lng: 75.7139, zoom: 7 },

  // Andhra Pradesh & Telangana
  { name: 'Guntur', state: 'Andhra Pradesh', type: 'district', lat: 16.3067, lng: 80.4365, zoom: 11 },
  { name: 'Andhra Pradesh', state: 'Andhra Pradesh', type: 'state', lat: 15.9129, lng: 79.7400, zoom: 7 },
  { name: 'Nalgonda', state: 'Telangana', type: 'district', lat: 17.0577, lng: 79.2684, zoom: 11 },
  { name: 'Telangana', state: 'Telangana', type: 'state', lat: 18.1124, lng: 79.0193, zoom: 7 },

  // Maharashtra
  { name: 'Nashik', state: 'Maharashtra', type: 'district', lat: 19.9975, lng: 73.7898, zoom: 11 },
  { name: 'Pune Rural', state: 'Maharashtra', type: 'district', lat: 18.5204, lng: 73.8567, zoom: 11 },
  { name: 'Maharashtra', state: 'Maharashtra', type: 'state', lat: 19.7515, lng: 75.7139, zoom: 7 },

  // Gujarat
  { name: 'Anand', state: 'Gujarat', type: 'district', lat: 22.5645, lng: 72.9289, zoom: 11 },
  { name: 'Gujarat', state: 'Gujarat', type: 'state', lat: 22.2587, lng: 71.1924, zoom: 7 },

  // Punjab & Haryana
  { name: 'Ludhiana', state: 'Punjab', type: 'district', lat: 30.9010, lng: 75.8573, zoom: 11 },
  { name: 'Punjab', state: 'Punjab', type: 'state', lat: 31.1471, lng: 75.3412, zoom: 8 },

  // Uttar Pradesh & Delhi
  { name: 'Mathura', state: 'Uttar Pradesh', type: 'district', lat: 27.4924, lng: 77.6737, zoom: 11 },
  { name: 'Uttar Pradesh', state: 'Uttar Pradesh', type: 'state', lat: 26.8467, lng: 80.9462, zoom: 7 },
  { name: 'Delhi', state: 'Delhi', type: 'state', lat: 28.7041, lng: 77.1025, zoom: 10 },

  // West Bengal & Odisha
  { name: 'Bardhaman', state: 'West Bengal', type: 'district', lat: 23.2324, lng: 87.8615, zoom: 11 },
  { name: 'Cuttack', state: 'Odisha', type: 'district', lat: 20.4625, lng: 85.8828, zoom: 11 },
  { name: 'West Bengal', state: 'West Bengal', type: 'state', lat: 22.9868, lng: 87.8550, zoom: 7 },
  { name: 'Odisha', state: 'Odisha', type: 'state', lat: 20.9517, lng: 85.0985, zoom: 7 },

  // Whole India
  { name: 'India', state: 'India', type: 'state', lat: 20.5937, lng: 78.9629, zoom: 5 },
];

export interface MapMarkerItem {
  id: string;
  type: 'complaint' | 'mandi' | 'weather' | 'scheme';
  title: string;
  locationName: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  statusSeverity?: 'critical' | 'pending' | 'verified' | 'high';
  detailsText: string;
  actionUrl?: string;
  actionLabel?: string;
}

export const EXTRA_INDIA_MARKERS: MapMarkerItem[] = [
  // Kerala
  {
    id: 'KL-01',
    type: 'weather',
    title: 'Wayanad High-Rain Advisory',
    locationName: 'Wayanad Hills',
    district: 'Wayanad',
    state: 'Kerala',
    lat: 11.6854,
    lng: 76.1320,
    statusSeverity: 'high',
    detailsText: 'Heavy monsoon runoff expected. Protect pepper plantations and check drainage.',
    actionLabel: 'View Alert',
  },
  {
    id: 'KL-02',
    type: 'mandi',
    title: 'Black Pepper & Cardamom Mandi',
    locationName: 'Palakkad Regulated Market',
    district: 'Palakkad',
    state: 'Kerala',
    lat: 10.7867,
    lng: 76.6548,
    detailsText: 'Black Pepper Spot Rate: ₹58,000 / Quintal. High export demand.',
    actionLabel: 'View Market',
  },

  // Karnataka
  {
    id: 'KA-01',
    type: 'complaint',
    title: 'Canal Sluice Gate Repair Needed',
    locationName: 'Visvesvaraya Canal Gate',
    district: 'Mandya',
    state: 'Karnataka',
    lat: 12.5218,
    lng: 76.8951,
    statusSeverity: 'pending',
    detailsText: 'Water release valve stuck halfway. Minor overflow into paddy fields.',
    actionLabel: 'View Complaint',
  },
  {
    id: 'KA-02',
    type: 'scheme',
    title: 'Karnataka Raitha Siri Millet Subsidy',
    locationName: 'Bengaluru Rural DBC',
    district: 'Bengaluru Rural',
    state: 'Karnataka',
    lat: 13.2257,
    lng: 77.5750,
    detailsText: '₹10,000 / Hectare incentive for ragi and bajra organic cultivators.',
    actionLabel: 'View Scheme',
  },

  // Maharashtra
  {
    id: 'MH-01',
    type: 'mandi',
    title: 'Lasalgaon Onion & Grapes Mandi',
    locationName: 'Lasalgaon Mandi',
    district: 'Nashik',
    state: 'Maharashtra',
    lat: 20.1472,
    lng: 74.2255,
    detailsText: 'Onion Red Grade: ₹2,100 / Quintal. Stable arrivals.',
    actionLabel: 'View Market',
  },
  {
    id: 'MH-02',
    type: 'complaint',
    title: 'Solar Transformer Cable Fault',
    locationName: 'Khed Panchayat',
    district: 'Pune Rural',
    state: 'Maharashtra',
    lat: 18.8479,
    lng: 73.9048,
    statusSeverity: 'critical',
    detailsText: 'Feeder tripping every 2 hours during daytime pumping schedules.',
    actionLabel: 'View Complaint',
  },

  // Gujarat
  {
    id: 'GJ-01',
    type: 'scheme',
    title: 'Amul Dairy Cooperative Cattle Insurance',
    locationName: 'Anand Milk Union Hub',
    district: 'Anand',
    state: 'Gujarat',
    lat: 22.5645,
    lng: 72.9289,
    detailsText: '80% subsidized livestock insurance cover for dairy farmers.',
    actionLabel: 'View Scheme',
  },

  // Uttar Pradesh
  {
    id: 'UP-01',
    type: 'mandi',
    title: 'Mathura Mustard & Wheat Market',
    locationName: 'Mathura Mandi Samiti',
    district: 'Mathura',
    state: 'Uttar Pradesh',
    lat: 27.4924,
    lng: 77.6737,
    detailsText: 'Mustard Seeds: ₹5,450 / Quintal. Rising oil mill demand.',
    actionLabel: 'View Market',
  },

  // Punjab
  {
    id: 'PB-01',
    type: 'complaint',
    title: 'Tubewell Power Grid Voltage Drop',
    locationName: 'Khanna Block',
    district: 'Ludhiana',
    state: 'Punjab',
    lat: 30.7027,
    lng: 76.2166,
    statusSeverity: 'verified',
    detailsText: 'Substation transformer upgraded to 100 kVA. Voltage restored.',
    actionLabel: 'View Complaint',
  },

  // West Bengal
  {
    id: 'WB-01',
    type: 'weather',
    title: 'Gangetic Basin Moisture Alert',
    locationName: 'Bardhaman Belt',
    district: 'Bardhaman',
    state: 'West Bengal',
    lat: 23.2324,
    lng: 87.8615,
    statusSeverity: 'high',
    detailsText: 'High humidity favorable for potato late blight. Preemptive spray advised.',
    actionLabel: 'View Alert',
  }
];
