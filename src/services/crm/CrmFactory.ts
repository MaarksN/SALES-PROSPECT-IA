import { ICrmProvider } from "./types";
import { HubSpotProvider } from "./HubSpotProvider";
import { MockCrmProvider } from "./MockProvider";
import { env } from "@/env";

class CrmFactory {
  private static instance: ICrmProvider;

  static getProvider(): ICrmProvider {
    if (!this.instance) {
        if (env.VITE_ENABLE_REAL_CRM === "true" && env.VITE_HUBSPOT_TOKEN) {
            console.log("[CrmFactory] Initializing HubSpot Provider (Singleton)");
            this.instance = new HubSpotProvider();
        } else {
            console.log("[CrmFactory] Initializing Mock Provider (Singleton)");
            this.instance = new MockCrmProvider();
        }
    }
    return this.instance;
  }
}

export const crmService = CrmFactory.getProvider();
