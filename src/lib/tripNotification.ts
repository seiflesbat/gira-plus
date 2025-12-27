/**
 * Trip Notification Service
 * 
 * Manages persistent notification during active bike trips.
 * 
 * @module tripNotification
 */

import { LocalNotifications } from '@capacitor/local-notifications';

const NOTIFICATION_ID = 1001;
const NOTIFICATION_TITLE = '🚴 Gira++ Trip Active';

let isActive = false;

const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
};

const buildNotification = (bikePlate: string | null, duration?: number) => ({
    id: NOTIFICATION_ID,
    title: NOTIFICATION_TITLE,
    body: `Bike ${bikePlate ?? 'Unknown'} • ${duration ? formatDuration(duration) : '00:00'}`,
    ongoing: true,
    autoCancel: false,
    smallIcon: 'ic_launcher',
    largeIcon: 'ic_launcher',
});

const ensurePermissions = async (): Promise<boolean> => {
    const { display } = await LocalNotifications.checkPermissions();
    if (display === 'granted') return true;
    if (display === 'denied') return false;
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
};

export async function showTripNotification(bikePlate: string | null): Promise<void> {
    if (!await ensurePermissions()) return;
    try {
        await LocalNotifications.schedule({ notifications: [buildNotification(bikePlate)] });
        isActive = true;
    } catch (error) {
        console.error('[TripNotification] Failed to show:', error);
    }
}

export async function updateTripNotification(bikePlate: string | null, elapsedMs: number): Promise<void> {
    if (!isActive) return;
    try {
        await LocalNotifications.schedule({ notifications: [buildNotification(bikePlate, elapsedMs)] });
    } catch (error) {
        console.error('[TripNotification] Failed to update:', error);
    }
}

export async function dismissTripNotification(): Promise<void> {
    if (!isActive) return;
    try {
        await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_ID }] });
        isActive = false;
    } catch (error) {
        console.error('[TripNotification] Failed to dismiss:', error);
    }
}

export const isNotificationActive = (): boolean => isActive;
