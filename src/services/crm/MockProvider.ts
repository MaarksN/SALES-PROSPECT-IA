import { ICrmProvider, CRMContact, CRMResponse } from "./types";

export class MockCrmProvider implements ICrmProvider {
  private localQueue: CRMContact[] = [];

  async createContact(contact: CRMContact): Promise<CRMResponse> {
    console.log("[CRM Mock] Queuing contact locally:", contact.email);
    this.localQueue.push(contact);

    // Simula delay e sucesso
    await new Promise(r => setTimeout(r, 600));

    return {
        success: true,
        crmId: `mock_${Date.now()}`,
        message: "Contact synced to Mock CRM"
    };
  }
}
