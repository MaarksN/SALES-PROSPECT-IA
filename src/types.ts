export interface Lead {
  id: string;
  company: string;
  role: string;
  name: string;
  email?: string;
  linkedin?: string;
  score: number;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  fit_reason?: string;
  last_contact?: string;
  location?: string;
  revenue?: string;
  employees?: string;
  createdAt: string;
}

export interface UserContext {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  myCompany?: string;
  myProduct?: string;
  role?: string;
  credits: number;
  plan: "free" | "pro" | "enterprise";
  onboardingCompleted: boolean;
  preferences: {
    theme: "light" | "dark" | "system";
    language: "pt" | "en";
  };
}

export interface DashboardStats {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  creditsUsed: number;
}
