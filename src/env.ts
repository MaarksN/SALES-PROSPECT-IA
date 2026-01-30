import { z } from "zod";

const envSchema = z.object({
  // Core
  VITE_SUPABASE_URL: z.string().optional().default("https://placeholder.supabase.co"),
  VITE_SUPABASE_ANON_KEY: z.string().optional().default("placeholder"),
  VITE_API_URL: z.string().url().default("http://localhost:3001"),

  // Feature Flags & Tokens
  VITE_ENABLE_REAL_CRM: z.enum(["true", "false"]).default("false"),
  VITE_HUBSPOT_TOKEN: z.string().optional(),
  VITE_CLEARBIT_KEY: z.string().optional(),
});

export const env = envSchema.parse(import.meta.env);
