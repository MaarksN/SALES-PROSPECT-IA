import React, { useState } from "react";
import { Lead } from "@/types";
import LeadCard from "./LeadCard";
import LeadModal from "./LeadModal";
import { Search, Filter } from "lucide-react";

// Mock Data
const MOCK_LEADS: Lead[] = [
  { id: "1", name: "Carlos Silva", role: "CTO", company: "TechLog", score: 92, status: "new", location: "São Paulo, SP", createdAt: "2024-02-14" },
  { id: "2", name: "Mariana Souza", role: "Head de Vendas", company: "RetailCorp", score: 85, status: "qualified", location: "Rio de Janeiro, RJ", createdAt: "2024-02-13" },
  { id: "3", name: "João Pedro", role: "Diretor de Ops", company: "Logística Brasil", score: 45, status: "new", location: "Curitiba, PR", createdAt: "2024-02-12" },
];

export default function LeadList() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");

  const filteredLeads = MOCK_LEADS.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 className="text-3xl font-bold dark:text-white">Meus Leads</h1>
            <p className="text-slate-500">Gerencie suas oportunidades de prospecção.</p>
        </div>
        <div className="flex gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                    placeholder="Buscar leads..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 rounded-lg border bg-white pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white w-64"
                />
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
                <Filter size={18} />
            </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onClick={setSelectedLead} />
        ))}
      </div>

      <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </div>
  );
}