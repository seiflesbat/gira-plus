/**
 * Favorites Service
 * 
 * Manages user's favorite stations with persistent storage.
 * 
 * @module favorites
 */

import { Preferences } from '@capacitor/preferences';
import { writable, get } from 'svelte/store';

const STORAGE_KEY = 'favorites/stations';

export const favoriteStations = writable<Set<string>>(new Set());

export async function loadFavorites(): Promise<void> {
    try {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        if (!value) return;
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
            favoriteStations.set(new Set(parsed));
        }
    } catch (error) {
        console.error('[Favorites] Failed to load:', error);
    }
}

async function saveFavorites(favorites: Set<string>): Promise<void> {
    await Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify([...favorites]),
    });
}

export async function toggleFavorite(serialNumber: string): Promise<boolean> {
    const favorites = get(favoriteStations);
    const wasFavorite = favorites.has(serialNumber);
    if (wasFavorite) {
        favorites.delete(serialNumber);
    } else {
        favorites.add(serialNumber);
    }
    favoriteStations.set(new Set(favorites));
    await saveFavorites(favorites);
    return !wasFavorite;
}

export const isFavorite = (serialNumber: string): boolean =>
    get(favoriteStations).has(serialNumber);
