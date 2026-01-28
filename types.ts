
export type LeadStatus = 'new' | 'qualifying' | 'contacted' | 'negotiation' | 'won' | 'lost';

export interface LeadLog {
  timestamp: string;
  message: string;
}

export interface DecisionMaker {
  name: string;
  role: string;
  linkedin?: string;
}

export interface Competitor {
  name: string;
  strength: string;
}

export interface ProspectingStep {
  day: number;
  channel: 'email' | 'linkedin' | 'phone';
  subject?: string;
  content: string;
}

export interface SalesKit {
  valueProposition: string;
  emailSubject: string;
  emailBody: string;
  phoneScript: string;
  cadence: ProspectingStep[];
  objectionHandling: { objection: string; response: string }[];
}

export interface ScoringBreakdown {
  tech_fit: number;
  market_timing: number;
  budget_potential: number;
  data_confidence: number;
}

export interface Lead {
  id: string;
  companyName: string;
  cnpj?: string;
  sector?: string;
  location?: string;
  address?: string;
  email?: string;
  website?: string;
  phone?: string;
  
  status: LeadStatus;
  score: number;
  scoringBreakdown?: ScoringBreakdown;
  
  revenueEstimate?: string;
  
  createdAt: string;
  lastContactAt?: string;
  
  tags: string[];
  
  logs?: LeadLog[];
  isFavorite?: boolean;
  archived?: boolean;
  notes?: string;
  
  techStack?: string[];
  instagram?: string;
  linkedinUrl?: string;
  employees?: number;
  cnae?: string;
  
  decisionMakers?: DecisionMaker[];
  competitors?: Competitor[];
  salesKit?: SalesKit;
  
  matchReason?: string;
  lastInteraction?: string;
  
  // New CRM Sync Status
  crmSync?: {
      status: 'synced' | 'failed' | 'pending';
      lastSync: string;
      crmId?: string;
      platform?: 'HubSpot' | 'Salesforce' | 'Pipedrive';
  };
}

export interface DashboardStats {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  projectedRevenue: number;
}

// === NEW TYPES FOR SALES TOOLS & AI ===

export type ToolCategory = 'prospecting' | 'enrichment' | 'copywriting' | 'strategy' | 'closing';

export interface ToolInput {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  options?: string[];
  placeholder?: string;
}

export type AIToolInput = ToolInput;

export interface AIToolConfig {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  inputs: ToolInput[];
  promptTemplate: string;
  systemRole?: string;
  outputFormat?: 'json' | 'markdown' | 'text';
  outputSchema?: Record<string, string>; // Simplified schema definition (e.g. { script: "string", list: "array" })
}

export interface UserContext {
  myCompany: string;
  myRole: string;
  myProduct: string;
  toneOfVoice: 'Formal' | 'Consultivo' | 'Agressivo/Closer' | 'Amigável/Casual';
  targetAudience: string;
}

export interface SavedGen {
  id: string;
  toolId: string;
  toolName: string;
  timestamp: string;
  inputs: Record<string, string>;
  output: string;
  isFavorite: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

// === BIRTHUB AI v2.1 OFFICIAL SCHEMA ===

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface BirthubDossier {
  company: {
    legal_name: string | null;
    trade_name: string | null;
    cnpj: string | null;
    industry: string | null;
    business_model: 'B2B' | 'B2C' | 'Marketplace' | null;
    maturity_level: 'Early' | 'Growth' | 'Enterprise' | null;
    employee_range: string | null;
    website: string | null;
    linkedin_company: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
  };
  digital_presence: {
    website_active: boolean;
    linkedin_active: boolean;
    other_channels: string[];
  };
  decision_maker: {
    name: string | null;
    role: string | null;
    linkedin_profile: string | null;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
  };
  technology: {
    detected_stack: string[];
    crm: string | null;
    marketing_tools: string[];
    sales_tools: string[];
  };
  signals: {
    hiring_sales: boolean;
    hiring_marketing: boolean;
    recent_funding: boolean;
    expansion_signals: string[];
  };
  scoring: {
    total_score: number;
    breakdown: {
      tech_fit: number;
      market_timing: number;
      budget_potential: number;
      data_confidence: number;
    };
    reasoning: string;
  };
  decision: {
    status: 'APPROVED' | 'REJECTED' | 'REVIEW_NEEDED';
    confidence_level: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  outreach: {
    recommended_channel: 'EMAIL' | 'WHATSAPP' | 'LINKEDIN' | 'NONE';
    subject: string | null;
    message: string | null;
  };
}

export interface BirthubAnalysisResult {
  dossier: BirthubDossier;
  sources: GroundingSource[];
}
