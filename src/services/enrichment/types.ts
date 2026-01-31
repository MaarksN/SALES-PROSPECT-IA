export interface EnrichedData {
  foundedYear?: number;
  employees?: string;
  industry?: string;
  linkedinUrl?: string;
  location?: string;
  logo?: string;
  techStack?: string[];
}

export interface IEnrichmentProvider {
  enrichCompany(domain: string): Promise<EnrichedData>;
}
