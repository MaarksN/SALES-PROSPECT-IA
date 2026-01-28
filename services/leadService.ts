
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Lead } from '../types';

/**
 * LEAD SERVICE LAYER
 * Abstrai a fonte de dados. Se o Supabase estiver configurado, usa Postgres.
 * Se não, usa LocalStorage simulando chamadas assíncronas de banco.
 */

const LOCAL_STORAGE_KEY = 'sales_prospector_leads';

// Simula delay de rede para UX realista
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const leadService = {
    
    async fetchLeads(): Promise<Lead[]> {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data as any; // Mapping types would go here
        } else {
            // Fallback Local
            await delay(500);
            const data = localStorage.getItem(LOCAL_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        }
    },

    async createLead(lead: Lead): Promise<Lead> {
        if (isSupabaseConfigured()) {
            // Remove ID to let DB generate UUID if needed, or pass it if client-generated
            const { data, error } = await supabase
                .from('leads')
                .insert([lead])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } else {
            await delay(300);
            const leads = await this.fetchLeads();
            const newLeads = [lead, ...leads];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLeads));
            return lead;
        }
    },

    async updateLead(lead: Lead): Promise<Lead> {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('leads')
                .update(lead)
                .eq('id', lead.id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } else {
            await delay(200);
            const leads = await this.fetchLeads();
            const index = leads.findIndex(l => l.id === lead.id);
            if (index !== -1) {
                leads[index] = lead;
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
            }
            return lead;
        }
    },

    async deleteLead(id: string): Promise<void> {
        if (isSupabaseConfigured()) {
            const { error } = await supabase
                .from('leads')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
        } else {
            await delay(200);
            const leads = await this.fetchLeads();
            const filtered = leads.filter(l => l.id !== id);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
        }
    }
};
