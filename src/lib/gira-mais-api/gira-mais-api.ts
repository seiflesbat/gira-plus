/**
 * Gira++ API Stubs
 * 
 * These functions previously sent telemetry to the original developer's server.
 * They have been replaced with no-op stubs for privacy.
 * The app no longer phones home to any external servers.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function reportAppUsageEvent(): Promise<void> {
    // No-op: telemetry disabled for privacy
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function reportTripStartEvent(
    _bikeSerial: string | null,
    _stationSerial: string | null
): Promise<void> {
    // No-op: telemetry disabled for privacy
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function reportErrorEvent(
    _errorCode: string,
    _errorMessage: string | null = null
): Promise<void> {
    // No-op: telemetry disabled for privacy
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getMessage(): Promise<null> {
    // No-op: remote messaging disabled for privacy
    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function postBikeRating(
    _tripCode: string,
    _bikePlate: string,
    _rating: number,
    _timestamp?: string
): Promise<void> {
    // No-op: telemetry disabled for privacy
}