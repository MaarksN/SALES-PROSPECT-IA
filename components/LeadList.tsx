
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Lead } from '../types';
import { Icons } from '../constants';
import { searchNewLeads } from '../services/geminiService';
import { Skeleton } from './Skeleton';
import { useStore } from '../store/useStore'; // Zustand

interface LeadListProps {
  leads: Lead[];
  onSelect: (lead: Lead) => void;
  onAddLeads: (leads: Lead[]) => void;
}

// Helper for dynamic colors
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 50%)`;
};

// --- ADVANCED SEARCH LOGIC ---
const mapFieldAlias = (field: string) => {
    const map: Record<string, keyof Lead | string> = {
        'nome': 'companyName',
        'name': 'companyName',
        'empresa': 'companyName',
        'setor': 'sector',
        'sector': 'sector',
        'local': 'location',
        'cidade': 'location',
        'score': 'score',
        'pontos': 'score',
        'status': 'status',
        'tag': 'tags',
        'tags': 'tags'
    };
    return map[field.toLowerCase()] || field;
};

const checkCondition = (lead: Lead, term: string): boolean => {
    let cleanTerm = term;
    let negate = false;

    if (cleanTerm.startsWith('-')) {
        negate = true;
        cleanTerm = cleanTerm.substring(1);
    } else if (cleanTerm.toUpperCase().startsWith('NOT:')) {
        negate = true;
        cleanTerm = cleanTerm.substring(4);
    }

    let match = false;
    const lowerTerm = cleanTerm.toLowerCase();

    const comparisonMatch = cleanTerm.match(/^([a-zA-Z]+)(>=|<=|>|<|=)(.+)$/);
    
    if (comparisonMatch) {
        const [, fieldRaw, operator, valueRaw] = comparisonMatch;
        const fieldKey = mapFieldAlias(fieldRaw) as keyof Lead;
        // @ts-ignore
        const leadValue = lead[fieldKey];
        const numValue = parseFloat(valueRaw);
        const leadNum = typeof leadValue === 'number' ? leadValue : parseFloat(String(leadValue));

        if (!isNaN(numValue) && !isNaN(leadNum)) {
            switch (operator) {
                case '>': match = leadNum > numValue; break;
                case '>=': match = leadNum >= numValue; break;
                case '<': match = leadNum < numValue; break;
                case '<=': match = leadNum <= numValue; break;
                case '=': match = leadNum === numValue; break;
            }
        }
    } 
    else if (cleanTerm.includes(':')) {
        const [fieldRaw, value] = cleanTerm.split(':');
        const fieldKey = mapFieldAlias(fieldRaw) as keyof Lead;
        // @ts-ignore
        const leadValue = lead[fieldKey];

        if (Array.isArray(leadValue)) {
            match = leadValue.some(v => String(v).toLowerCase().includes(value.toLowerCase()));
        } else if (leadValue !== undefined && leadValue !== null) {
            match = String(leadValue).toLowerCase().includes(value.toLowerCase());
        }
    } 
    else {
        const searchStr = `${lead.companyName} ${lead.sector} ${lead.location} ${lead.tags.join(' ')} ${lead.status}`.toLowerCase();
        match = searchStr.includes(lowerTerm);
    }

    return negate ? !match : match;
};

const LeadList: React.FC<LeadListProps> = ({ leads, onSelect, onAddLeads }) => {
  const isLoading = useStore(state => state.isLoading); // Global loading state
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [showAISearch, setShowAISearch] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Advanced AI Search Form State
  const [aiSector, setAiSector] = useState('Varejo Automotivo');
  const [aiLocation, setAiLocation] = useState('São Paulo, SP');
  const [aiKeywords, setAiKeywords] = useState('Peças, Pneus, Serviços');
  const [aiSize, setAiSize] = useState('Pequena/Média');

  const filteredLeads = useMemo(() => {
    if (!searchTerm.trim()) return leads;
    const orGroups = searchTerm.split(/\s+OR\s+/i);
    return leads.filter(lead => {
        return orGroups.some(group => {
            const andTerms = group.trim().split(/\s+/).filter(t => t.toUpperCase() !== 'AND');
            return andTerms.every(term => checkCondition(lead, term));
        });
    });
  }, [leads, searchTerm]);

  useEffect(() => {
    const main = document.querySelector('main');
    const handleScroll = () => {
        if (main && main.scrollTop > 300) setShowScrollTop(true);
        else setShowScrollTop(false);
    };
    main?.addEventListener('scroll', handleScroll);
    return () => main?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
      document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchingAI(true);
    
    // Increased quality request
    const results = await searchNewLeads(aiSector, aiLocation, aiKeywords, aiSize, 3);
    
    // Convert Partial<Lead> to full Lead with defaults
    const newLeads: Lead[] = results.map(r => ({
      id: crypto.randomUUID(),
      companyName: r.companyName || 'Empresa Desconhecida',
      sector: r.sector || aiSector,
      location: r.location || aiLocation,
      score: r.score || 50,
      status: 'new',
      tags: r.tags || ['✨ IA Gold'],
      website: r.website,
      phone: r.phone,
      techStack: r.techStack,
      revenueEstimate: r.revenueEstimate,
      // @ts-ignore
      matchReason: r.matchReason, 
      createdAt: new Date().toISOString(),
      ...r
    }));

    onAddLeads(newLeads);
    setIsSearchingAI(false);
    setShowAISearch(false);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          const text = event.target?.result as string;
          const lines = text.split('\n');
          const newLeads: Lead[] = [];
          
          for(let i = 1; i < lines.length; i++) {
              if(!lines[i].trim()) continue;
              const cols = lines[i].split(',');
              if(cols.length >= 1) {
                  newLeads.push({
                      id: crypto.randomUUID(),
                      companyName: cols[0]?.trim() || 'Sem Nome',
                      sector: cols[1]?.trim() || 'Geral',
                      location: cols[2]?.trim() || 'Brasil',
                      score: 50,
                      status: 'new',
                      tags: ['Importado'],
                      createdAt: new Date().toISOString()
                  });
              }
          }
          if(newLeads.length > 0) onAddLeads(newLeads);
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openGoogleMaps = (location: string, company: string) => {
    const query = encodeURIComponent(`${company} ${location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Nome,Setor,Local,Score\n"
        + leads.map(e => `${e.companyName},${e.sector},${e.location},${e.score}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_sales_prospector.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const columns = {
      new: filteredLeads.filter(l => l.status === 'new'),
      qualifying: filteredLeads.filter(l => l.status === 'qualifying'),
      contacted: filteredLeads.filter(l => l.status === 'contacted'),
      negotiation: filteredLeads.filter(l => l.status === 'negotiation'),
      won: filteredLeads.filter(l => l.status === 'won'),
      lost: filteredLeads.filter(l => l.status === 'lost'),
  };

  const columnNames: Record<string, string> = {
      new: '🔵 Novos',
      qualifying: '🟡 Qualificação',
      contacted: '🟠 Contatados',
      negotiation: '🟣 Negociação',
      won: '🟢 Ganhos',
      lost: '🔴 Perdidos'
  };

  return (
    <div className="space-y-8 pb-20">
      
      <input 
        type="file" 
        accept=".csv" 
        ref={fileInputRef} 
        onChange={handleImportCSV} 
        className="hidden" 
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-8 border-b border-slate-200 dark:border-white/10">
        <div>
          <h2 className="text-5xl font-black dark:text-white mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
            Oportunidades
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">Gerencie seu pipeline de ouro.</p>
        </div>
        <div className="flex flex-wrap gap-4">
             <div className="flex bg-slate-100 dark:bg-white/5 rounded-full p-1 border border-slate-200 dark:border-white/10">
                 <button 
                    onClick={() => setViewMode('list')} 
                    className={`p-3 rounded-full transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow text-purple-600' : 'text-slate-400'}`}
                    title="Visualização em Lista"
                 >
                     <Icons.List />
                 </button>
                 <button 
                    onClick={() => setViewMode('kanban')} 
                    className={`p-3 rounded-full transition-all ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 shadow text-purple-600' : 'text-slate-400'}`}
                    title="Visualização Kanban"
                 >
                     <Icons.Kanban />
                 </button>
             </div>

             <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-4 rounded-[2rem] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 transition-all flex items-center gap-2"
                title="Importar CSV"
             >
                <Icons.Upload /> Importar
             </button>
             <button 
                onClick={exportCSV}
                className="px-6 py-4 rounded-[2rem] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 transition-all flex items-center gap-2"
                title="Exportar para CSV"
             >
                <Icons.Check /> Exportar
             </button>
             <button 
                onClick={() => setShowAISearch(!showAISearch)}
                className={`relative px-8 py-4 rounded-[2rem] font-bold text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-3 overflow-hidden ${showAISearch ? 'bg-slate-200 text-slate-600' : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-amber-500/30 ring-2 ring-amber-400/50'}`}
                title="Abrir Painel de Inteligência Artificial"
             >
                 <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <Icons.Robot />
                {showAISearch ? 'Fechar Painel IA' : 'Nova Prospecção IA'}
             </button>
        </div>
      </div>

      {/* Advanced AI Search Panel */}
      {showAISearch && (
        <div className="bg-[#0B1120] p-10 rounded-[3rem] shadow-2xl border border-white/10 animate-in fade-in slide-in-from-top-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-8 text-white flex items-center gap-4">
               <span className="p-4 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl text-white shadow-lg shadow-orange-500/30"><Icons.Sparkles /></span>
               Inteligência de Prospecção Suprema
            </h3>
            
            <form onSubmit={handleAISearch} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-white/80 font-bold text-lg ml-2 flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Setor Alvo</label>
                    <input type="text" value={aiSector} onChange={e => setAiSector(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-xl text-white placeholder-white/20 focus:bg-white/10 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all"/>
                </div>
                <div className="space-y-3">
                    <label className="text-white/80 font-bold text-lg ml-2 flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-full"></span> Região</label>
                    <input type="text" value={aiLocation} onChange={e => setAiLocation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-xl text-white placeholder-white/20 focus:bg-white/10 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all"/>
                </div>
                <div className="space-y-3">
                    <label className="text-white/80 font-bold text-lg ml-2 flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Critérios</label>
                    <input type="text" value={aiKeywords} onChange={e => setAiKeywords(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-xl text-white placeholder-white/20 focus:bg-white/10 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all"/>
                </div>
                <div className="space-y-3">
                    <label className="text-white/80 font-bold text-lg ml-2 flex items-center gap-2"><span className="w-2 h-2 bg-pink-500 rounded-full"></span> Porte</label>
                    <select value={aiSize} onChange={e => setAiSize(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-xl text-white focus:bg-white/10 focus:border-amber-400 outline-none transition-all"><option className="text-slate-900">Pequena</option><option className="text-slate-900">Média/Grande</option></select>
                </div>

                <div className="md:col-span-2 pt-6">
                    <button 
                        type="submit" 
                        disabled={isSearchingAI}
                        className="w-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-white py-8 rounded-[2rem] font-black text-2xl shadow-[0_0_50px_rgba(245,158,11,0.3)] hover:shadow-[0_0_80px_rgba(245,158,11,0.5)] hover:scale-[1.01] transition-all disabled:opacity-70 disabled:grayscale relative overflow-hidden group/btn"
                    >
                         <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                         {isSearchingAI ? (
                             <span className="flex items-center justify-center gap-4 animate-pulse"><Icons.Refresh /> RASTREADO SATÉLITE DE DADOS...</span>
                         ) : (
                             <span className="flex items-center justify-center gap-4 relative z-10">🚀 INICIAR VARREDURA INTELIGENTE</span>
                         )}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* Advanced Search Filter Input */}
      <div className="relative group max-w-3xl">
        <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none text-slate-400">
          <Icons.Search />
        </div>
        <input 
          type="text" 
          placeholder='Busca Avançada (Ex: setor:tech score>80 OR local:SP -varejo)' 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-8 py-6 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-lg text-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none dark:text-white backdrop-blur-sm"
        />
        <div className="absolute top-full left-0 mt-2 p-4 bg-slate-800 text-white text-xs rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none z-50 w-full shadow-xl">
            <p className="font-bold mb-1">Sintaxe de Busca:</p>
            <ul className="grid grid-cols-2 gap-2">
                <li><code>setor:Tecnologia</code> (Filtro por campo)</li>
                <li><code>score&gt;80</code> (Comparação numérica)</li>
                <li><code>local:SP OR local:RJ</code> (Operador OR)</li>
                <li><code>-varejo</code> ou <code>NOT:varejo</code> (Negação)</li>
            </ul>
        </div>
      </div>

      {/* SKELETON LOADING STATE */}
      {(isSearchingAI || isLoading) && (
          <div className="grid grid-cols-1 gap-8">
              {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-[#0F1629] p-10 rounded-[3rem] border border-slate-100 dark:border-white/5">
                      <div className="flex gap-8">
                          <Skeleton className="w-24 h-24 rounded-[2rem]" />
                          <div className="flex-1 space-y-4">
                              <Skeleton className="h-8 w-1/3" />
                              <Skeleton className="h-4 w-1/4" />
                              <Skeleton className="h-20 w-full" />
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* LIST VIEW */}
      {!isSearchingAI && !isLoading && viewMode === 'list' && (
        <div className="grid grid-cols-1 gap-8">
            {filteredLeads.map((lead) => (
            <div 
                key={lead.id} 
                className={`group relative bg-white dark:bg-[#0F1629] p-10 rounded-[3rem] border transition-all duration-300 hover:scale-[1.01] ${
                    lead.score > 80 
                    ? 'border-amber-400/50 dark:border-amber-500/50 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.15)]' 
                    : 'border-slate-100 dark:border-white/5 shadow-xl hover:shadow-2xl'
                }`}
            >
                {/* High Score Badge */}
                {lead.score > 80 && (
                    <div className="absolute -top-5 right-12 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-10 ring-4 ring-white dark:ring-[#05050A]">
                        <Icons.Sparkles /> Oportunidade Ouro
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between gap-10">
                    {/* Left: Avatar & Info */}
                    <div className="flex gap-8 items-start flex-1">
                        <div 
                            className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl"
                            style={{ backgroundColor: stringToColor(lead.companyName) }}
                        >
                            {lead.companyName.charAt(0)}
                        </div>
                        
                        <div className="space-y-3">
                            <h3 className="text-3xl font-bold dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 transition-all">
                                {lead.companyName}
                            </h3>
                            <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                <span className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5">🏢 {lead.sector}</span>
                                <span className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5">📍 {lead.location}</span>
                            </div>
                            
                            {(lead as any).matchReason && (
                                <div className="mt-4 p-5 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 max-w-2xl relative">
                                    <div className="absolute -left-2 top-6 w-0 h-0 border-t-[10px] border-t-transparent border-r-[10px] border-r-indigo-50 dark:border-r-indigo-500/10 border-b-[10px] border-b-transparent"></div>
                                    <p className="text-base text-indigo-800 dark:text-indigo-300 italic flex gap-3 items-start leading-relaxed">
                                        <span className="text-2xl">💡</span> "{(lead as any).matchReason}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Actions & Score */}
                    <div className="flex flex-col items-end gap-6 min-w-[200px]">
                        <div className="text-right p-4 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 w-full">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Score IA</p>
                            <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {lead.score}<span className="text-lg text-slate-300 dark:text-slate-600">/100</span>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full">
                            <button 
                                onClick={() => openGoogleMaps(lead.location || '', lead.companyName)}
                                className="w-16 h-16 flex items-center justify-center rounded-[1.5rem] bg-slate-100 dark:bg-white/10 text-slate-400 hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-500/20 dark:hover:text-blue-400 transition-colors"
                                title="Ver no Mapa"
                            >
                                <Icons.Search />
                            </button>
                            <button 
                                onClick={() => onSelect(lead)}
                                className="flex-1 px-8 py-4 rounded-[1.5rem] font-bold text-white bg-[#0B1120] dark:bg-white dark:text-[#0B1120] hover:bg-purple-600 dark:hover:bg-purple-500 dark:hover:text-white transition-all shadow-xl hover:shadow-purple-500/25 flex items-center justify-center gap-3 group/btn"
                            >
                                Detalhes <span className="text-xl group-hover/btn:translate-x-1 transition-transform">➔</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>
      )}

      {/* KANBAN VIEW */}
      {!isSearchingAI && !isLoading && viewMode === 'kanban' && (
          <div className="flex gap-6 overflow-x-auto pb-12 snap-x">
              {Object.keys(columns).map(status => (
                  <div key={status} className="min-w-[320px] bg-slate-100 dark:bg-white/5 rounded-[2rem] p-4 flex flex-col h-min snap-center">
                      <div className="flex items-center justify-between mb-4 px-2">
                          <h3 className="font-bold text-slate-600 dark:text-slate-300">{columnNames[status]}</h3>
                          <span className="bg-slate-200 dark:bg-white/10 px-2 py-1 rounded-lg text-xs font-bold">{columns[status as keyof typeof columns].length}</span>
                      </div>
                      <div className="space-y-4">
                          {columns[status as keyof typeof columns].map(lead => (
                              <div key={lead.id} onClick={() => onSelect(lead)} className="bg-white dark:bg-[#0F1629] p-5 rounded-3xl shadow-sm border border-slate-200 dark:border-white/5 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]">
                                  <div className="flex justify-between items-start mb-3">
                                      <div 
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                                        style={{ backgroundColor: stringToColor(lead.companyName) }}
                                      >
                                          {lead.companyName.charAt(0)}
                                      </div>
                                      {lead.score > 70 && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">🔥 {lead.score}</span>}
                                  </div>
                                  <h4 className="font-bold text-slate-800 dark:text-white mb-1 line-clamp-1">{lead.companyName}</h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{lead.sector}</p>
                                  <div className="flex justify-end">
                                      <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">Detalhes →</span>
                                  </div>
                              </div>
                          ))}
                          {columns[status as keyof typeof columns].length === 0 && (
                              <div className="text-center py-8 text-slate-400 text-sm italic border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl">
                                  Vazio
                              </div>
                          )}
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* Scroll To Top Button */}
      <button 
        onClick={handleScrollToTop}
        className={`fixed bottom-6 right-6 w-12 h-12 bg-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-40 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
        title="Voltar ao Topo"
      >
          <Icons.ArrowUp />
      </button>

      {/* Empty State */}
      {!isSearchingAI && !isLoading && filteredLeads.length === 0 && (
          <div className="py-40 text-center rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-white/10">
            <div className="inline-block p-8 bg-slate-100 dark:bg-white/5 rounded-full mb-8">
              <div className="text-slate-400 dark:text-slate-500 scale-150"><Icons.Search /></div>
            </div>
            <h3 className="text-4xl font-bold text-slate-300 dark:text-slate-600">Nenhum lead encontrado</h3>
            <p className="text-slate-400 mt-4 text-lg">Tente ajustar seus filtros ou use a Inteligência Suprema.</p>
          </div>
      )}
    </div>
  );
};

export default LeadList;
