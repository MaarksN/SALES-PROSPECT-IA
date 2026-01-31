import { Lead } from "@/types";
import { env } from "@/env";
import axios from "axios";
import { toast } from "sonner";

interface CRMResponse {
  success: boolean;
  message: string;
  crmId?: string;
}

class CRMService {
  async syncToHubspot(lead: Lead): Promise<CRMResponse> {
    if (!env.VITE_HUBSPOT_TOKEN) {
        return { success: false, message: "Token do HubSpot não configurado no .env" };
    }

    try {
      // API Real do HubSpot
      const response = await axios.post(
        "https://api.hubapi.com/crm/v3/objects/contacts",
        {
          properties: {
            email: lead.email,
            firstname: lead.name.split(" ")[0],
            lastname: lead.name.split(" ").slice(1).join(" "),
            company: lead.company,
            jobtitle: lead.role,
            website: lead.linkedin
          }
        },
        {
          headers: {
            Authorization: `Bearer ${env.VITE_HUBSPOT_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );

      return {
        success: true,
        message: "Lead criado no HubSpot!",
        crmId: response.data.id
      };

    } catch (error: any) {
      console.error("HubSpot API Error:", error.response?.data || error.message);

      if (error.response?.status === 409) {
          return { success: false, message: "Este contato já existe no HubSpot." };
      }
      return { success: false, message: "Erro na API do HubSpot. Verifique o console." };
    }
  }

  // Pipedrive requer lógica similar, deixamos preparado
  async syncToPipedrive(lead: Lead): Promise<CRMResponse> {
    return { success: false, message: "Integração Pipedrive pendente de Token." };
  }
}

export const crmService = new CRMService();