import { Preferences } from '@capacitor/preferences';
import { writable } from 'svelte/store';

/**
 * Application settings type definition
 */
export type AppSettings = {
	distanceLock: boolean;
	mockUnlock: boolean;
	backgroundLocation: boolean;
	theme: 'light' | 'dark';
	locale: 'en' | 'pt' | 'es' | 'fr' | 'de' | 'it' | 'ar' | 'ru' | 'hi' | 'zh';
};

/**
 * Reactive store for application settings
 */
export const appSettings = writable<AppSettings>();

/**
 * Default settings values
 */
const DEFAULT_SETTINGS: AppSettings = {
	distanceLock: true,
	mockUnlock: true,
	backgroundLocation: true,
	theme: 'dark',
	locale: 'en',
};

/**
 * Load settings from persistent storage
 */
export async function loadSettings(): Promise<void> {
	const distanceLock = (await Preferences.get({ key: 'settings/distanceLock' })).value !== 'false';
	const mockUnlock = (await Preferences.get({ key: 'settings/mockUnlock' })).value !== 'false';
	const backgroundLocation = (await Preferences.get({ key: 'settings/backgroundLocation' })).value !== 'false';

	const themeValue = (await Preferences.get({ key: 'settings/theme' })).value;
	const theme = (themeValue || DEFAULT_SETTINGS.theme) as AppSettings['theme'];

	const localeValue = (await Preferences.get({ key: 'settings/locale' })).value;
	const locale = (localeValue || DEFAULT_SETTINGS.locale) as AppSettings['locale'];

	appSettings.set({
		distanceLock,
		mockUnlock,
		backgroundLocation,
		theme,
		locale,
	});

	// Subscribe to persist changes
	appSettings.subscribe(async (settings) => {
		await Promise.all([
			Preferences.set({ key: 'settings/distanceLock', value: settings.distanceLock.toString() }),
			Preferences.set({ key: 'settings/mockUnlock', value: settings.mockUnlock.toString() }),
			Preferences.set({ key: 'settings/backgroundLocation', value: settings.backgroundLocation.toString() }),
			Preferences.set({ key: 'settings/theme', value: settings.theme }),
			Preferences.set({ key: 'settings/locale', value: settings.locale }),
		]);
	});
}