import {
  LayoutDashboard, Users, Zap, Settings, LogOut, Search, Target,
  Sparkles, Info, ChevronRight, Share2, ExternalLink,
  BrainCircuit, Database, Briefcase, FileText, MessageSquare,
  CheckCircle2, Bot, Terminal, Book, Calculator, Trello, PenTool,
  Download, Copy, Play, Filter, MapPin, Building2, Linkedin, Mail,
  User, X, Loader2, ArrowRight, TrendingUp, DollarSign, Activity,
  MoreHorizontal, Plus
} from "lucide-react";

export const Icons = {
  // Navigation
  Dashboard: LayoutDashboard,
  Leads: Users,
  PowerTools: Zap,
  Settings: Settings,
  Logout: LogOut,

  // Actions & UI
  Search: Search,
  Info: Info,
  ChevronRight: ChevronRight,
  Share: Share2,
  ExternalLink: ExternalLink,
  CheckCircle: CheckCircle2,
  Close: X,
  Spinner: Loader2,
  ArrowRight: ArrowRight,
  More: MoreHorizontal,
  Plus: Plus,
  Filter: Filter,
  Download: Download,
  Copy: Copy,
  Play: Play,

  // Domain Specific
  Target: Target,     // Onboarding DNA
  Sparkles: Sparkles, // AI Magic
  Bot: Bot,
  Lab: BrainCircuit,
  Database: Database,
  Business: Briefcase,
  Document: FileText,
  Chat: MessageSquare,
  Terminal: Terminal,
  Book: Book,
  Calculator: Calculator,
  Kanban: Trello,
  Pen: PenTool,

  // Dashboard Stats
  TrendingUp: TrendingUp,
  Dollar: DollarSign,
  Activity: Activity,

  // Lead Card
  MapPin: MapPin,
  Building: Building2,
  Linkedin: Linkedin,
  Mail: Mail,
  User: User
};

export const APP_CONFIG = {
  name: "Sales Prospector v2",
  version: "2.1.0",
  maxCreditsFree: 50,
  maxCreditsPro: 500,
  supportEmail: "suporte@prospector.com"
};