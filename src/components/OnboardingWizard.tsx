import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Icons } from "@/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

const STEPS = [
  { id: "dna", title: "DNA de Vendas", icon: Icons.Target, desc: "Configure o tom de voz da IA." },
  { id: "birthub", title: "Inteligência", icon: Icons.Sparkles, desc: "Defina seus critérios de ICP." },
  { id: "tools", title: "Ferramentas", icon: Icons.PowerTools, desc: "Ative os módulos essenciais." },
];

export default function OnboardingWizard() {
  const { userContext, completeOnboarding } = useStore();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      completeOnboarding();
      toast.success("Setup concluído! +10 Créditos adicionados.", {
        icon: <Icons.Sparkles className="text-yellow-500" />,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-[600px] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl flex dark:bg-slate-900 border dark:border-slate-800"
      >
        {/* Sidebar */}
        <div className="w-1/3 bg-slate-50 p-8 dark:bg-slate-950/50 border-r dark:border-slate-800">
            <h2 className="mb-8 text-2xl font-black text-slate-900 dark:text-white">Setup Inicial</h2>
            <div className="space-y-4">
                {STEPS.map((step, index) => (
                    <div
                        key={step.id}
                        className={`flex items-center gap-4 rounded-xl p-4 transition-all ${index === activeStep ? "bg-white shadow-lg dark:bg-slate-800" : "opacity-50"}`}
                    >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${index <= activeStep ? "bg-indigo-600 text-white" : "bg-slate-200 dark:bg-slate-700"}`}>
                            {index < activeStep ? <Icons.CheckCircle size={20} /> : <step.icon size={20} />}
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">{step.title}</p>
                            <p className="text-xs text-slate-500">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-12 flex flex-col">
            <div className="flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-3xl font-bold mb-4 dark:text-white">{STEPS[activeStep].title}</h3>
                        <p className="text-slate-500 mb-8 text-lg">
                            Configure esta etapa para personalizar a experiência do Sales Prospector.
                        </p>

                        <div className="aspect-video w-full rounded-2xl bg-slate-900/5 border border-slate-200 dark:border-slate-700 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                             {/* Placeholder de Vídeo */}
                             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-transparent"></div>
                             <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform">
                                <div className="ml-1 h-0 w-0 border-b-[10px] border-l-[16px] border-t-[10px] border-b-transparent border-l-indigo-600 border-t-transparent"></div>
                             </div>
                             <p className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tutorial em Vídeo</p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex justify-end pt-8 border-t dark:border-slate-800">
                <Button size="lg" onClick={handleNext} className="rounded-xl px-8 text-md">
                    {activeStep === STEPS.length - 1 ? "Concluir Setup" : "Próximo Passo"}
                    <Icons.ChevronRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
      </motion.div>
    </div>
  );
}