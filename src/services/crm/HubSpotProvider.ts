import { ICrmProvider, CRMContact, CRMResponse } from "./types";
import { api } from "@/lib/api";

export class HubSpotProvider implements ICrmProvider {
  async createContact(contact: CRMContact): Promise<CRMResponse> {
    try {
        // Envia para BFF (Proxy) para não expor token do HubSpot no front
        // Inclui suporte a custom properties e Deals se necessário
        const response = await api.post("/crm/hubspot/contact", {
            ...contact,
            properties: {
                custom_source: "Prospector AI",
                lead_score: "50" // Exemplo de campo custom
            }
        });
        return response.data;
    } catch (error: any) {
        console.error("HubSpot Error:", error);
        // Tratamento de erro 409 (Duplicidade)
        if (error.response?.status === 409) {
            return { success: false, message: "Contato duplicado no HubSpot." };
        }
        return {
            success: false,
            message: error.response?.data?.message || "Failed to sync with HubSpot"
        };
    }
  }
}
