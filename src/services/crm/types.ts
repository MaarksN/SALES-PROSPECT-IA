import { Lead } from "@/types";

export interface ICrmProvider {
  name: string;
  sendLead(lead: Lead): Promise<{ success: boolean; id?: string; message?: string }>;
}
