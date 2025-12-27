/**
 * Station Availability Prediction Engine
 * 
 * Client-side statistical prediction based on time-of-day patterns.
 * 
 * @module prediction
 */

import { Preferences } from '@capacitor/preferences';

interface HourlyPattern {
    avgBikes: number;
    avgDocks: number;
    samples: number;
}

interface StationPatterns {
    [stationId: string]: {
        hourly: { [dayHour: string]: HourlyPattern };
        lastUpdated: number;
    };
}

export interface Prediction {
    bikes: number;
    docks: number;
    confidence: 'high' | 'medium' | 'low';
}

const STORAGE_KEY = 'prediction/patterns';
const EMA_ALPHA = 0.3;

let patterns: StationPatterns = {};
let initialized = false;

const getDayHourKey = (date: Date): string => `${date.getDay()}-${date.getHours()}`;

const updateEMA = (current: number, newValue: number): number =>
    EMA_ALPHA * newValue + (1 - EMA_ALPHA) * current;

const getConfidence = (samples: number): Prediction['confidence'] => {
    if (samples >= 10) return 'high';
    if (samples >= 3) return 'medium';
    return 'low';
};

const savePatterns = async (): Promise<void> => {
    try {
        await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(patterns) });
    } catch (error) {
        console.error('[Prediction] Failed to save:', error);
    }
};

export async function initPrediction(): Promise<void> {
    if (initialized) return;
    try {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        if (value) patterns = JSON.parse(value);
        initialized = true;
    } catch (error) {
        console.error('[Prediction] Failed to load:', error);
        initialized = true;
    }
}

export function collectDataPoint(stationId: string, bikes: number, docks: number, timestamp: Date = new Date()): void {
    if (!patterns[stationId]) {
        patterns[stationId] = { hourly: {}, lastUpdated: Date.now() };
    }
    const key = getDayHourKey(timestamp);
    const existing = patterns[stationId].hourly[key];
    if (existing) {
        patterns[stationId].hourly[key] = {
            avgBikes: updateEMA(existing.avgBikes, bikes),
            avgDocks: updateEMA(existing.avgDocks, docks),
            samples: existing.samples + 1,
        };
    } else {
        patterns[stationId].hourly[key] = { avgBikes: bikes, avgDocks: docks, samples: 1 };
    }
    patterns[stationId].lastUpdated = Date.now();
    if (Math.random() < 0.1) savePatterns();
}

export function predictAvailability(stationId: string, arrivalTime: Date, currentBikes?: number, currentDocks?: number): Prediction | null {
    const stationData = patterns[stationId];
    if (!stationData) return null;
    const pattern = stationData.hourly[getDayHourKey(arrivalTime)];
    if (!pattern) {
        if (currentBikes !== undefined && currentDocks !== undefined) {
            return { bikes: currentBikes, docks: currentDocks, confidence: 'low' };
        }
        return null;
    }
    return {
        bikes: Math.round(pattern.avgBikes),
        docks: Math.round(pattern.avgDocks),
        confidence: getConfidence(pattern.samples),
    };
}

export function collectAllStations(stations: Array<{ serialNumber: string; bikes: number; docks: number }>): void {
    const now = new Date();
    for (const station of stations) {
        collectDataPoint(station.serialNumber, station.bikes, station.docks, now);
    }
}

export const forceSavePatterns = savePatterns;
