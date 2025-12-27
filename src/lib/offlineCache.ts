/**
 * Offline Station Cache
 * 
 * Caches station data for offline access in poor signal areas.
 * 
 * @module offlineCache
 */

import { Preferences } from '@capacitor/preferences';
import type { StationInfo } from './map.svelte';

interface CacheData {
    stations: StationInfo[];
    timestamp: number;
}

const STORAGE_KEY = 'cache/stations';
const STALE_THRESHOLD_MS = 5 * 60 * 1000;

let cachedData: CacheData | null = null;
let initialized = false;

export async function initOfflineCache(): Promise<void> {
    if (initialized) return;
    try {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        if (value) cachedData = JSON.parse(value);
        initialized = true;
    } catch (error) {
        console.error('[OfflineCache] Failed to load:', error);
        initialized = true;
    }
}

export async function cacheStations(stations: StationInfo[]): Promise<void> {
    cachedData = { stations, timestamp: Date.now() };
    try {
        await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(cachedData) });
    } catch (error) {
        console.error('[OfflineCache] Failed to save:', error);
    }
}

export function getCachedStations(): StationInfo[] {
    return cachedData?.stations ?? [];
}

export function isDataStale(): boolean {
    if (!cachedData) return true;
    return Date.now() - cachedData.timestamp > STALE_THRESHOLD_MS;
}

export function getLastUpdateLabel(): string {
    if (!cachedData) return 'Never';
    const ms = Date.now() - cachedData.timestamp;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
}

export function hasCachedData(): boolean {
    return cachedData !== null && cachedData.stations.length > 0;
}
