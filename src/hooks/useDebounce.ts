import { useEffect, useState } from "react";

/**
 * Hook para evitar chamadas excessivas (ex: busca enquanto digita)
 * @param value Valor a ser observado
 * @param delay Tempo de espera em ms
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura o timer
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar antes do delay (cancelamento)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}