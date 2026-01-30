import { getEnrichmentProvider } from "./enrichment/EnrichmentFactory";
import { EnrichedData } from "./enrichment/types";

export const enrichmentService = {
  async enrichCompany(domain: string): Promise<EnrichedData> {
    const provider = getEnrichmentProvider();
    return await provider.enrichCompany(domain);
  }
};
