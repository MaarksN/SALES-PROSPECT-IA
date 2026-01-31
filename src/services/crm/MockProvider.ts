import { ICrmProvider } from "./types";
import { Lead } from "@/types";
import { toast } from "sonner";

export class MockProvider implements ICrmProvider {
  name = "MockCRM";

  async sendLead(lead: Lead) {
    await new Promise(r => setTimeout(r, 1000));
    toast.info(`[MOCK] Lead ${lead.name} sincronizado (Simulação).`);
    return { success: true, id: "mock_id", message: "Simulação OK" };
  }
}
