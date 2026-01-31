import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes Tailwind de forma inteligente (evita conflitos px-2 vs px-4)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata moeda BRL (R$ 1.230,00)
 */
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Formata data curta (30/01/2026)
 */
export function formatDate(dateString: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(dateString));
}

/**
 * Helper para simular delay de API (apenas dev)
 */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Trunca texto longo (Ex: "Empresa de Logís...")
 */
export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}