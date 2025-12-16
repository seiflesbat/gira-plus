/**
 * Stub implementations for removed Capacitor plugins
 * These provide no-op implementations to allow the app to build without the plugins
 * This reduces APK size by ~1.5MB
 */

// Keyboard Plugin Stub
export const Keyboard = {
	addListener: (_event: string, _callback: (info: { keyboardHeight: number }) => void) => {
		return { remove: () => {} };
	},
	removeAllListeners: () => Promise.resolve(),
	hide: () => Promise.resolve(),
	show: () => Promise.resolve(),
};

// StatusBar Plugin Stub
export const StatusBar = {
	setOverlaysWebView: (_options: { overlay: boolean }) => Promise.resolve(),
	setStyle: (_options: { style: Style }) => Promise.resolve(),
	setBackgroundColor: (_options: { color: string }) => Promise.resolve(),
	show: () => Promise.resolve(),
	hide: () => Promise.resolve(),
};

export enum Style {
	Dark = 'DARK',
	Light = 'LIGHT',
	Default = 'DEFAULT',
}

// NavigationBar Plugin Stub
export const NavigationBar = {
	setTransparency: (_options: { isTransparent: boolean }) => Promise.resolve(),
	setColor: (_options: { color: string; darkButtons: boolean }) => Promise.resolve(),
	show: () => Promise.resolve(),
	hide: () => Promise.resolve(),
};

// ScreenOrientation Plugin Stub
export const ScreenOrientation = {
	lock: (_options: { orientation: string }) => Promise.resolve(),
	unlock: () => Promise.resolve(),
	orientation: () => Promise.resolve({ type: 'portrait-primary' }),
	addListener: (_event: string, _callback: (o: { type: string }) => void) => {
		return { remove: () => {} };
	},
	removeAllListeners: () => Promise.resolve(),
};
