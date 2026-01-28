import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { executeBirthubEngine } from '../services/geminiService';
import { BirthubAnalysisResult, Lead } from '../types';
import { toast } from 'react-hot-toast';

interface BirthubEngineProps {
    onSaveLead?: (lead: Lead) => void;
}

const BirthubEngine: React.FC<BirthubEngineProps> = ({ onSaveLead }) => {
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BirthubAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Agent Simulation State
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentLogs]);

  const steps = [
      "📡 Iniciando varredura de espectro público...",
      "🔍 Identificando CNPJ e estrutura societária...",
      "🕵️‍♂️ Cruzando dados de LinkedIn e Glassdoor...",
      "🧪 Analisando Stack Tecnológico (DNS/Headers)...",
      "🧠 Calculando Score Preditivo (Algoritmo v2.1)...",
      "✍️ Redator Enterprise: Gerando abordagem...",
      "✅ Dossiê compilado com sucesso."
  ];

  const simulateAgentThinking = () => {
      setAgentLogs([]);
      let stepIndex = 0;
      const interval = setInterval(() => {
          if (stepIndex < steps.length) {
              setAgentLogs(prev => [...prev, steps[stepIndex]]);
              stepIndex++;
          } else {
              clearInterval(interval);
          }
      }, 800); // New log every 800ms
      return interval;
  };

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    
    setLoading(true);
    setResult(null);
    setError(null);
    
    const logInterval = simulateAgentThinking();
    
    try {
      const data = await executeBirthubEngine(target);
      setResult(data);
    } catch (err: any) {
      setError("Falha na varredura. Verifique a API Key ou tente novamente.");
    } finally {
      clearInterval(logInterval);
      setLoading(false);
    }
  };

  const handleSaveToPipeline = () => {
      if (!result || !onSaveLead) return;

      const { dossier } = result;
      
      // Mapper: Convert BirthubDossier to Lead
      const newLead: Lead = {
          id: crypto.randomUUID(),
          companyName: dossier.company.trade_name || dossier.company.legal_name || target,
          cnpj: dossier.company.cnpj || undefined,
          sector: dossier.company.industry || 'Desconhecido',
          location: dossier.company.address || 'Brasil',
          website: dossier.company.website || undefined,
          phone: dossier.company.phone || undefined,
          employees: parseInt(dossier.company.employee_range?.split('-')[0] || '0'),
          
          score: dossier.scoring.total_score,
          scoringBreakdown: dossier.scoring.breakdown, // Novo campo
          
          status: 'new', // Always starts as new in pipeline
          createdAt: new Date().toISOString(),
          
          tags: [
              'Origem: Birthub AI', 
              dossier.decision.confidence_level === 'HIGH' ? 'Alta Confiança' : 'Check Manual',
              dossier.signals.hiring_sales ? 'Contratando Vendas' : '',
              dossier.signals.recent_funding ? 'Investimento Recente' : ''
          ].filter(Boolean),

          notes: `ANÁLISE BIRTHUB AI:\n"${dossier.scoring.reasoning}"\n\nCANAL SUGERIDO: ${dossier.outreach.recommended_channel}`,
          
          // Populate enriched fields
          techStack: dossier.technology.detected_stack,
          linkedinUrl: dossier.company.linkedin_company || undefined,
          
          decisionMakers: dossier.decision_maker.name ? [{
              name: dossier.decision_maker.name,
              role: dossier.decision_maker.role || 'N/A',
              linkedin: dossier.decision_maker.linkedin_profile || undefined
          }] : [],

          salesKit: dossier.outreach.message ? {
              valueProposition: "Gerado automaticamente pelo Birthub",
              emailSubject: dossier.outreach.subject || "Oportunidade de Parceria",
              emailBody: dossier.outreach.message,
              phoneScript: "",
              cadence: [],
              objectionHandling: []
          } : undefined
      };

      onSaveLead(newLead);
      toast.success("Lead salvo no pipeline com sucesso!");
      setTarget('');
      setResult(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
    }
  };

  const { dossier, sources } = result || {};

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      
      {/* Header with Cinematic Effect */}
      <div className="relative overflow-hidden rounded-[2rem] bg-black text-white p-10 md:p-16 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-600/20 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
           <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-mono tracking-widest uppercase">Motor Decisório B2B</span>
              <span className="flex items-center gap-1 text-green-400 text-xs font-bold uppercase"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Online</span>
           </div>
           <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight leading-none">
             BIRTHUB AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">v2.1</span>
           </h1>
           <p className="text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
             O núcleo cognitivo para inteligência comercial. Extração de dados, validação de compliance e scoring preditivo com zero alucinação.
           </p>

           <form onSubmit={handleAnalysis} className="flex gap-4 max-w-xl">
             <input 
               type="text" 
               value={target}
               onChange={(e) => setTarget(e.target.value)}
               placeholder="Empresa, Domínio ou CNPJ..." 
               className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:bg-white/20 focus:border-indigo-500 outline-none transition-all backdrop-blur-sm font-mono"
             />
             <button 
               type="submit" 
               disabled={loading || !target}
               className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
             >
               {loading ? 'Processando...' : 'Iniciar Varredura'}
             </button>
           </form>
        </div>
      </div>

      {/* Terminal Logs (Agent Simulation) */}
      {(loading || (agentLogs.length > 0 && !result)) && (
        <div className="bg-[#0c0c0c] p-6 rounded-2xl border border-slate-800 font-mono text-xs md:text-sm shadow-2xl">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-slate-500 ml-2">agent_process.log</span>
          </div>
          <div className="space-y-2 h-48 overflow-y-auto custom-scrollbar">
             {agentLogs.map((log, i) => (
               <div key={i} className="text-green-500/90 animate-in slide-in-from-left-2 fade-in duration-300">
                 <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                 {log}
               </div>
             ))}
             {loading && (
               <div className="text-green-500/50 animate-pulse">_</div>
             )}
             <div ref={logsEndRef} />
          </div>
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-2xl border border-red-200 dark:border-red-800 flex items-center gap-3">
            <Icons.X /> <strong>Erro Crítico:</strong> {error}
        </div>
      )}

      {dossier && !loading && (
        <div className="animate-in slide-in-from-bottom-10 fade-in duration-500 space-y-8">
            
            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold dark:text-white">Dossiê Gerado</h2>
                {onSaveLead && (
                    <button 
                        onClick={handleSaveToPipeline}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                    >
                        <Icons.Check /> Aprovar e Salvar no Pipeline
                    </button>
                )}
            </div>

            {/* Executive Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Score Card */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <h3 className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs mb-4">Score de Potencial</h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-6xl font-black text-slate-800 dark:text-white">{dossier.scoring.total_score}</span>
                        <span className="text-xl text-slate-400 font-medium mb-2">/100</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div 
                           className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000" 
                           style={{ width: `${dossier.scoring.total_score}%` }}
                        ></div>
                    </div>
                </div>

                {/* Decision Card */}
                <div className={`p-8 rounded-[2.5rem] shadow-xl border flex flex-col justify-center items-center text-center ${getStatusColor(dossier.decision.status)}`}>
                    <h3 className="font-bold uppercase tracking-wider text-xs opacity-70 mb-2">Decisão Executiva</h3>
                    <div className="text-3xl font-black mb-2">{dossier.decision.status}</div>
                    <div className="px-3 py-1 bg-black/5 rounded-lg text-xs font-bold inline-block">
                        Confiança: {dossier.decision.confidence_level}
                    </div>
                </div>

                {/* Company Identity */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold dark:text-white mb-2 leading-tight">
                        {dossier.company.trade_name || dossier.company.legal_name || target}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                        {dossier.company.industry} • {dossier.company.employee_range || 'N/A'} funcionários
                    </p>
                    <div className="flex gap-2">
                        {dossier.company.website && (
                             <a href={dossier.company.website} target="_blank" className="text-xs font-bold bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors dark:text-white">Website</a>
                        )}
                         {dossier.company.linkedin_company && (
                             <a href={dossier.company.linkedin_company} target="_blank" className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">LinkedIn</a>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Dossier Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Decision Maker */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
                            <Icons.Target /> Tomador de Decisão
                        </h3>
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-2xl font-bold text-slate-500 dark:text-slate-300">
                                {dossier.decision_maker.name ? dossier.decision_maker.name.charAt(0) : '?'}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-bold dark:text-white">{dossier.decision_maker.name || 'Não identificado publicamente'}</h4>
                                <p className="text-indigo-600 font-medium mb-2">{dossier.decision_maker.role}</p>
                                <div className="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    {dossier.decision_maker.email && <span>📧 {dossier.decision_maker.email}</span>}
                                    {dossier.decision_maker.phone && <span>📞 {dossier.decision_maker.phone}</span>}
                                    {dossier.decision_maker.linkedin_profile && (
                                        <a href={dossier.decision_maker.linkedin_profile} target="_blank" className="text-blue-500 hover:underline">LinkedIn Profile</a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reasoning & Signals */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
                         <h3 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2">
                            <Icons.Brain /> Raciocínio Estratégico
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                            "{dossier.scoring.reasoning}"
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Contratação</span>
                                <div className="flex flex-col gap-1">
                                    <span className={dossier.signals.hiring_sales ? 'text-green-600 font-bold' : 'text-slate-400'}>
                                        {dossier.signals.hiring_sales ? '✓ Contratando Vendas' : '• Sem vagas Vendas'}
                                    </span>
                                    <span className={dossier.signals.hiring_marketing ? 'text-green-600 font-bold' : 'text-slate-400'}>
                                        {dossier.signals.hiring_marketing ? '✓ Contratando Mkt' : '• Sem vagas Mkt'}
                                    </span>
                                </div>
                            </div>
                             <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Tech Stack</span>
                                <div className="flex flex-wrap gap-2">
                                    {dossier.technology.detected_stack.length > 0 ? (
                                        dossier.technology.detected_stack.map(tech => (
                                            <span key={tech} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs rounded font-medium dark:text-white">{tech}</span>
                                        ))
                                    ) : <span className="text-sm text-slate-400">Nenhuma stack detectada.</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Evidence Sources */}
                    {sources && sources.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
                            <h3 className="text-sm font-bold dark:text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Fontes de Evidência
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {sources.map((source, idx) => (
                                    <a 
                                        key={idx} 
                                        href={source.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-500 hover:border-blue-300 transition-colors truncate max-w-[200px]"
                                    >
                                        {source.title || source.uri}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Outreach */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-b from-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Icons.Zap /> Estratégia de Ativação
                        </h3>
                        
                        {dossier.decision.status === 'REJECTED' ? (
                            <div className="p-4 bg-white/10 rounded-xl text-center">
                                <p className="font-bold text-red-300">Contato Bloqueado</p>
                                <p className="text-sm text-slate-300 mt-1">O score não atingiu o limiar de segurança para prospecção.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Canal Recomendado</span>
                                    <div className="text-2xl font-bold mt-1">{dossier.outreach.recommended_channel}</div>
                                </div>
                                
                                {dossier.outreach.subject && (
                                    <div>
                                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Assunto</span>
                                        <div className="p-3 bg-white/10 rounded-lg mt-1 text-sm font-medium border border-white/10">
                                            {dossier.outreach.subject}
                                        </div>
                                    </div>
                                )}

                                {dossier.outreach.message && (
                                    <div>
                                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Mensagem</span>
                                        <div className="p-4 bg-white/10 rounded-lg mt-1 text-sm leading-relaxed border border-white/10 italic text-slate-200 whitespace-pre-wrap">
                                            "{dossier.outreach.message}"
                                        </div>
                                        <button 
                                            onClick={() => {navigator.clipboard.writeText(dossier.outreach.message || ''); toast.success("Script copiado!")}}
                                            className="w-full mt-2 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase transition-colors"
                                        >
                                            Copiar Script
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold dark:text-white mb-4 text-sm uppercase">Breakdown do Score</h4>
                        <div className="space-y-3">
                            {[
                                { label: 'Fit Técnico', val: dossier.scoring.breakdown.tech_fit },
                                { label: 'Timing de Mercado', val: dossier.scoring.breakdown.market_timing },
                                { label: 'Potencial de Budget', val: dossier.scoring.breakdown.budget_potential },
                                { label: 'Confiança dos Dados', val: dossier.scoring.breakdown.data_confidence },
                            ].map(item => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                                        <span className="font-bold dark:text-white">{item.val}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-800 dark:bg-slate-400" style={{ width: `${item.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
      )}
    </div>
  );
};

export default BirthubEngine;