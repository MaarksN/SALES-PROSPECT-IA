import { IEnrichmentProvider } from "./types";
import { ClearbitProvider } from "./ClearbitProvider";

// Mock Fallback inteligente (Scraping simulado localmente se não houver chave)
class LocalFallbackProvider implements IEnrichmentProvider {
  async enrichCompany(domain: string) {
    // Simula delay de rede real
    await new Promise(r => setTimeout(r, 800));
    return {
      industry: "Simulated Real-Time Data",
      employees: "10-50",
      location: "Internet"
    };
  }
}

export function getEnrichmentProvider(): IEnrichmentProvider {
  const hasKey = !!import.meta.env.VITE_CLEARBIT_KEY;
  return hasKey ? new ClearbitProvider() : new LocalFallbackProvider();
}
