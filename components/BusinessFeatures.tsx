
import React, { useState } from 'react';
import { Icons } from '../constants';
import CRMConnectors from './CRMConnectors';

const BusinessFeatures: React.FC = () => {
    const [tab, setTab] = useState<'affiliates' | 'enterprise' | 'marketplace' | 'crm'>('affiliates');

    return (
        <div className="animate-in fade-in space-y-8 pb-20">
            <h2 className="text-3xl font-bold dark:text-white flex items-center gap-3">
                <Icons.Briefcase className="text-indigo-600" />
                Business Center
            </h2>

            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-1">
                <button
                    onClick={() => setTab('affiliates')}
                    className={`px-6 py-3 font-bold rounded-t-xl transition-all ${tab === 'affiliates' ? 'bg-indigo-50 border-b-2 border-indigo-600 text-indigo-700 dark:bg-slate-800 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    Afiliados & Créditos
                </button>
                <button
                    onClick={() => setTab('enterprise')}
                    className={`px-6 py-3 font-bold rounded-t-xl transition-all ${tab === 'enterprise' ? 'bg-indigo-50 border-b-2 border-indigo-600 text-indigo-700 dark:bg-slate-800 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    Plano Enterprise
                </button>
                <button
                    onClick={() => setTab('marketplace')}
                    className={`px-6 py-3 font-bold rounded-t-xl transition-all ${tab === 'marketplace' ? 'bg-indigo-50 border-b-2 border-indigo-600 text-indigo-700 dark:bg-slate-800 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    Marketplace
                </button>
                <button
                    onClick={() => setTab('crm')}
                    className={`px-6 py-3 font-bold rounded-t-xl transition-all ${tab === 'crm' ? 'bg-indigo-50 border-b-2 border-indigo-600 text-indigo-700 dark:bg-slate-800 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    Integrações
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 min-h-[400px]">
                {tab === 'affiliates' && (
                    <div className="space-y-6 animate-in slide-in-from-left duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400"><Icons.Dollar className="w-8 h-8" /></div>
                            <div>
                                <h3 className="text-xl font-bold dark:text-white">Programa de Afiliados</h3>
                                <p className="text-slate-500 dark:text-slate-400">Convide amigos e ganhe 50 créditos por indicação ativa.</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-200 dark:border-slate-700">
                            <div>
                                <div className="text-xs uppercase font-bold text-slate-400 mb-1">Seu Link Único</div>
                                <code className="text-lg font-mono font-bold dark:text-white">sales.ai/invite/USER123</code>
                            </div>
                            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transition-transform hover:scale-105 active:scale-95">Copiar Link</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-center">
                                <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">0</div>
                                <div className="text-sm font-bold text-indigo-400">Indicações</div>
                            </div>
                            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-center">
                                <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">R$ 0,00</div>
                                <div className="text-sm font-bold text-indigo-400">Comissões</div>
                            </div>
                            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-center">
                                <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">Bronze</div>
                                <div className="text-sm font-bold text-indigo-400">Nível</div>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'enterprise' && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400"><Icons.Briefcase className="w-8 h-8" /></div>
                            <div>
                                <h3 className="text-xl font-bold dark:text-white">Sales AI Enterprise</h3>
                                <p className="text-slate-500 dark:text-slate-400">Soluções avançadas para times acima de 10 usuários.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-500 transition-colors cursor-pointer group">
                                <h4 className="font-bold dark:text-white flex items-center gap-2 mb-2"><Icons.Check className="text-green-500" /> SSO (Single Sign-On)</h4>
                                <p className="text-sm text-slate-500">Integração com Okta, Azure AD e Google Workspace.</p>
                            </div>
                            <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-500 transition-colors cursor-pointer group">
                                <h4 className="font-bold dark:text-white flex items-center gap-2 mb-2"><Icons.Check className="text-green-500" /> API Dedicada</h4>
                                <p className="text-sm text-slate-500">Acesso direto ao nosso motor de IA via REST API.</p>
                            </div>
                            <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-500 transition-colors cursor-pointer group">
                                <h4 className="font-bold dark:text-white flex items-center gap-2 mb-2"><Icons.Check className="text-green-500" /> Fine-Tuning</h4>
                                <p className="text-sm text-slate-500">Treine a IA com seus próprios dados e playbooks de vendas.</p>
                            </div>
                            <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-500 transition-colors cursor-pointer group">
                                <h4 className="font-bold dark:text-white flex items-center gap-2 mb-2"><Icons.Check className="text-green-500" /> SLA & Suporte</h4>
                                <p className="text-sm text-slate-500">Gerente de conta dedicado e suporte 24/7.</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button className="px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-xl shadow-lg hover:opacity-90">Falar com Vendas</button>
                        </div>
                    </div>
                )}

                {tab === 'marketplace' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400"><Icons.Shop className="w-8 h-8" /></div>
                            <div>
                                <h3 className="text-xl font-bold dark:text-white">Marketplace de Prompts</h3>
                                <p className="text-slate-500 dark:text-slate-400">Compre e venda ferramentas de IA criadas pela comunidade.</p>
                            </div>
                        </div>

                        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            <Icons.Tools className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-400">Em Breve</h3>
                            <p className="text-slate-400 max-w-md mx-auto mt-2">Estamos curando as melhores ferramentas. Inscreva-se para ser um dos primeiros criadores.</p>
                            <button className="mt-6 px-6 py-2 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20">Seja um Criador</button>
                        </div>
                    </div>
                )}

                {tab === 'crm' && <CRMConnectors />}
            </div>
        </div>
    );
};
export default BusinessFeatures;
