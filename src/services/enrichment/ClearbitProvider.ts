import { EnrichmentProvider, EnrichmentData } from "./types";
import { env } from "@/env";
import { api } from "@/lib/api";

export class ClearbitProvider implements EnrichmentProvider {
  async enrichCompany(domain: string): Promise<EnrichmentData> {
    if (!env.VITE_CLEARBIT_KEY) {
        throw new Error("Clearbit API Key missing");
    }

    // Proxy via backend to secure key
    const response = await api.post("/enrichment/clearbit", { domain });
    return response.data;
  }
}

export class MockEnrichmentProvider implements EnrichmentProvider {
  async enrichCompany(domain: string): Promise<EnrichmentData> {
    console.log(`[Enrichment Mock] Enriching ${domain}...`);
    await new Promise(r => setTimeout(r, 800)); // Delay realista

    return {
        revenue: "$10M - $50M",
        employees: "50-200",
        industry: "SaaS",
        techStack: ["AWS", "React", "HubSpot"],
        social: {
            linkedin: `https://linkedin.com/company/${domain.split('.')[0]}`
        }
    };
  }
}
