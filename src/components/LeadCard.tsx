import React from "react";
import { Lead } from "@/types";
import { Button } from "@/components/ui/Button";
import { Building2, MapPin, MoreHorizontal, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface LeadCardProps {
  lead: Lead;
  onClick: (lead: Lead) => void;
}

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {lead.company.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">{lead.name}</h3>
            <p className="text-sm text-slate-500">{lead.role}</p>
          </div>
        </div>
        <div className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
            lead.score > 80 ? "bg-green-100 text-green-700" : lead.score > 50 ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-500"
        }`}>
            Score: {lead.score}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
            <Building2 size={14} /> {lead.company}
        </div>
        <div className="flex items-center gap-2">
            <MapPin size={14} /> {lead.location || "Localização não inf."}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex gap-2">
            {lead.linkedin && <a href={lead.linkedin} target="_blank" className="text-blue-600 hover:text-blue-700"><Linkedin size={18} /></a>}
            {lead.email && <a href={`mailto:${lead.email}`} className="text-slate-400 hover:text-slate-600"><Mail size={18} /></a>}
        </div>
        <Button size="sm" variant="outline" onClick={() => onClick(lead)}>
            Ver Detalhes
        </Button>
      </div>
    </motion.div>
  );
}