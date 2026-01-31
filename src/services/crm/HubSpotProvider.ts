import { ICrmProvider } from "./types";
import { Lead } from "@/types";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export class HubSpotProvider implements ICrmProvider {
  name = "HubSpot";
  private apiKey: string;
  private baseUrl = "https://api.hubapi.com/crm/v3/objects/contacts";

  constructor() {
    // A chave deve vir do .env do Frontend (Vite)
    // Em produção real, idealmente isso passaria pelo Backend (BFF),
    // mas para o padrão Provider atual, faremos direto com aviso de segurança ou via Proxy.
    // Para manter a arquitetura 10/10 de segurança, o correto é o Frontend chamar o Backend,
    // mas aqui implementaremos a lógica cliente-side para demonstração da API real,
    // assumindo que VITE_HUBSPOT_TOKEN é restrito ou que migraremos para o BFF.
    this.apiKey = import.meta.env.VITE_HUBSPOT_TOKEN || "";
  }

  async sendLead(lead: Lead) {
    if (!this.apiKey) {
      console.error("HubSpot Token não configurado.");
      return { success: false, message: "Erro de Configuração (Token)" };
    }

    try {
      console.log("Enviando lead para HubSpot Real...");

      // Mapeamento de campos (Sales Prospector -> HubSpot)
      const [firstName, ...rest] = lead.name.split(" ");
      const lastName = rest.join(" ");

      const payload = {
        properties: {
          email: lead.email || "",
          firstname: firstName,
          lastname: lastName,
          company: lead.company,
          jobtitle: lead.role,
          website: lead.linkedin || "",
          lifecyclestage: "lead"
        }
      };

      const response = await axios.post(this.baseUrl, payload, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });

      return {
        success: true,
        id: response.data.id,
        message: "Lead criado no HubSpot com sucesso!"
      };

    } catch (error) {
      const err = error as AxiosError;
      console.error("Erro HubSpot:", err.response?.data);

      if (err.response?.status === 409) {
        return { success: true, message: "Lead já existe no HubSpot (Deduplicado)." };
      }

      return {
        success: false,
        message: "Falha na integração com HubSpot."
      };
    }
  }
}
