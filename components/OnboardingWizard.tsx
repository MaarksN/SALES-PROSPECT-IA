
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import Button from './ui/Button';
import { Icons } from '../constants';
import confetti from 'canvas-confetti';

const steps = [
    {
        title: "Bem-vindo ao Futuro das Vendas 🚀",
        content: "Você está prestes a acessar a inteligência artificial mais avançada para prospecção B2B. O Sales Prospector v2.1 automatiza a busca, enriquecimento e abordagem de leads.",
        icon: "👋"
    },
    {
        title: "Configure seu Perfil de Vendedor 💼",
        content: "Para a IA funcionar melhor, ela precisa saber quem você é. (Isso será usado para gerar scripts personalizados).",
        hasInput: true,
        icon: "🤖"
    },
    {
        title: "Bônus de Ativação! 🎁",
        content: "Parabéns por configurar sua conta. Você ganhou 50 Créditos de IA para começar a prospectar agora mesmo.",
        isFinal: true,
        icon: "💎"
    }
];

export const OnboardingWizard = ({ onComplete }: { onComplete: () => void }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [role, setRole] = useState('');
    const updateLead = useStore(state => state.updateLead); // Using store just to access global actions if needed

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            if (steps[currentStep + 1].isFinal) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        } else {
            onComplete();
        }
    };

    const stepData = steps[currentStep];

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#0B1120] w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 animate-in zoom-in-95 duration-300">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="text-6xl mb-4 relative z-10">{stepData.icon}</div>
                    <h2 className="text-2xl font-black text-white relative z-10">{stepData.title}</h2>
                </div>

                <div className="p-8">
                    <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
                        {stepData.content}
                    </p>

                    {stepData.hasInput && (
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Qual seu cargo atual?</label>
                            <input
                                type="text"
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                placeholder="Ex: SDR, Executivo de Vendas, CEO..."
                                className="w-full p-4 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
                            />
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            {steps.map((_, idx) => (
                                <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentStep ? 'w-8 bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                            ))}
                        </div>
                        <Button onClick={handleNext} size="lg" className="shadow-xl shadow-indigo-500/30">
                            {stepData.isFinal ? "Começar Agora" : "Continuar"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;
