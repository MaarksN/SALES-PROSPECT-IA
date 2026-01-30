
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Onboarding: React.FC = () => {
  const [completed, setCompleted] = useLocalStorage<boolean>('onboarding_completed', false);
  const [step, setStep] = useState(0);

  if (completed) return null;

  const steps = [
    {
      title: "Bem-vindo ao Sales Prospector AI v2.0",
      content: "Sua nova central de inteligência comercial. Vamos fazer um tour rápido?",
      icon: <Icons.Sparkles className="w-12 h-12 text-indigo-500" />
    },
    {
      title: "100 Ferramentas de IA",
      content: "No menu 'Ferramentas', você encontra nossos 30 novos módulos, incluindo Quebra-Gelo, Simulador de Objeções e muito mais.",
      icon: <Icons.Zap className="w-12 h-12 text-amber-500" />
    },
    {
      title: "Personalização Profunda",
      content: "Clique em 'Ensinar IA' dentro do Hub para configurar sua empresa. A IA vai gerar respostas personalizadas para o seu produto.",
      icon: <Icons.Brain className="w-12 h-12 text-purple-500" />
    },
    {
      title: "Comandos Rápidos",
      content: "Pressione Cmd+K (ou Ctrl+K) a qualquer momento para abrir a busca rápida de ferramentas.",
      icon: <Icons.Search className="w-12 h-12 text-blue-500" />
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setCompleted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-2 bg-indigo-100 dark:bg-slate-700 w-full">
            <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
        </div>

        <div className="flex flex-col items-center text-center mt-4">
            <div className="mb-6 bg-slate-50 dark:bg-slate-700 p-6 rounded-full shadow-inner animate-bounce">
                {steps[step].icon}
            </div>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">{steps[step].title}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                {steps[step].content}
            </p>

            <button
                onClick={handleNext}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30"
            >
                {step === steps.length - 1 ? "Começar a Prospectar 🚀" : "Próximo"}
            </button>

            <button
                onClick={() => setCompleted(true)}
                className="mt-4 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
                Pular Introdução
            </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
