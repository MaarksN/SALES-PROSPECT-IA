import { ICrmProvider, CRMContact, CRMResponse } from "./types";
import { api } from "@/lib/api";

export class HubSpotProvider implements ICrmProvider {
  async createContact(contact: CRMContact): Promise<CRMResponse> {
    try {
        // Envia para BFF (Proxy) para não expor token do HubSpot no front
        const response = await api.post("/crm/hubspot/contact", contact);
        return response.data;
    } catch (error: any) {
        console.error("HubSpot Error:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to sync with HubSpot"
        };
    }
  }
}
