import { get, writable } from 'svelte/store';
import { getTokensLogin, getTokensRefresh, getUserInfo } from '$lib/emel-api/emel-api';
import { currentTrip, tripRating } from '$lib/trip';
import { selectedStation } from '$lib/map.svelte';
import { Preferences } from '@capacitor/preferences';
import { startWS } from '$lib/gira-api/ws';
import { updateOnetimeInfo } from '$lib/injest-api-data';
import { Network } from '@capacitor/network';

// Type definitions
export type Token = {
	accessToken: string;
	refreshToken: string;
	expiration: number;
};

export type JWT = {
	jti: string;
	sub: string;
	loginProvider: string;
	services: string[];
	nbf: number;
	exp: number;
	iat: number;
	iss: string;
	aud: string;
};

export type User = {
	email: string;
	name: string;
};

export type Subscription = {
	active: boolean;
	expirationDate: Date;
	name: string;
	subscriptionStatus: string;
	type: string;
};

export type AccountInfo = {
	bonus: number;
	balance: number;
	subscription: Subscription | null;
};

// Stores
export const token = writable<Token | null | undefined>(undefined);
export const userCredentials = writable<{ email: string; password: string } | null>(null);
export const user = writable<User | null>(null);
export const accountInfo = writable<AccountInfo | null>(null);

// Firebase token disabled for privacy - always returns null
// This is kept for API compatibility with other modules
export const encryptedFirebaseToken = writable<string | null>(null);

// Token refresh timeout
let tokenRefreshTimeout: ReturnType<typeof setTimeout> | null = null;

token.subscribe(async (v) => {
	if (!v) return;

	const jwt: JWT = JSON.parse(window.atob(v.accessToken.split('.')[1]));

	startWS();

	if (get(user) === null) {
		updateOnetimeInfo();
		updateUserInfo();
	}

	if (tokenRefreshTimeout) {
		clearTimeout(tokenRefreshTimeout);
	}

	tokenRefreshTimeout = setTimeout(refreshToken, jwt.exp * 1000 - Date.now() - 1000 * 30);
});

/**
 * Load user credentials from storage and attempt login
 */
export async function loadUserCreds(): Promise<void> {
	const email = (await Preferences.get({ key: 'email' })).value;
	const password = (await Preferences.get({ key: 'password' })).value;

	if (email && password) {
		userCredentials.set({ email, password });
	} else {
		token.set(null);
	}

	userCredentials.subscribe(async (v) => {
		if (!v) {
			await Preferences.remove({ key: 'email' });
			await Preferences.remove({ key: 'password' });
			return;
		}

		const responseCode = await login(v.email, v.password);

		if (responseCode !== 0) {
			console.error('Login failed with code:', responseCode);
			token.set(null);

			if (responseCode === 100) {
				await Preferences.remove({ key: 'email' });
				await Preferences.remove({ key: 'password' });
			}

			userCredentials.set(null);
		} else {
			await Preferences.set({ key: 'email', value: v.email });
			await Preferences.set({ key: 'password', value: v.password });
		}
	});
}

/**
 * Authenticate user with email and password
 */
export async function login(email: string, password: string): Promise<number> {
	const response = await getTokensLogin(email, password);

	if (response.error.code !== 0) {
		return response.error.code;
	}

	const { accessToken, refreshToken, expiration } = response.data;

	if (!accessToken || !refreshToken) {
		return response.error.code;
	}

	token.set({ accessToken, refreshToken, expiration });
	return 0;
}

/**
 * Log out the current user and clear all stored data
 */
export async function logOut(): Promise<void> {
	token.set(null);
	userCredentials.set(null);
	accountInfo.set(null);
	currentTrip.set(null);
	user.set(null);
	selectedStation.set(null);
	tripRating.set({ currentRating: null });
}

// Token refresh configuration
const MS_BETWEEN_REFRESH_ATTEMPTS = 2000;
const MAX_REFRESH_ATTEMPTS = 5;

/**
 * Refresh the authentication token
 */
export async function refreshToken(): Promise<boolean> {
	const networkStatus = await Network.getStatus();
	if (!networkStatus.connected) {
		return false;
	}

	const tokens = get(token);
	if (!tokens) {
		return false;
	}

	// Try refreshing the token
	for (let attempt = 0; attempt < MAX_REFRESH_ATTEMPTS; attempt++) {
		const creds = get(userCredentials);
		if (!creds) {
			return false;
		}

		const response = await getTokensRefresh(tokens);

		if (response.error && response.error.code === 0 && response.data.accessToken && response.data.refreshToken) {
			const { accessToken, refreshToken, expiration } = response.data;
			token.set({ accessToken, refreshToken, expiration });
			return true;
		}

		await new Promise((resolve) => setTimeout(resolve, MS_BETWEEN_REFRESH_ATTEMPTS));
	}

	// If refresh failed, try re-logging in
	for (let attempt = 0; attempt < MAX_REFRESH_ATTEMPTS; attempt++) {
		const creds = get(userCredentials);
		if (!creds) {
			return false;
		}

		const result = await login(creds.email, creds.password);

		if (result === 0) {
			return true;
		}

		await new Promise((resolve) => setTimeout(resolve, MS_BETWEEN_REFRESH_ATTEMPTS));
	}

	return false;
}

/**
 * Fetch and update user information from the API
 */
export async function updateUserInfo(): Promise<void> {
	const tokens = get(token);
	if (!tokens) {
		return;
	}

	const response = await getUserInfo(tokens);
	const { email, name } = response.data;
	user.set({ email, name });
}