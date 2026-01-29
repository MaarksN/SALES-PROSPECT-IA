
import { create } from 'zustand';
import { Lead, DashboardStats, UserContext } from '../types';
import { leadService } from '../services/leadService';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface AppState {
    // Data
    leads: Lead[];
    isLoading: boolean;
    user: { email: string; name: string } | null; 
    credits: number; // SaaS Monetization
    
    // Actions
    fetchLeads: () => Promise<void>;
    addLead: (lead: Lead) => Promise<void>;
    addLeads: (leads: Lead[]) => Promise<void>;
    updateLead: (lead: Lead) => Promise<void>;
    login: (email: string) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
    decrementCredits: (amount?: number) => void;
    
    // UI State
    activeView: 'dashboard' | 'leads' | 'validation' | 'ailab' | 'tools' | 'birthub';
    setActiveView: (view: any) => void;
}

export const useStore = create<AppState>((set, get) => ({
    leads: [],
    isLoading: false,
    user: null, 
    credits: 50, // Default Free Plan
    activeView: 'dashboard',

    setActiveView: (view) => set({ activeView: view }),

    decrementCredits: (amount = 1) => {
        const current = get().credits;
        if (current >= amount) {
            set({ credits: current - amount });
        } else {
            toast.error("Créditos insuficientes! Faça o upgrade do plano.");
            throw new Error("LOW_CREDITS");
        }
    },

    checkSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            set({ user: { email: session.user.email!, name: session.user.email!.split('@')[0] } });
            get().fetchLeads();
        }

        // Setup Listener
        supabase.auth.onAuthStateChange((_event, session) => {
             if (session?.user) {
                 set({ user: { email: session.user.email!, name: session.user.email!.split('@')[0] } });
             } else {
                 set({ user: null, leads: [] });
             }
        });
    },

    login: async (email: string) => {
        try {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            toast.success("Verifique seu email para o link de acesso!");
        } catch (e: any) {
            // Fallback for demo without real Supabase backend connection
            if (e.message.includes("placeholder") || !process.env.VITE_SUPABASE_URL) {
                set({ user: { email, name: email.split('@')[0] }, credits: 50 });
                get().fetchLeads();
                toast.success("Login simulado (Modo Demo)");
            } else {
                toast.error(e.message);
            }
        }
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, leads: [] });
    },

    fetchLeads: async () => {
        set({ isLoading: true });
        try {
            const leads = await leadService.fetchLeads();
            set({ leads });
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar leads");
        } finally {
            set({ isLoading: false });
        }
    },

    addLead: async (lead: Lead) => {
        // Cost: 2 credits to find and add a lead
        try {
            get().decrementCredits(2);
            
            // Optimistic Update
            const currentLeads = get().leads;
            set({ leads: [lead, ...currentLeads] });

            try {
                await leadService.createLead(lead);
                toast.success("Lead salvo com sucesso!");
            } catch (error) {
                set({ leads: currentLeads });
                toast.error("Erro ao salvar lead");
            }
        } catch (e) {
            // Credit error handled in decrementCredits
        }
    },

    addLeads: async (leads: Lead[]) => {
        try {
            get().decrementCredits(leads.length * 2);

            const previousLeads = get().leads;
            // Optimistic Update
            set({ leads: [...leads, ...previousLeads] });

            try {
                await leadService.createLeads(leads);
                toast.success(`${leads.length} leads salvos com sucesso!`);
            } catch (error) {
                set({ leads: previousLeads });
                toast.error("Erro ao salvar leads");
            }
        } catch (e) {
            // Credit error handled in decrementCredits
        }
    },

    updateLead: async (lead: Lead) => {
        const currentLeads = get().leads;
        const updated = currentLeads.map(l => l.id === lead.id ? lead : l);
        set({ leads: updated });

        try {
            await leadService.updateLead(lead);
            toast.success("Lead atualizado!");
        } catch (error) {
            set({ leads: currentLeads });
            toast.error("Erro ao atualizar");
        }
    }
}));
