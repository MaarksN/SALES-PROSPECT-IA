export interface EnrichmentData {
  revenue?: string;
  employees?: string;
  industry?: string;
  techStack?: string[];
  social?: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface EnrichmentProvider {
  enrichCompany(domain: string): Promise<EnrichmentData>;
}
