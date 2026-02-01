import { EnrichmentProvider } from "./types";
import { ClearbitProvider, MockEnrichmentProvider } from "./ClearbitProvider";
import { env } from "@/env";

class EnrichmentFactory {
  static getProvider(): EnrichmentProvider {
    // Audit decision log
    const useRealProvider = env.VITE_ENABLE_REAL_CRM === "true" && !!env.VITE_CLEARBIT_KEY;

    if (useRealProvider) {
      console.debug("[EnrichmentFactory] Using Real Provider (Clearbit)");
      return new ClearbitProvider();
    }

    console.debug("[EnrichmentFactory] Using Mock Provider (Dev Mode or Missing Keys)");
    return new MockEnrichmentProvider();
  }
}

export const enrichmentService = EnrichmentFactory.getProvider();
