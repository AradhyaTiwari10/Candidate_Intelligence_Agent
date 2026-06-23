export interface AnalyticsEvent {
  event: string;
  timestamp: number;
  payload?: Record<string, unknown>;
}

const STORAGE_KEY = "analyticsEvents";

// In-memory fallback for environments without localStorage (e.g. Node SSR)
let memoryEvents: AnalyticsEvent[] = [];

function isStorageAvailable(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function trackEvent(event: string, payload?: Record<string, unknown>): void {
  const newEvent: AnalyticsEvent = {
    event,
    timestamp: Date.now(),
    payload,
  };

  if (isStorageAvailable()) {
    try {
      const existing = getAnalyticsEvents();
      existing.push(newEvent);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (err) {
      console.error("Failed to write to localStorage:", err);
      memoryEvents.push(newEvent);
    }
  } else {
    memoryEvents.push(newEvent);
  }
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  if (isStorageAvailable()) {
    try {
      const data = window.localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error("Failed to read from localStorage:", err);
      return memoryEvents;
    }
  }
  return memoryEvents;
}

export function clearAnalyticsEvents(): void {
  memoryEvents = [];
  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Failed to remove from localStorage:", err);
    }
  }
}
