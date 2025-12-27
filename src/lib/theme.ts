import { derived } from 'svelte/store';
import { appSettings } from './settings';

export type Theme = 'light' | 'dark';

export const theme = derived<typeof appSettings, Theme>(appSettings, ($appSettings, set) => {
	if (!$appSettings) return;
	set($appSettings.theme);
});