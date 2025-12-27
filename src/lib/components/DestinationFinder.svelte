<script lang="ts">
    import {
        searchAddress,
        getCoordinates,
        calculateDistance,
        type NominatimResult,
    } from "$lib/geocoding";
    import {
        stations,
        selectedStation,
        highlightedStations,
    } from "$lib/map.svelte";
    import {
        IconMapPin,
        IconX,
        IconNavigation,
        IconHeart,
        IconHeartFilled,
        IconClock,
        IconTrash,
    } from "@tabler/icons-svelte";
    import { fade, fly } from "svelte/transition";
    import { t } from "$lib/translations";
    import { safeInsets } from "$lib/ui.svelte";
    import {
        savedAddresses,
        recentAddresses,
        saveAddress,
        removeSavedAddress,
        addToHistory,
        isAddressSaved,
        type SavedAddress,
        type RecentAddress,
    } from "$lib/addressStorage";

    interface Props {
        isOpen?: boolean;
        onFlyTo?: (lat: number, lng: number) => void;
    }

    let { isOpen = $bindable(false), onFlyTo }: Props = $props();
    let query = $state("");
    let suggestions = $state<NominatimResult[]>([]);
    let nearestStations = $state<
        {
            name: string;
            code: string;
            bikes: number;
            docks: number;
            distance: number;
            serialNumber: string;
            lat: number;
            lng: number;
        }[]
    >([]);
    let selectedLocation = $state<{
        lat: number;
        lng: number;
        displayName: string;
    } | null>(null);
    let isSearching = $state(false);
    let debounceTimer: ReturnType<typeof setTimeout>;
    let activeStationId = $state<string | null>(null);

    function handleInput() {
        clearTimeout(debounceTimer);
        nearestStations = [];
        selectedLocation = null;
        highlightedStations.set(new Set());

        if (query.length < 3) {
            suggestions = [];
            return;
        }

        isSearching = true;
        debounceTimer = setTimeout(async () => {
            suggestions = await searchAddress(query);
            isSearching = false;
        }, 400);
    }

    function selectAddress(result: NominatimResult) {
        const coords = getCoordinates(result);
        const shortName = result.display_name.split(",").slice(0, 2).join(", ");
        query = shortName;
        suggestions = [];
        selectedLocation = { ...coords, displayName: result.display_name };

        // Add to history
        addToHistory({
            displayName: result.display_name,
            shortName,
            lat: coords.lat,
            lng: coords.lng,
        });

        findNearestStations(coords);
    }

    function selectSavedOrRecent(address: SavedAddress | RecentAddress) {
        query = address.shortName;
        suggestions = [];
        selectedLocation = {
            lat: address.lat,
            lng: address.lng,
            displayName: address.displayName,
        };
        findNearestStations({ lat: address.lat, lng: address.lng });
    }

    function findNearestStations(coords: { lat: number; lng: number }) {
        const stationsWithDistance = stations.value
            .filter((s) => s.assetStatus === "active")
            .map((station) => ({
                name: station.name.split(/-|–/, 2)[1]?.trim() || station.name,
                code: station.name.split(/-|–/, 2)[0]?.trim() || "",
                bikes: station.bikes,
                docks: station.docks - station.bikes,
                serialNumber: station.serialNumber,
                lat: station.latitude,
                lng: station.longitude,
                distance: calculateDistance(
                    coords.lat,
                    coords.lng,
                    station.latitude,
                    station.longitude,
                ),
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);

        nearestStations = stationsWithDistance;
        highlightedStations.set(
            new Set(stationsWithDistance.map((s) => s.serialNumber)),
        );
    }

    function viewStation(station: (typeof nearestStations)[0]) {
        // Don't close sheet - just fly to station and highlight it
        activeStationId = station.serialNumber;
        selectedStation.set(station.serialNumber);
        if (onFlyTo) {
            onFlyTo(station.lat, station.lng);
        }
    }

    function toggleSaveAddress() {
        if (!selectedLocation) return;

        if (isAddressSaved(selectedLocation.lat, selectedLocation.lng)) {
            removeSavedAddress(selectedLocation.lat, selectedLocation.lng);
        } else {
            saveAddress({
                displayName: selectedLocation.displayName,
                shortName: query,
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
            });
        }
    }

    function formatDistance(meters: number): string {
        if (meters < 1000) return `${Math.round(meters)}m`;
        return `${(meters / 1000).toFixed(1)}km`;
    }

    function close() {
        isOpen = false;
        query = "";
        suggestions = [];
        nearestStations = [];
        selectedLocation = null;
        activeStationId = null;
        highlightedStations.set(new Set());
    }

    // Check if current address is saved
    let isCurrentSaved = $derived(
        selectedLocation
            ? isAddressSaved(selectedLocation.lat, selectedLocation.lng)
            : false,
    );

    // Show history/saved when empty
    let showSuggestions = $derived(query.length >= 3 && suggestions.length > 0);
    let showHistoryAndSaved = $derived(
        query.length < 3 && nearestStations.length === 0,
    );
</script>

<!-- Bottom Sheet Search Panel -->
{#if isOpen}
    <!-- Glassy Bottom Sheet -->
    <div
        class="fixed bottom-0 left-0 right-0 z-30 rounded-t-[28px] border-t border-white/20 glass-sheet"
        style:padding-bottom="{$safeInsets.bottom}px"
        style:max-height="65vh"
        transition:fly={{ y: 300, duration: 300 }}
    >
        <!-- Drag Handle -->
        <div class="flex justify-center py-3">
            <div class="w-10 h-1 bg-white/30 rounded-full"></div>
        </div>

        <!-- Search Header -->
        <div class="flex items-center gap-3 px-5 pb-4">
            <div class="flex-1 relative">
                <input
                    type="text"
                    bind:value={query}
                    oninput={handleInput}
                    placeholder={$t("search_destination") ||
                        "Search destination..."}
                    class="w-full rounded-2xl px-5 py-3.5 text-info placeholder:text-label/60 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-white/10 glass-input"
                />
                {#if isSearching}
                    <div class="absolute right-4 top-1/2 -translate-y-1/2">
                        <div
                            class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"
                        ></div>
                    </div>
                {/if}
            </div>
            <!-- Save address button -->
            {#if selectedLocation}
                <button
                    onclick={toggleSaveAddress}
                    class="p-2.5 rounded-xl transition-colors hover:bg-white/10 active:bg-white/20"
                    aria-label="Save address"
                >
                    {#if isCurrentSaved}
                        <IconHeartFilled size={22} class="text-red-500" />
                    {:else}
                        <IconHeart size={22} class="text-label" />
                    {/if}
                </button>
            {/if}
            <button
                onclick={close}
                class="p-2.5 rounded-xl transition-colors hover:bg-white/10 active:bg-white/20"
                aria-label="Close"
            >
                <IconX size={22} class="text-label" />
            </button>
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto px-4" style:max-height="calc(65vh - 120px)">
            <!-- Address suggestions from search -->
            {#if showSuggestions}
                <div class="space-y-1 pb-2">
                    {#each suggestions as result}
                        <button
                            onclick={() => selectAddress(result)}
                            class="w-full px-4 py-3 flex items-start gap-3 rounded-xl transition-colors hover:bg-white/8 active:bg-white/12 text-left glass-card"
                        >
                            <IconMapPin
                                size={18}
                                class="text-primary mt-0.5 shrink-0"
                            />
                            <span class="text-sm text-info line-clamp-2"
                                >{result.display_name}</span
                            >
                        </button>
                    {/each}
                </div>
            {/if}

            <!-- Saved Addresses & History (when empty) -->
            {#if showHistoryAndSaved}
                <!-- Saved Addresses -->
                {#if $savedAddresses.length > 0}
                    <div class="pb-4">
                        <h3
                            class="text-xs font-bold text-label/70 uppercase tracking-wider mb-2 px-1 flex items-center gap-1"
                        >
                            <IconHeartFilled size={12} class="text-red-400" />
                            Saved
                        </h3>
                        <div class="space-y-1">
                            {#each $savedAddresses as addr}
                                <div
                                    role="button"
                                    tabindex="0"
                                    onclick={() => selectSavedOrRecent(addr)}
                                    onkeypress={(e) =>
                                        e.key === "Enter" &&
                                        selectSavedOrRecent(addr)}
                                    class="w-full px-4 py-3 flex items-center gap-3 rounded-xl transition-colors hover:bg-white/8 active:bg-white/12 text-left glass-card cursor-pointer"
                                >
                                    <IconHeartFilled
                                        size={16}
                                        class="text-red-400 shrink-0"
                                    />
                                    <span
                                        class="text-sm text-info flex-1 line-clamp-1"
                                        >{addr.shortName}</span
                                    >
                                    <button
                                        onclick={(e) => {
                                            e.stopPropagation();
                                            removeSavedAddress(
                                                addr.lat,
                                                addr.lng,
                                            );
                                        }}
                                        class="p-1 rounded hover:bg-white/10"
                                        aria-label="Remove"
                                    >
                                        <IconTrash
                                            size={14}
                                            class="text-label/50"
                                        />
                                    </button>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- Recent Searches -->
                {#if $recentAddresses.length > 0}
                    <div class="pb-4">
                        <h3
                            class="text-xs font-bold text-label/70 uppercase tracking-wider mb-2 px-1 flex items-center gap-1"
                        >
                            <IconClock size={12} />
                            Recent
                        </h3>
                        <div class="space-y-1">
                            {#each $recentAddresses as addr}
                                <button
                                    onclick={() => selectSavedOrRecent(addr)}
                                    class="w-full px-4 py-3 flex items-center gap-3 rounded-xl transition-colors hover:bg-white/8 active:bg-white/12 text-left glass-card"
                                >
                                    <IconClock
                                        size={16}
                                        class="text-label/50 shrink-0"
                                    />
                                    <span
                                        class="text-sm text-info flex-1 line-clamp-1"
                                        >{addr.shortName}</span
                                    >
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- Empty state -->
                {#if $savedAddresses.length === 0 && $recentAddresses.length === 0}
                    <div
                        class="flex flex-col items-center justify-center py-10 text-center px-8"
                    >
                        <div
                            class="w-14 h-14 rounded-full flex items-center justify-center mb-3 glass-card"
                        >
                            <IconMapPin size={28} class="text-label/50" />
                        </div>
                        <p class="text-label/60 text-sm">
                            {$t("search_hint") ||
                                "Search for an address to find nearby stations"}
                        </p>
                    </div>
                {/if}
            {/if}

            <!-- Nearest stations -->
            {#if nearestStations.length > 0}
                <div class="pb-4">
                    <h3
                        class="text-xs font-bold text-label/70 uppercase tracking-wider mb-3 px-1"
                    >
                        {$t("nearest_stations") || "Nearest Stations"}
                    </h3>
                    <div class="space-y-2">
                        {#each nearestStations as station, i}
                            <button
                                onclick={() => viewStation(station)}
                                class="w-full rounded-2xl p-4 flex items-center justify-between transition-all hover:scale-[1.01] active:scale-[0.99] border glass-card {activeStationId ===
                                station.serialNumber
                                    ? 'border-primary/50 ring-2 ring-primary/20'
                                    : 'border-white/10'}"
                                style:animation="fadeIn 0.3s ease-out {i *
                                    0.05}s both"
                            >
                                <div class="text-left flex-1">
                                    <div
                                        class="text-sm font-medium text-info mb-0.5"
                                    >
                                        {station.name}
                                    </div>
                                    <div
                                        class="text-xs text-label/70 flex items-center gap-1"
                                    >
                                        <IconNavigation size={12} />
                                        {formatDistance(station.distance)}
                                    </div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <div class="text-center">
                                        <span
                                            class="text-lg font-bold text-green-400"
                                            >{station.bikes}</span
                                        >
                                        <span
                                            class="text-[10px] text-label/60 block uppercase"
                                            >bikes</span
                                        >
                                    </div>
                                    <div class="text-center">
                                        <span
                                            class="text-lg font-bold text-primary"
                                            >{station.docks}</span
                                        >
                                        <span
                                            class="text-[10px] text-label/60 block uppercase"
                                            >docks</span
                                        >
                                    </div>
                                </div>
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .glass-sheet {
        background: rgba(30, 30, 30, 0.92);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.4);
    }

    :global(.dark) .glass-sheet {
        background: rgba(20, 20, 20, 0.95);
    }

    :global(.light) .glass-sheet {
        background: rgba(255, 255, 255, 0.92);
    }

    .glass-input {
        background: rgba(255, 255, 255, 0.08);
    }

    :global(.light) .glass-input {
        background: rgba(0, 0, 0, 0.05);
    }

    .glass-card {
        background: rgba(255, 255, 255, 0.06);
    }

    :global(.light) .glass-card {
        background: rgba(0, 0, 0, 0.04);
    }
</style>
