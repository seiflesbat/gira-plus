/**
 * Geocoding Service - Free Nominatim API
 * 
 * @module geocoding
 */

export interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
const MIN_REQUEST_INTERVAL_MS = 1000;
const LISBON_VIEWBOX = '-9.25,38.65,-9.05,38.85';

let lastRequestTime = 0;

const waitForRateLimit = async (): Promise<void> => {
    const elapsed = Date.now() - lastRequestTime;
    if (elapsed < MIN_REQUEST_INTERVAL_MS) {
        await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - elapsed));
    }
    lastRequestTime = Date.now();
};

export async function searchAddress(query: string): Promise<NominatimResult[]> {
    if (!query || query.length < 3) return [];

    try {
        await waitForRateLimit();
        const params = new URLSearchParams({
            q: query,
            format: 'json',
            addressdetails: '1',
            limit: '10',
            countrycodes: 'pt',
            viewbox: LISBON_VIEWBOX,
            dedupe: '1',
        });
        const response = await fetch(`${NOMINATIM_BASE_URL}?${params}`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('[Geocoding] Search failed:', error);
        return [];
    }
}

export const getCoordinates = (result: NominatimResult) => ({
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
});

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const EARTH_RADIUS_M = 6371000;
    const toRad = (deg: number) => deg * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
