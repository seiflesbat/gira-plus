<script lang="ts">
	import Floating from "$lib/components/Floating.svelte";
	import LocationButton from "$lib/components/LocationButton.svelte";
	import Login from "$lib/components/Login.svelte";
	import Map from "$lib/components/Map.svelte";
	import ProfileButton from "$lib/components/ProfileButton.svelte";
	import Profile from "$lib/components/Profile.svelte";
	import StationMenu from "$lib/components/StationMenu.svelte";
	import TripStatus from "$lib/components/TripStatus.svelte";
	import TripRating from "$lib/components/TripRating.svelte";
	import { currentTrip, tripRating } from "$lib/trip";
	import { following, selectedStation } from "$lib/map.svelte";
	import { safeInsets } from "$lib/ui.svelte";
	import { Geolocation } from "@capacitor/geolocation";
	import "maplibre-gl/dist/maplibre-gl.css";
	import { fade } from "svelte/transition";
	import { watchPosition } from "$lib/location";
	import { onMount } from "svelte";
	import Compass from "$lib/components/Compass.svelte";
	import ErrorMessage from "$lib/components/ErrorMessage.svelte";
	import { App } from "@capacitor/app";
	import { token } from "$lib/account";
	import type { PluginListenerHandle } from "@capacitor/core";
	import InfoDialog from "$lib/components/InfoDialog.svelte";
	import SupportButton from "$lib/components/SupportButton.svelte";
	import NetworkWarning from "$lib/components/NetworkWarning.svelte";
	import { networkStatus } from "$lib/network";
	import Dialog from "$lib/components/Dialog.svelte";
	import DestinationFinder from "$lib/components/DestinationFinder.svelte";

	let backListener: PluginListenerHandle;
	let menuHeight = $state(0);
	let stationMenuPos: number | undefined = $state(0);
	let tripStatusHeight: number = $state(0);
	let tripStatusWidth: number = $state(0);
	let profileOpen = $state(false);
	let destinationFinderOpen = $state(false);
	let locationPermission = $state(false);
	let flyToCoords: (lat: number, lng: number) => void = () => {};

	onMount(() => {
		(async () => {
			Geolocation.checkPermissions().then(({ location }) => {
				locationPermission = location == "granted";
				setTimeout(() => {
					if (locationPermission) {
						$following = true;
						currentTrip.subscribe((trip) => {
							if (trip === null) watchPosition();
						});
					}
				}, 500);
			});

			App.addListener("backButton", () => {
				if (!profileOpen) {
					if ($selectedStation != null) {
						$selectedStation = null;
					} else {
						App.exitApp();
					}
				}
			}).then((l) => (backListener = l));
		})();

		return () => backListener?.remove();
	});
</script>

<div class="h-full w-full relative overflow-hidden">
	{#if $token === null}
		<div
			transition:fade={{ duration: 150 }}
			class="absolute w-full h-full z-20 flex items-center justify-center"
		>
			<Login />
		</div>
	{/if}
	<Map
		loading={!$token}
		bind:bottomPadding={menuHeight}
		bind:topPadding={tripStatusHeight}
		bind:leftPadding={tripStatusWidth}
		bind:flyToCoords
	/>

	{#if $currentTrip !== null}
		<TripStatus
			bind:height={tripStatusHeight}
			bind:width={tripStatusWidth}
		/>
	{:else}
		<StationMenu
			bind:posTop={stationMenuPos}
			bind:bikeListHeight={menuHeight}
		/>
		{#if $tripRating.currentRating != null && $networkStatus}
			<TripRating
				tripCode={$tripRating.currentRating.code}
				bikePlate={$tripRating.currentRating.bikePlate}
				date={$tripRating.currentRating.endDate}
			/>
		{/if}
	{/if}

	{#if !$networkStatus}
		<NetworkWarning {tripStatusHeight} {tripStatusWidth} />
	{/if}

	<Floating right={20} y={stationMenuPos} bottom offset={20}>
		<div class="flex gap-3">
			<!-- Destination Finder Button -->
			<button
				class="bg-background dark:bg-background-secondary p-2 rounded-full w-12 h-12 flex items-center justify-center active:bg-background dark:active:bg-background-tertiary transition-colors"
				style:box-shadow="0px 0px 20px 0px var(--color-shadow)"
				onclick={() => (destinationFinderOpen = true)}
				aria-label="Find destination"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="text-primary"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					fill="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path
						d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"
					/>
				</svg>
			</button>
			<LocationButton bind:locationPermission />
		</div>
	</Floating>

	<Floating right={16} y={tripStatusHeight} offset={16}>
		<ProfileButton onclick={() => (profileOpen = true)} />
	</Floating>

	<Floating
		right={20}
		y={Math.max(tripStatusHeight + 16, $safeInsets.top)}
		offset={70}
	>
		<Compass />
	</Floating>

	<Floating left={tripStatusWidth + 20} y={tripStatusHeight} offset={20}>
		<SupportButton />
	</Floating>

	{#if profileOpen}
		<Profile onclose={() => (profileOpen = false)} />
	{/if}
	<Dialog />
	<DestinationFinder
		bind:isOpen={destinationFinderOpen}
		onFlyTo={flyToCoords}
	/>
</div>

<InfoDialog />
<ErrorMessage />
