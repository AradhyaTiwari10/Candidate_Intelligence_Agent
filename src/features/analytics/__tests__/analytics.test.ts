import { trackEvent, getAnalyticsEvents, clearAnalyticsEvents } from "../analytics";

export function runAnalyticsTests() {
  console.log("Running Analytics tests...");

  // Clear previous state
  clearAnalyticsEvents();

  // Test 1: clearAnalyticsEvents works and starts empty
  let events = getAnalyticsEvents();
  if (events.length !== 0) {
    throw new Error("[Analytics T1] Expected empty analytics on start");
  }

  // Test 2: trackEvent stores an event correctly
  trackEvent("test_event_1", { key: "value1" });
  events = getAnalyticsEvents();
  if (events.length !== 1) {
    throw new Error(`[Analytics T2] Expected 1 event, got ${events.length}`);
  }
  if (events[0].event !== "test_event_1") {
    throw new Error(`[Analytics T2] Expected test_event_1, got ${events[0].event}`);
  }
  if (events[0].payload?.key !== "value1") {
    throw new Error(`[Analytics T2] Payload mismatch: ${JSON.stringify(events[0].payload)}`);
  }

  // Test 3: Multiple events track and maintain order
  trackEvent("test_event_2");
  events = getAnalyticsEvents();
  if (events.length !== 2) {
    throw new Error(`[Analytics T3] Expected 2 events, got ${events.length}`);
  }
  if (events[1].event !== "test_event_2") {
    throw new Error("[Analytics T3] Ordering or key mismatch on second event");
  }

  // Test 4: clearAnalyticsEvents clears all events
  clearAnalyticsEvents();
  events = getAnalyticsEvents();
  if (events.length !== 0) {
    throw new Error("[Analytics T4] Expected empty events after clearAnalyticsEvents");
  }

  console.log("✓ Analytics tests passed.");
}
