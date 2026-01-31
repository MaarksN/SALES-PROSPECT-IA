import { z } from "zod";

const envSchema = z.object({
<<<<<<< HEAD
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
=======
  VITE_SUPABASE_URL: z.string().url().optional().or(z.literal('')),
  VITE_SUPABASE_ANON_KEY: z.string().optional().or(z.literal('')),
  GEMINI_API_KEY: z.string().optional(), // Often in .env but not exposed to client in BFF mode
  VITE_APP_NAME: z.string().optional().default('Sales Prospector AI'),
  SENTRY_DSN: z.string().url().optional(),
});

// Helper to check env in browser vs node (since we have a mix)
const getEnv = () => {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env;
    }
    return process.env;
};

// Safe parse to avoid crashing app on missing optional envs
const _env = envSchema.safeParse(getEnv());

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
}

export const env = _env.success ? _env.data : {
    VITE_SUPABASE_URL: '',
    VITE_SUPABASE_ANON_KEY: '',
    GEMINI_API_KEY: '',
    VITE_APP_NAME: 'Sales Prospector AI',
    SENTRY_DSN: undefined,
};
>>>>>>> main
