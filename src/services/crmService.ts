import { crmService } from "./crm/CrmFactory";
import { Lead } from "@/types";
import { CRMContact } from "./crm/types";

// Mapper de Lead para CRMContact (Normalização)
function mapLeadToContact(lead: Lead): CRMContact {
  const [firstName, ...rest] = lead.name.split(" ");
  return {
    firstName: firstName || "",
    lastName: rest.join(" ") || "",
    email: lead.email || "",
    company: lead.company,
    jobTitle: lead.role,
    website: lead.linkedin,
    source: "prospector-v2"
  };
}

// Wrapper de alto nível com Auditoria
export const syncLead = async (lead: Lead) => {
    console.log(`[Audit] Syncing lead ${lead.id} to CRM...`);

    if (!lead.email) {
        return { success: false, message: "Lead sem email não pode ser sincronizado." };
    }

    const contact = mapLeadToContact(lead);
    const result = await crmService.createContact(contact);

    if (result.success) {
        console.log(`[Audit] Sync Success: ${result.crmId}`);
        // Aqui chamaria update de status no DB local
    } else {
        console.error(`[Audit] Sync Failed: ${result.message}`);
    }

    return result;
};
