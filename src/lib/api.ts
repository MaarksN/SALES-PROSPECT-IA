import axios from "axios";
import { env } from "@/env";
import { createClient } from "@supabase/supabase-js";

// Instância única do Supabase para pegar tokens
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Injeta o Token automaticamente
api.interceptors.request.use(async (config) => {
  try {
    const { data } = await supabase.auth.getSession();

    if (data.session?.access_token) {
      config.headers.Authorization = `Bearer ${data.session.access_token}`;
    }
  } catch (e) {
    // In case of network error or misconfiguration (Demo Mode), proceed without token
    // The backend will handle it (allow if in Demo Mode, reject if not)
    // console.warn("Supabase auth check failed:", e);
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor: Trata erros globais (401, 403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Opcional: Forçar logout ou redirecionar
      // console.warn("Sessão expirada. Redirecionando para login...");
      // window.location.href = "/login"; // Ajuste conforme sua rota
    }
    return Promise.reject(error);
  }
);
