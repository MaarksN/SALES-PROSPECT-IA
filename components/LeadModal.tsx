
import React, { useState } from 'react';
import { Lead } from '../types';
import { enrichDecisionMakers, generateSalesKit, analyzeCompetitors, checkLocationData } from '../services/geminiService';
import { enrichmentService } from '../services/enrichmentService';
import { Icons } from '../constants';
import { Skeleton } from './Skeleton';
import { useStore } from '../store/useStore';
import { toast } from 'react-hot-toast';

interface LeadModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (updatedLead: Lead) => void;
}

const LeadModal: React.FC<LeadModalProps> = ({ lead, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'enrichment' | 'sales_machine' | 'execution'>('details');
  const [loading, setLoading] = useState(false);
  const [mapsResult, setMapsResult] = useState<string | null>(null);
  
  const decrementCredits = useStore(state => state.decrementCredits);

  const handleEnrichment = async () => {
    try {
        decrementCredits(1);
        setLoading(true);
        const dms = await enrichDecisionMakers(lead.companyName);
        const comps = await analyzeCompetitors(lead.companyName);
        const locData = await checkLocationData(lead.companyName, lead.location || '');
        setMapsResult(locData);

        const updated = {
        ...lead,
        decisionMakers: dms,
        competitors: comps,
        score: Math.min(lead.score + 25, 100)
        };
        onUpdate(updated);
    } catch (e) {
        // Credits error handled globally
    } finally {
        setLoading(false);
    }
  };

  const handleRealValidation = async () => {
      if (!lead.cnpj) {
          toast.error("CNPJ necessário para validação real.");
          return;
      }
      try {
          setLoading(true);
          const data = await enrichmentService.validateCNPJ(lead.cnpj);
          if (data) {
              const updated = {
                  ...lead,
                  companyName: data.nome_fantasia || data.razao_social || lead.companyName,
                  address: `${data.logradouro}, ${data.numero} - ${data.bairro}, ${data.municipio} - ${data.uf}`,
                  phone: data.ddd_telefone_1 ? `55${data.ddd_telefone_1}` : lead.phone,
                  location: `${data.municipio}, ${data.uf}`,
                  cnae: data.cnae_fiscal_descricao
              };
              onUpdate(updated);
              toast.success("Dados validados na Receita Federal!");
          } else {
              toast.error("CNPJ não encontrado ou inválido.");
          }
      } catch (e) {
          toast.error("Erro na validação.");
      } finally {
          setLoading(false);
      }
  };

  const handleSalesMachine = async () => {
    try {
        decrementCredits(1);
        setLoading(true);
        const kit = await generateSalesKit(lead.companyName, lead.sector || 'Geral');
        const updated = { ...lead, salesKit: kit || undefined };
        onUpdate(updated);
    } catch(e) {

    } finally {
        setLoading(false);
    }
  };

  const handleSmartEmail = () => {
      if (!lead.email && !lead.decisionMakers?.[0]?.name) {
          toast.error("Sem email ou decisor para contato.");
          return;
      }
      const subject = lead.salesKit?.emailSubject || "Parceria Estratégica";
      const body = lead.salesKit?.emailBody || `Olá, gostaria de falar sobre a ${lead.companyName}...`;
      
      const mailtoLink = `mailto:${lead.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      toast.success("Cliente de email aberto!");
  };

  const handleSmartWhatsApp = () => {
      if (!lead.phone) {
          toast.error("Sem telefone cadastrado.");
          return;
      }
      // Remove non-numeric
      const cleanPhone = lead.phone.replace(/\D/g, '');
      const message = lead.salesKit?.cadence?.find(c => c.channel === 'phone')?.content || `Olá, falo da parte da ${lead.companyName}?`;
      
      const waLink = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(waLink, '_blank');
      toast.success("WhatsApp Web aberto!");
  };

  const handleCRMExport = () => {
      // Simulating API Call
      toast.loading("Sincronizando com HubSpot...");
      setTimeout(() => {
          toast.dismiss();
          const updated = {
              ...lead,
              crmSync: {
                  status: 'synced' as const,
                  lastSync: new Date().toISOString(),
                  crmId: `HS-${Math.floor(Math.random() * 10000)}`,
                  platform: 'HubSpot' as const
              }
          };
          onUpdate(updated);
          toast.success("Lead exportado para HubSpot com sucesso!");
      }, 1500);
  };

  const handleSave = () => {
      onClose();
  }

  // Skeleton Loader Wrapper
  const LoadingState = () => (
      <div className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
      </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start">
          <div className="flex gap-4">
             <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {lead.companyName.charAt(0)}
             </div>
             <div>
                <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                    {lead.companyName}
                    {lead.website && (
                      <a href={lead.website} target="_blank" className="text-slate-400 hover:text-indigo-500 transition-colors">
                          <Icons.Search className="w-4 h-4" />
                      </a>
                    )}
                    {lead.crmSync?.status === 'synced' && (
                        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Icons.Database className="w-3 h-3" /> HubSpot
                        </span>
                    )}
                </h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">📍 {lead.location}</span>
                    <span className="flex items-center gap-1">🏢 {lead.sector}</span>
                    <span className="flex items-center gap-1">💰 {lead.revenueEstimate || 'N/A'}</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md"
              >
                  💾 Salvar Lead
              </button>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
                <Icons.X />
              </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 min-w-[120px] py-4 text-sm font-bold tracking-wide transition-all border-b-2 ${activeTab === 'details' ? 'border-indigo-500 text-indigo-600 bg-white dark:bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
            📋 Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('enrichment')}
            className={`flex-1 min-w-[120px] py-4 text-sm font-bold tracking-wide transition-all border-b-2 ${activeTab === 'enrichment' ? 'border-indigo-500 text-indigo-600 bg-white dark:bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
            ⚡ Enriquecimento
          </button>
          <button 
            onClick={() => setActiveTab('sales_machine')}
            className={`flex-1 min-w-[120px] py-4 text-sm font-bold tracking-wide transition-all border-b-2 ${activeTab === 'sales_machine' ? 'border-indigo-500 text-indigo-600 bg-white dark:bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
            🚀 Estratégia
          </button>
          <button 
            onClick={() => setActiveTab('execution')}
            className={`flex-1 min-w-[120px] py-4 text-sm font-bold tracking-wide transition-all border-b-2 ${activeTab === 'execution' ? 'border-green-500 text-green-600 bg-green-50/50 dark:bg-green-900/20' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
            🎯 Execução (Novo)
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-900/20">
          
          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="md:col-span-2 space-y-6">
                 {/* Stack Card */}
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">🛠️ Tech Stack & Dados</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {lead.techStack?.map(tech => (
                            <span key={tech} className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-sm font-medium dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">{tech}</span>
                        )) || <span className="text-slate-400 italic">Nenhuma tecnologia identificada.</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                         <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                             <span className="text-xs text-slate-500 uppercase font-bold">Telefone</span>
                             <p className="font-medium">{lead.phone || '—'}</p>
                         </div>
                         <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                             <span className="text-xs text-slate-500 uppercase font-bold">CNPJ</span>
                             <p className="font-medium">{lead.cnpj || 'Consultar'}</p>
                         </div>
                         <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg col-span-2">
                            <span className="text-xs text-slate-500 uppercase font-bold">Website</span>
                             <p className="font-medium text-blue-500 truncate">{lead.website || '—'}</p>
                         </div>
                    </div>
                 </div>

                 {/* Tags */}
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2">🏷️ Tags & Notas</h3>
                     <div className="flex flex-wrap gap-2">
                        {lead.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium dark:bg-slate-700 dark:text-slate-300">#{tag}</span>
                        ))}
                        <button className="px-3 py-1 border border-dashed border-slate-300 text-slate-400 rounded-full text-sm hover:border-indigo-500 hover:text-indigo-500 transition-colors">+ Adicionar</button>
                     </div>
                     <textarea 
                        className="w-full mt-4 p-3 rounded-lg border border-slate-200 dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        placeholder="Adicione notas sobre o lead aqui..."
                        defaultValue={lead.notes}
                        rows={5}
                     ></textarea>
                 </div>
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 mb-4 relative">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-slate-200 dark:text-slate-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"/>
                            <path className={`${lead.score > 70 ? 'text-green-500' : 'text-yellow-500'}`} strokeDasharray={`${lead.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"/>
                          </svg>
                          <span className="absolute text-2xl font-bold">{lead.score}</span>
                      </div>
                      <h3 className="font-bold text-lg">Lead Score</h3>
                      <p className="text-sm text-slate-500">Probabilidade de Conversão</p>
                  </div>
                  
                  {/* Detailed Breakdown if available (Birthub Leads) */}
                  {lead.scoringBreakdown && (
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                          <h4 className="font-bold text-sm uppercase mb-4 text-slate-500 dark:text-slate-400">Análise Birthub AI</h4>
                          <div className="space-y-3">
                              {[
                                  { label: 'Fit Técnico', val: lead.scoringBreakdown.tech_fit },
                                  { label: 'Timing', val: lead.scoringBreakdown.market_timing },
                                  { label: 'Budget', val: lead.scoringBreakdown.budget_potential },
                                  { label: 'Dados', val: lead.scoringBreakdown.data_confidence },
                              ].map(item => (
                                  <div key={item.label}>
                                      <div className="flex justify-between text-xs mb-1">
                                          <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                                          <span className="font-bold dark:text-white">{item.val}</span>
                                      </div>
                                      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                          <div className="h-full bg-indigo-500" style={{ width: `${item.val}%` }}></div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Status do Pipeline</label>
                      <select 
                        value={lead.status}
                        onChange={(e) => onUpdate({...lead, status: e.target.value as any})}
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-700 dark:border-slate-600 font-medium"
                      >
                        <option value="new">🔵 Novo</option>
                        <option value="qualifying">🟡 Em Qualificação</option>
                        <option value="contacted">🟠 Contactado</option>
                        <option value="negotiation">🟣 Negociação</option>
                        <option value="won">🟢 Ganho</option>
                        <option value="lost">🔴 Perdido</option>
                      </select>
                  </div>
              </div>
            </div>
          )}

          {/* TAB 2: ENRICHMENT */}
          {activeTab === 'enrichment' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              {loading && <LoadingState />}
              
              {!loading && !lead.decisionMakers && !lead.competitors && !mapsResult ? (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-indigo-600 mb-4">
                     <Icons.Robot />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Dados Ausentes</h3>
                  <p className="text-slate-500 mb-6 max-w-md">Utilize a Inteligência Artificial para descobrir quem são os tomadores de decisão, concorrentes e validar localização real.</p>
                  <div className="flex gap-4">
                    <button
                        onClick={handleEnrichment}
                        disabled={loading}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Icons.Refresh /> : '⚡ Enriquecer (1 Crédito)'}
                    </button>
                    {lead.cnpj && (
                        <button
                            onClick={handleRealValidation}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <Icons.Check /> Validar Receita
                        </button>
                    )}
                  </div>
                </div>
              ) : !loading && (
                <>
                  {/* Google Maps Grounding Result */}
                  {mapsResult && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                          <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                            🗺️ Google Maps Grounding
                          </h3>
                          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                              {mapsResult}
                          </p>
                      </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Decision Makers */}
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-600">👥 Decisores Identificados</h3>
                        <ul className="space-y-3">
                            {lead.decisionMakers?.map((dm, idx) => (
                            <li key={idx} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                        {dm.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{dm.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{dm.role}</p>
                                    </div>
                                </div>
                                {dm.linkedin && (
                                <a href={dm.linkedin} target="_blank" className="text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Buscar no LinkedIn">
                                    <Icons.Search className="w-4 h-4" />
                                </a>
                                )}
                            </li>
                            ))}
                        </ul>
                      </div>
                      
                      {/* Competitors */}
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-500">⚔️ Concorrência</h3>
                        <div className="space-y-3">
                            {lead.competitors?.map((comp, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-bold">{comp.name}</span>
                                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">Rival</span>
                                    </div>
                                    <p className="text-sm text-slate-500">💪 Ponto Forte: {comp.strength}</p>
                                </div>
                            ))}
                        </div>
                      </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: SALES MACHINE */}
          {activeTab === 'sales_machine' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
               {loading && <LoadingState />}
               
               {!loading && !lead.salesKit ? (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 mb-4">
                     <Icons.Calendar />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Máquina de Vendas Desligada</h3>
                  <p className="text-slate-500 mb-6 max-w-md">Gere scripts de ligação, emails frios e uma cadência completa personalizada para este lead.</p>
                  <button 
                    onClick={handleSalesMachine} 
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Icons.Refresh /> : '🚀 Gerar Estratégia (1 Crédito)'} 
                  </button>
                </div>
              ) : !loading && lead.salesKit ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cadence Timeline */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">📅 Cadência Sugerida</h3>
                        <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900 ml-3 space-y-8">
                            {lead.salesKit.cadence.map((step, idx) => (
                                <div key={idx} className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-800"></div>
                                    <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded mb-1 inline-block uppercase">Dia {step.day} • {step.channel.toUpperCase()}</span>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{step.subject || `Ação via ${step.channel}`}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                        "{step.content}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Phone Script */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-lg">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">📞 Script de Ligação</h3>
                            <div className="space-y-4 text-sm font-mono leading-relaxed opacity-90">
                                <div className="whitespace-pre-wrap">{lead.salesKit.phoneScript}</div>
                            </div>
                        </div>
                        
                        {/* Objections */}
                        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-700 dark:text-red-400">🛡️ Contorno de Objeções</h3>
                            <div className="space-y-4">
                                {lead.salesKit.objectionHandling.map((obj, idx) => (
                                    <div key={idx}>
                                        <p className="font-bold text-red-800 dark:text-red-300 text-sm mb-1">"{obj.objection}"</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 italic">Resp: {obj.response}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 4: EXECUTION HUB (NEW) */}
          {activeTab === 'execution' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2">
                  
                  {/* Smart Actions Card */}
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
                      <h3 className="text-2xl font-black mb-6 dark:text-white flex items-center gap-3">
                          <Icons.Zap /> Disparo Inteligente
                      </h3>
                      
                      <div className="space-y-4">
                          <button 
                             onClick={handleSmartEmail}
                             className="w-full bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 p-4 rounded-xl flex items-center gap-4 transition-all group"
                          >
                              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                  <Icons.Mail />
                              </div>
                              <div className="text-left">
                                  <h4 className="font-bold text-lg dark:text-white">Enviar Email Frio</h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-300">
                                      {lead.salesKit ? 'Usar script IA gerado' : 'Abrir cliente padrão'}
                                  </p>
                              </div>
                              <div className="ml-auto text-slate-300 dark:text-slate-500">➔</div>
                          </button>

                          <button 
                             onClick={handleSmartWhatsApp}
                             className="w-full bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 p-4 rounded-xl flex items-center gap-4 transition-all group"
                          >
                              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                  <Icons.MessageCircle />
                              </div>
                              <div className="text-left">
                                  <h4 className="font-bold text-lg dark:text-white">Iniciar Conversa WhatsApp</h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-300">
                                      Abrir API Web com mensagem
                                  </p>
                              </div>
                              <div className="ml-auto text-slate-300 dark:text-slate-500">➔</div>
                          </button>

                          <button className="w-full bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 p-4 rounded-xl flex items-center gap-4 transition-all group opacity-50 cursor-not-allowed" title="Em breve">
                              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl">
                                  <Icons.Phone />
                              </div>
                              <div className="text-left">
                                  <h4 className="font-bold text-lg dark:text-white">Discador VoIP</h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-300">
                                      Ligar diretamente do browser
                                  </p>
                              </div>
                              <div className="ml-auto text-xs font-bold bg-slate-200 px-2 py-1 rounded">EM BREVE</div>
                          </button>
                      </div>
                  </div>

                  {/* CRM Sync Card */}
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col">
                      <h3 className="text-2xl font-black mb-6 dark:text-white flex items-center gap-3">
                          <Icons.Database /> Sincronização CRM
                      </h3>
                      
                      <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                          {lead.crmSync?.status === 'synced' ? (
                              <div className="animate-in zoom-in">
                                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                      <Icons.Check className="w-10 h-10" />
                                  </div>
                                  <h4 className="text-xl font-bold text-slate-800 dark:text-white">Sincronizado!</h4>
                                  <p className="text-slate-500 dark:text-slate-400 mb-2">
                                      Enviado para {lead.crmSync.platform} em {new Date(lead.crmSync.lastSync).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded inline-block">ID: {lead.crmSync.crmId}</p>
                              </div>
                          ) : (
                              <>
                                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
                                    Exporte este lead completo (dados, e-mails e histórico) para seu CRM favorito com um clique.
                                </p>
                                <div className="flex gap-4 w-full">
                                    <button 
                                        onClick={handleCRMExport}
                                        className="flex-1 py-3 bg-[#ff7a59] hover:bg-[#ff8f73] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2"
                                    >
                                        HubSpot
                                    </button>
                                    <button 
                                        onClick={handleCRMExport}
                                        className="flex-1 py-3 bg-[#00a1e0] hover:bg-[#3eb6e6] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                                    >
                                        Salesforce
                                    </button>
                                </div>
                              </>
                          )}
                      </div>
                  </div>

              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadModal;
