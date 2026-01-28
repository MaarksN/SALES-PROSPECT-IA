import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Inicializa o estado lendo do localStorage ou usando o valor inicial
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error('Erro ao ler localStorage:', error);
      return initialValue;
    }
  });

  // Atualiza o localStorage sempre que o estado mudar
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Erro ao salvar localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}