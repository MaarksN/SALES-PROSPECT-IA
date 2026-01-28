
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { SavedGen } from '../types';
import { Icons } from '../constants';
import { useStore } from '../store/useStore';
import { useLocalStorage } from '../hooks/useLocalStorage';

const weeklyData = [
  { name: 'Seg', leads: 4, value: 2400 },
  { name: 'Ter', leads: 7, value: 4500 },
  { name: 'Qua', leads: 5, value: 3200 },
  { name: 'Qui', leads: 10, value: 6800 },
  { name: 'Sex', leads: 8, value: 5100 },
  { name: 'Sáb', leads: 2, value: 1200 },
  { name: 'Dom', leads: 3, value: 1800 },
];

const COLORS = ['#8b5cf6', '#f59e0b', '#3b82f6', '#ec4899'];

const Dashboard: React.FC = () => {
  const leads = useStore(state => state.leads);
  const [savedGens] = useLocalStorage<SavedGen[]>('sales_ai_history', []);

  // Compute Stats from Real Store Data
  const stats = useMemo(() => {
    return {
        totalLeads: leads.length,
        qualifiedLeads: leads.filter(l => l.score > 70).length,
        conversionRate: leads.length > 0 ? ((leads.filter(l => l.status === 'won').length / leads.length) * 100).toFixed(1) : 0,
        projectedRevenue: leads.length * 15000 // Mock value per lead
    }
  }, [leads]);

  const pieData = useMemo(() => [
      { name: 'Novos', value: leads.filter(l => l.status === 'new').length },
      { name: 'Qualificados', value: leads.filter(l => l.status === 'qualifying').length },
      { name: 'Negociação', value: leads.filter(l => l.status === 'negotiation').length },
      { name: 'Fechados', value: leads.filter(l => l.status === 'won').length },
  ].filter(d => d.value > 0), [leads]);

  const toolStats = React.useMemo(() => {
      const counts: Record<string, number> = {};
      savedGens.forEach(gen => {
          counts[gen.toolName] = (counts[gen.toolName] || 0) + 1;
      });
      return Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name: name.split('.')[1] || name, count }));
  }, [savedGens]);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                Command Center
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Visão tática do seu império de vendas.</p>
        </div>
        <div className="hidden md:flex gap-2">
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Mercado Ativo
            </span>
        </div>
      </div>
      
      {/* KPI Cards - Glassmorphism & Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="relative overflow-hidden bg-white dark:bg-[#0F1629] p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="bg-blue-500 w-24 h-24 rounded-full blur-2xl"></div>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                    <Icons.Leads />
                </div>
                <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">+12%</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Total de Leads</p>
            <p className="text-4xl font-black text-slate-800 dark:text-white">{stats.totalLeads}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative overflow-hidden bg-white dark:bg-[#0F1629] p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="bg-amber-500 w-24 h-24 rounded-full blur-2xl"></div>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl text-amber-600 dark:text-amber-400">
                    <Icons.Sparkles />
                </div>
                <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">+8%</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Qualificados (IA)</p>
            <p className="text-4xl font-black text-slate-800 dark:text-white">{stats.qualifiedLeads}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative overflow-hidden bg-white dark:bg-[#0F1629] p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="bg-purple-500 w-24 h-24 rounded-full blur-2xl"></div>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-purple-600 dark:text-purple-400">
                    <Icons.Kanban />
                </div>
                <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">-2%</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Taxa de Conversão</p>
            <p className="text-4xl font-black text-slate-800 dark:text-white">{stats.conversionRate}%</p>
          </div>
        </div>

        {/* Card 4 - Revenue */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-[2rem] shadow-2xl border border-white/10 group hover:scale-[1.02] transition-transform">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full blur-3xl opacity-30"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/10 rounded-2xl text-amber-400 backdrop-blur-md">
                    <span className="text-xl font-bold">$</span>
                </div>
                <span className="text-xs font-bold text-amber-300 bg-amber-900/50 px-2 py-1 rounded-lg border border-amber-500/30">Pipeline</span>
            </div>
            <p className="text-slate-300 font-medium mb-1">Receita Projetada</p>
            <p className="text-3xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                R$ {stats.projectedRevenue.toLocaleString('pt-BR', { notation: "compact" })}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0F1629] p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5 relative overflow-hidden">
             <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
                 <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                 Fluxo de Oportunidades
             </h3>
             <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                    <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                            color: '#fff'
                        }}
                    />
                    <Area type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorLeads)" />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-[#0F1629] p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5">
             <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
                 <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                 Distribuição
             </h3>
             <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={pieData.length > 0 ? pieData : [{name:'Sem dados', value:1}]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            borderRadius: '12px', 
                            border: 'none', 
                            color: '#fff'
                        }}
                    />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-800 dark:text-white">{leads.length}</span>
                    <span className="text-xs text-slate-400 uppercase font-bold">Leads</span>
                </div>
             </div>
             
             {/* Legend */}
             <div className="grid grid-cols-2 gap-4 mt-4">
                 {pieData.map((entry, index) => (
                     <div key={index} className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                         <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{entry.name}</span>
                     </div>
                 ))}
             </div>
        </div>
      </div>

      {/* TOOLS ANALYTICS REPORT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#0F1629] p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5">
            <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
                Top Ferramentas Usadas
            </h3>
            {toolStats.length > 0 ? (
                <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={toolStats} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={150} tick={{fill: '#94a3b8', fontSize: 11}} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', background: '#1e293b', color: '#fff' }} />
                            <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-60 flex items-center justify-center text-slate-400 text-sm italic">
                    Nenhuma ferramenta salva ainda.
                </div>
            )}
        </div>

        <div className="bg-white dark:bg-[#0F1629] p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5">
             <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                Atividade Recente (IA)
             </h3>
             <div className="space-y-6">
                {savedGens.slice(0, 3).map((gen) => (
                    <div key={gen.id} className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-xl">
                            🤖
                        </div>
                        <div>
                            <p className="text-slate-800 dark:text-white font-bold">{gen.toolName}</p>
                            <p className="text-sm text-slate-500 truncate max-w-[200px]">Gerado com sucesso</p>
                        </div>
                        <span className="ml-auto text-xs font-bold text-slate-400">
                            {new Date(gen.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                ))}
                {savedGens.length === 0 && (
                    <div className="text-center text-slate-400 text-sm">Sem atividade recente</div>
                )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
