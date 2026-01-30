
import React from 'react';
import { VisualizadorLogs } from './internal-tools/VisualizadorLogs';
import { TestadorAPI } from './internal-tools/TestadorAPI';
import { SistemaDesign } from './internal-tools/SistemaDesign';
import { FormatadorJSON } from './internal-tools/FormatadorJSON';
import { GeradorFaturas } from './internal-tools/GeradorFaturas';
import { LinkadorWhatsApp } from './internal-tools/LinkadorWhatsApp';
import { CalculadoraROI } from './internal-tools/CalculadoraROI';
import { WikiInterna } from './internal-tools/WikiInterna';
import { QuadroKanban } from './internal-tools/QuadroKanban';
import { LousaVirtual } from './internal-tools/LousaVirtual';

const InternalToolsDashboard = () => {
    return (
        <div className="p-8 space-y-12 pb-40 animate-in fade-in duration-500">
            <div>
                <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                    Suíte de Ferramentas Internas
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400">Utilitários locais que não dependem de API externa.</p>
            </div>

            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl w-fit">
                    🛠️ Infraestrutura & Dev
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-[#0F1629] p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 hover:scale-[1.01] transition-transform">
                        <VisualizadorLogs />
                    </div>
                    <div className="bg-white dark:bg-[#0F1629] p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 hover:scale-[1.01] transition-transform">
                        <TestadorAPI />
                    </div>
                    <div className="bg-white dark:bg-[#0F1629] p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 hover:scale-[1.01] transition-transform">
                        <SistemaDesign />
                    </div>
                    <div className="bg-white dark:bg-[#0F1629] p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 hover:scale-[1.01] transition-transform">
                        <FormatadorJSON />
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl w-fit">
                    💼 Negócios & Vendas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-[#0F1629] p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 hover:scale-[1.01] transition-transform">
                        <GeradorFaturas />
                    </div>
                    <div className="bg-white dark:bg-[#0F1629] p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 hover:scale-[1.01] transition-transform">
                        <LinkadorWhatsApp />
                    </div>
                    <div className="bg-white dark:bg-[#0F1629] p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 hover:scale-[1.01] transition-transform">
                        <CalculadoraROI />
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl w-fit">
                    ⚡ Produtividade
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-[#0F1629] p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 hover:scale-[1.01] transition-transform">
                        <WikiInterna />
                    </div>
                    <div className="bg-white dark:bg-[#0F1629] p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 hover:scale-[1.01] transition-transform">
                        <QuadroKanban />
                    </div>
                    <div className="bg-white dark:bg-[#0F1629] p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 hover:scale-[1.01] transition-transform">
                        <LousaVirtual />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InternalToolsDashboard;
