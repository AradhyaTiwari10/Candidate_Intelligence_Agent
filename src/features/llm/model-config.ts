export const MODEL_CONFIG = {
  PRIMARY_MODEL: "llama-3.3-70b-versatile",
  FALLBACK_MODEL: "llama-3.1-8b-instant",
  TEMPERATURE: 0.7,
  MAX_TOKENS: 512,
  TIMEOUT_MS: 15000,
  MAX_RETRIES: 3,
} as const;
