
import { Lead } from '../types';

export const autopilotService = {
    async queueWarmUpEmail(lead: Lead): Promise<boolean> {
        console.log(`[Autopilot] Queuing warm-up email for ${lead.email}...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }
};
