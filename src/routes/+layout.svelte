<script lang="ts">
	import { safeInsets } from "$lib/ui.svelte";
	import { appSettings } from "$lib/settings";
	import "@fontsource-variable/inter/index.css";
	import "@fontsource-variable/roboto-mono/index.css";
	import { onMount } from "svelte";
	import {
		StatusBar,
		Style,
		NavigationBar,
		ScreenOrientation,
	} from "$lib/plugin-stubs";
	import { SafeArea } from "capacitor-plugin-safe-area";
	import "../app.css";
	import { Capacitor } from "@capacitor/core";
	import { App } from "@capacitor/app";
	import { loadUserCreds, refreshToken, token } from "$lib/account";
	import { updateActiveTripInfo, updateStations } from "$lib/injest-api-data";
	import { loadSettings } from "$lib/settings";
	import { reportAppUsageEvent } from "$lib/gira-mais-api/gira-mais-api";
	import { watchPosition } from "$lib/location";
	import { loadFavorites } from "$lib/favorites";
	import {
		initPrediction,
		collectAllStations,
		forceSavePatterns,
	} from "$lib/prediction";
	import { initOfflineCache, cacheStations } from "$lib/offlineCache";
	import { initAddressStorage } from "$lib/addressStorage";
	import { stations } from "$lib/map.svelte";

	interface Props {
		children?: import("svelte").Snippet;
	}

	let { children }: Props = $props();
	import { theme } from "$lib/theme";

	if (
		Capacitor.getPlatform() === "android" ||
		Capacitor.getPlatform() === "ios"
	) {
		StatusBar.setOverlaysWebView({ overlay: true });
		NavigationBar.setTransparency({ isTransparent: true });
		SafeArea.getSafeAreaInsets().then((ins) => {
			safeInsets.set(ins.insets);
		});
	}

	onMount(() => {
		// Initialize core services
		loadUserCreds();
		loadFavorites();
		initPrediction();
		initOfflineCache();
		initAddressStorage();

		loadSettings().then(() => {
			reportAppUsageEvent();
			appSettings.subscribe(() => {
				watchPosition();
			});
		});

		// Collect prediction data and cache when stations update
		$effect(() => {
			if (stations.value.length > 0) {
				collectAllStations(stations.value);
				cacheStations(stations.value);
			}
		});

		App.addListener("resume", async () => {
			if ($token != null && $token.refreshToken != null) {
				console.debug("Refreshing token because app was reopened");
				await refreshToken();
			}
			updateActiveTripInfo();
			updateStations();
		});

		// Save prediction patterns when app goes to background
		App.addListener("pause", () => {
			forceSavePatterns();
		});

		theme.subscribe((currentTheme) => {
			if (!currentTheme) return;
			document.documentElement.setAttribute("data-theme", currentTheme);
			if (
				Capacitor.getPlatform() === "android" ||
				Capacitor.getPlatform() === "ios"
			) {
				StatusBar.setStyle({
					style: currentTheme === "dark" ? Style.Dark : Style.Light,
				});
			}
		});

		ScreenOrientation.lock({ orientation: "portrait" });

		return () => {
			forceSavePatterns();
			App.removeAllListeners();
		};
	});
</script>

{#if $appSettings?.theme}
	<div class="w-screen h-screen font-sans">
		{@render children?.()}
	</div>
{/if}
