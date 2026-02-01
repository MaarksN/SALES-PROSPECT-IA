import { z } from "zod";

const envSchema = z.object({
  // Core
  VITE_SUPABASE_URL: z.string().optional().default("https://placeholder.supabase.co"),
  VITE_SUPABASE_ANON_KEY: z.string().optional().default("placeholder"),
  VITE_API_URL: z.string().url().default("http://localhost:3001"),

  // App Info
  VITE_APP_NAME: z.string().default("Sales Prospector v2"),

  // Feature Flags & Tokens
  VITE_ENABLE_REAL_CRM: z.enum(["true", "false"]).default("false"),
  VITE_HUBSPOT_TOKEN: z.string().optional(),
  VITE_CLEARBIT_KEY: z.string().optional(),

  // Observability
  VITE_SENTRY_DSN: z.string().optional(),

  // Mode
  MODE: z.enum(["development", "production", "test"]).default("development"),
  PROD: z.boolean().default(false),
  DEV: z.boolean().default(true),
});

const _env = envSchema.parse({
    ...import.meta.env,
    // Add computed properties or fallbacks if necessary
});

export const env = {
    ..._env,
    IS_PROD: _env.PROD, // Alias conveniente
    // Mascarar segredos (apenas exemplo, keys públicas como anon_key são visíveis no client-side)
    getMaskedKey: (key: string) => key ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}` : 'N/A'
};
