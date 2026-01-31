import { IEnrichmentProvider, EnrichedData } from "./types";
import axios from "axios";

export class ClearbitProvider implements IEnrichmentProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_CLEARBIT_KEY || "";
  }

  async enrichCompany(domain: string): Promise<EnrichedData> {
    if (!this.apiKey) {
      console.warn("Clearbit Key ausente. Retornando dados parciais.");
      return {};
    }

    try {
      // Endpoint de Autocomplete da Clearbit (Gratuito para testes limitados ou pago)
      // Ou usando a API de Enrichment via Proxy seguro
      const response = await axios.get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${domain}`);

      if (!response.data || response.data.length === 0) return {};

      const data = response.data[0];

      return {
        foundedYear: undefined, // Clearbit autocomplete não retorna ano, Enrichment pago sim
        employees: "N/A",
        industry: data.domain,
        location: data.name, // Simplificação
        logo: data.logo,
        linkedinUrl: undefined
      };
    } catch (error) {
      console.error("Erro Clearbit:", error);
      return {};
    }
  }
}
