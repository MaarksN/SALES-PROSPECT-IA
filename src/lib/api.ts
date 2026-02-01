import axios, { AxiosRequestConfig } from "axios";
import { env } from "@/env";
import { createClient } from "@supabase/supabase-js";

// Cache simples em memória para GETs
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de Request: Auth & Cache Check
api.interceptors.request.use(async (config) => {
  // 1. Auth Injection
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      config.headers.Authorization = `Bearer ${data.session.access_token}`;
    }
  } catch (e) {
    // Ignore auth error in demo mode
  }

  // 2. Cache Return (cancel request if cached)
  if (config.method === 'get' && config.headers?.['X-Use-Cache']) {
      const key = config.url + JSON.stringify(config.params);
      const cached = cache.get(key);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          // Usamos AbortController para cancelar o request real e retornar mock
          const controller = new AbortController();
          config.signal = controller.signal;
          controller.abort(JSON.stringify({ __cached_data: cached.data }));
      }
  }

  return config;
}, error => Promise.reject(error));

// Interceptor de Response: Cache Set & Retry Logic
api.interceptors.response.use(
  (response) => {
    // Save to cache if enabled
    if (response.config.method === 'get' && response.config.headers?.['X-Use-Cache']) {
        const key = response.config.url + JSON.stringify(response.config.params);
        cache.set(key, { data: response.data, timestamp: Date.now() });
    }
    return response;
  },
  async (error) => {
    // Handle Cache Hit via Abort
    if (axios.isCancel(error) && error.message.startsWith('{ "__cached_data":')) {
        const cached = JSON.parse(error.message);
        return { data: cached.__cached_data, status: 200, statusText: "OK (Cached)", headers: {}, config: {} };
    }

    // Exponential Backoff Retry for 5xx
    const config = error.config;
    if (!config || !config.retry) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;

    if (config.__retryCount >= config.retry) {
        return Promise.reject(error);
    }

    config.__retryCount += 1;
    const backoff = new Promise(resolve => {
        setTimeout(() => resolve(true), Math.pow(2, config.__retryCount) * 1000);
    });

    await backoff;
    return api(config);
  }
);
