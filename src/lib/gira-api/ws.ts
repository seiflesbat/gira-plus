import { token } from '$lib/account';
import { get } from 'svelte/store';
import type { WSEvent } from '$lib/gira-api/ws-types';
import { randomUUID } from '$lib/utils';
import { updateWithTripMessage, ingestStations } from '$lib/injest-api-data';
import { GIRA_WS_URL } from '$lib/constants';

let ws: WebSocket;
let backoff = 0;

/**
 * Initialize and start the WebSocket connection
 */
export function startWS(): void {
	console.debug('Starting WebSocket connection');

	const tokens = get(token);
	const accessToken = tokens?.accessToken;

	if (!accessToken) {
		console.debug('No access token available, skipping WS connection');
		return;
	}

	// Don't start if already connected or connecting
	if (ws) {
		if (ws.readyState === WebSocket.CONNECTING) return;
		if (ws.readyState === WebSocket.OPEN) return;
	}

	ws = new WebSocket(GIRA_WS_URL + '/graphql', 'graphql-ws');

	ws.onopen = () => {
		backoff = 0;
		console.debug('WebSocket connected');

		// Initialize connection
		const headers: Record<string, string> = {};

		ws.send(JSON.stringify({
			type: 'connection_init',
			payload: { headers },
		}));

		// Subscribe to active trip updates
		ws.send(JSON.stringify({
			type: 'start',
			id: randomUUID(),
			payload: {
				operationName: 'activeTripSubscription',
				query: `subscription activeTripSubscription($_access_token: String) {
					activeTripSubscription(_access_token: $_access_token) {
						code bike startDate endDate cost finished
						canPayWithMoney canUsePoints clientPoints tripPoints
						canceled period periodTime error
					}
				}`,
				variables: { _access_token: accessToken },
			},
		}));

		// Subscribe to station updates
		ws.send(JSON.stringify({
			type: 'start',
			id: randomUUID(),
			payload: {
				operationName: 'operationalStationsSubscription',
				query: `subscription operationalStationsSubscription {
					operationalStationsSubscription {
						assetCondition assetStatus assetType code description
						latitude longitude name bikes docks serialNumber stype
					}
				}`,
				variables: { _access_token: accessToken },
			},
		}));
	};

	ws.onmessage = (event: MessageEvent<string>) => {
		const eventData = JSON.parse(event.data) as WSEvent;
		console.debug('WebSocket message received', eventData);

		if (eventData.type === 'data' && eventData.payload?.data) {
			const { data } = eventData.payload;

			if (data.operationalStationsSubscription) {
				console.debug('Stations updated via WebSocket');
				ingestStations({ getStations: data.operationalStationsSubscription });
			} else if (data.activeTripSubscription) {
				updateWithTripMessage(data.activeTripSubscription);
			} else if (data.serverDate) {
				console.debug('Server time offset:', new Date(data.serverDate.date).getTime() - Date.now(), 'ms');
			}
		}
	};

	const restartWS = (): void => {
		setTimeout(() => {
			startWS();
			backoff += 1000;
		}, backoff);
	};

	ws.onclose = (e) => {
		console.debug('WebSocket closed', e);
		restartWS();
	};

	ws.onerror = (e) => {
		console.debug('WebSocket error', e);
		restartWS();
	};
}