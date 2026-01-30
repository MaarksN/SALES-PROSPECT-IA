import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid credentials (and not just placeholders/empty)
const isAuthEnabled = supabaseUrl && supabaseKey && !supabaseUrl.includes("placeholder");

let supabase;
if (isAuthEnabled) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Supabase Auth configured.");
  } catch (e) {
    console.warn("⚠️ Failed to initialize Supabase client:", e.message);
  }
} else {
  console.warn("⚠️ Supabase Credentials missing or placeholder. Running in DEMO MODE (No Auth enforcement).");
}

export const requireAuth = async (req, res, next) => {
  if (!isAuthEnabled || !supabase) {
    // Demo Mode: Mock user
    req.user = { id: "demo-user", email: "demo@example.com" };
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // In demo/dev mode, maybe we want to allow missing header too?
    // But if auth IS enabled, we should enforce it.
    return res.status(401).json({ error: "Token de acesso ausente." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ error: "Sessão inválida ou expirada." });
    }

    // Anexa o usuário à requisição para uso nas rotas
    req.user = user;
    next();
  } catch (err) {
    console.error("Erro na validação do token:", err);
    return res.status(500).json({ error: "Falha na autenticação interna." });
  }
};
