import React from "react";
import { Lead } from "@/types";
import { X, CheckCircle, Share2, Building, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface LeadModalProps {
  lead: Lead | null;
  onClose: () => void;
}

export default function LeadModal({ lead, onClose }: LeadModalProps) {
  if (!lead) return null;

  const handleCrmSync = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
        loading: 'Enviando para HubSpot...',
        success: 'Lead sincronizado com sucesso!',
        error: 'Erro na conexão'
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
        >
          <div className="flex items-center justify-between border-b p-6 dark:border-slate-800">
            <div>
                <h2 className="text-xl font-bold dark:text-white">Dossiê do Lead</h2>
                <p className="text-sm text-slate-500">ID: {lead.id}</p>
            </div>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <div className="mb-2 flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs">
                        <User size={14} /> Sobre
                    </div>
                    <p className="font-bold text-lg dark:text-white">{lead.name}</p>
                    <p className="text-slate-500">{lead.role}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <div className="mb-2 flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs">
                        <Building size={14} /> Empresa
                    </div>
                    <p className="font-bold text-lg dark:text-white">{lead.company}</p>
                    <p className="text-slate-500">{lead.location}</p>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="mb-2 flex items-center gap-2 font-bold dark:text-white"><FileText size={16} /> Motivo do Match (IA)</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {lead.fit_reason || "A IA identificou este lead como alta prioridade devido à expansão recente da empresa e compatibilidade com seu ICP definido no onboarding."}
                </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t bg-slate-50 p-6 dark:bg-slate-900 dark:border-slate-800">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleCrmSync} className="gap-2 bg-[#ff5c35] hover:bg-[#ff4015] text-white">
                <Share2 size={16} /> Enviar para HubSpot
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}