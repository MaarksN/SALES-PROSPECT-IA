export interface CRMContact {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  phone?: string;
  source: "prospector-v2";
}

export interface CRMResponse {
  success: boolean;
  crmId?: string;
  message: string;
}

export interface ICrmProvider {
  createContact(contact: CRMContact): Promise<CRMResponse>;
}
