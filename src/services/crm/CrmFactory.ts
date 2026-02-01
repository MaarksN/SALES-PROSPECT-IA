import { ICrmProvider, CRMContact } from "./types";
import { HubSpotProvider } from "./HubSpotProvider";
import { MockCrmProvider } from "./MockProvider";
import { env } from "@/env";

class CrmFactory {
  static getProvider(): ICrmProvider {
    if (env.VITE_ENABLE_REAL_CRM === "true" && env.VITE_HUBSPOT_TOKEN) {
        return new HubSpotProvider();
    }
    return new MockCrmProvider();
  }
}

export const crmService = CrmFactory.getProvider();
