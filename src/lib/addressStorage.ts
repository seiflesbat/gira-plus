/**
 * Address Storage Service - History and Saved Addresses
 * 
 * @module addressStorage
 */

import { Preferences } from '@capacitor/preferences';
import { writable, get } from 'svelte/store';

export interface SavedAddress {
    displayName: string;
    shortName: string;
    lat: number;
    lng: number;
    savedAt: number;
}

export interface RecentAddress {
    displayName: string;
    shortName: string;
    lat: number;
    lng: number;
    searchedAt: number;
}

const SAVED_ADDRESSES_KEY = 'addresses/saved';
const RECENT_ADDRESSES_KEY = 'addresses/recent';
const MAX_RECENT = 8;

export const savedAddresses = writable<SavedAddress[]>([]);
export const recentAddresses = writable<RecentAddress[]>([]);

/**
 * Initialize address storage - load from preferences
 */
export async function initAddressStorage(): Promise<void> {
    try {
        const savedData = (await Preferences.get({ key: SAVED_ADDRESSES_KEY })).value;
        if (savedData) {
            savedAddresses.set(JSON.parse(savedData));
        }

        const recentData = (await Preferences.get({ key: RECENT_ADDRESSES_KEY })).value;
        if (recentData) {
            recentAddresses.set(JSON.parse(recentData));
        }
    } catch (error) {
        console.error('[AddressStorage] Failed to load:', error);
    }
}

/**
 * Save an address to favorites
 */
export async function saveAddress(address: Omit<SavedAddress, 'savedAt'>): Promise<void> {
    const current = get(savedAddresses);

    // Check if already saved
    const exists = current.some(a =>
        a.lat === address.lat && a.lng === address.lng
    );
    if (exists) return;

    const newAddress: SavedAddress = {
        ...address,
        savedAt: Date.now(),
    };

    const updated = [newAddress, ...current];
    savedAddresses.set(updated);

    await Preferences.set({
        key: SAVED_ADDRESSES_KEY,
        value: JSON.stringify(updated),
    });
}

/**
 * Remove a saved address
 */
export async function removeSavedAddress(lat: number, lng: number): Promise<void> {
    const current = get(savedAddresses);
    const updated = current.filter(a => !(a.lat === lat && a.lng === lng));
    savedAddresses.set(updated);

    await Preferences.set({
        key: SAVED_ADDRESSES_KEY,
        value: JSON.stringify(updated),
    });
}

/**
 * Check if an address is saved
 */
export function isAddressSaved(lat: number, lng: number): boolean {
    const current = get(savedAddresses);
    return current.some(a => a.lat === lat && a.lng === lng);
}

/**
 * Add an address to search history
 */
export async function addToHistory(address: Omit<RecentAddress, 'searchedAt'>): Promise<void> {
    const current = get(recentAddresses);

    // Remove if already exists (will be added to top)
    const filtered = current.filter(a =>
        !(a.lat === address.lat && a.lng === address.lng)
    );

    const newAddress: RecentAddress = {
        ...address,
        searchedAt: Date.now(),
    };

    const updated = [newAddress, ...filtered].slice(0, MAX_RECENT);
    recentAddresses.set(updated);

    await Preferences.set({
        key: RECENT_ADDRESSES_KEY,
        value: JSON.stringify(updated),
    });
}

/**
 * Remove a single history item
 */
export async function removeFromHistory(lat: number, lng: number): Promise<void> {
    const current = get(recentAddresses);
    const updated = current.filter(a => !(a.lat === lat && a.lng === lng));
    recentAddresses.set(updated);

    await Preferences.set({
        key: RECENT_ADDRESSES_KEY,
        value: JSON.stringify(updated),
    });
}

/**
 * Clear all search history
 */
export async function clearHistory(): Promise<void> {
    recentAddresses.set([]);
    await Preferences.set({
        key: RECENT_ADDRESSES_KEY,
        value: JSON.stringify([]),
    });
}
