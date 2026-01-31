import { ICrmProvider } from "./types";
import { HubSpotProvider } from "./HubSpotProvider";
import { MockProvider } from "./MockProvider";

export function getCrmProvider(): ICrmProvider {
  // Para ativar o HubSpot real, defina VITE_ENABLE_REAL_CRM=true no .env
  const useRealCrm = import.meta.env.VITE_ENABLE_REAL_CRM === "true";

  return useRealCrm ? new HubSpotProvider() : new MockProvider();
}
