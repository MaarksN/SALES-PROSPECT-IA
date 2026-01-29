
import { Lead } from '../types';

export const crmService = {
    async exportToHubSpot(lead: Lead): Promise<boolean> {
        console.log(`[CRM] Exporting ${lead.companyName} to HubSpot...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
        return true;
    },

    async exportToPipedrive(lead: Lead): Promise<boolean> {
        console.log(`[CRM] Exporting ${lead.companyName} to Pipedrive...`);
        await new Promise(resolve => setTimeout(resolve, 800));
        return true;
    },

    async exportToRDStation(lead: Lead): Promise<boolean> {
        console.log(`[CRM] Exporting ${lead.companyName} to RD Station...`);
        await new Promise(resolve => setTimeout(resolve, 1200));
        return true;
    }
};
