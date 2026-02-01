// Cache simples de sessão para evitar hits excessivos no Supabase Auth
const sessionCache = new Map(); // token -> { user, expiresAt }

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const isAuthEnabled = supabaseUrl && supabaseKey && !supabaseUrl.includes("placeholder");

let supabase;
if (isAuthEnabled) supabase = createClient(supabaseUrl, supabaseKey);

export const requireAuth = async (req, res, next) => {
  if (!isAuthEnabled) {
    req.user = { id: "demo-user", email: "demo@example.com" };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token required" });

  const token = authHeader.split(" ")[1];

  // Cache Lookup
  if (sessionCache.has(token)) {
      const cached = sessionCache.get(token);
      if (Date.now() < cached.expiresAt) {
          req.user = cached.user;
          return next();
      }
      sessionCache.delete(token);
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw new Error("Invalid Token");

    // Cache por 5 min
    sessionCache.set(token, { user, expiresAt: Date.now() + 5 * 60 * 1000 });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    // Erro genérico para segurança
    return res.status(401).json({ error: "Unauthorized" });
  }
};
