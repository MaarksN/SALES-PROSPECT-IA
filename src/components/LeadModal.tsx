import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Lead } from "@/types";
import { Building2, Linkedin, Mail, MapPin, Calendar, Activity } from "lucide-react";

interface LeadModalProps {
  lead: Lead | null;
  onClose: () => void;
}

export default function LeadModal({ lead, onClose }: LeadModalProps) {
  if (!lead) return null;

  return (
    <Dialog open={!!lead} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                {lead.name.charAt(0)}
            </div>
            <div>
                <DialogTitle className="text-xl font-bold dark:text-white">{lead.name}</DialogTitle>
                <DialogDescription className="text-slate-500">{lead.role} @ {lead.company}</DialogDescription>
            </div>
            <div className="ml-auto flex flex-col items-end">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                    lead.score > 80 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                    Score: {lead.score}
                </span>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Mail size={16} className="text-slate-400"/> {lead.email || "Não disponível"}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Linkedin size={16} className="text-slate-400"/> {lead.linkedin ? "Perfil LinkedIn" : "N/A"}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Building2 size={16} className="text-slate-400"/> {lead.company}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <MapPin size={16} className="text-slate-400"/> {lead.location || "Remoto"}
                </div>
            </div>

            <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
                    <Activity size={16} className="text-indigo-500"/> Análise de Fit
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {lead.fit_reason || "Empresa com alto crescimento recente e stack tecnológico compatível."}
                </p>
            </div>
        </div>

        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Fechar</Button>
            <Button>Conectar no LinkedIn</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
