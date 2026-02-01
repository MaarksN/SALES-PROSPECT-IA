import React from "react";
import { useStore } from "@/store/useStore";
import { Users, DollarSign, Activity, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/Button";

const data = [
  { name: "Seg", leads: 4 },
  { name: "Ter", leads: 7 },
  { name: "Qua", leads: 12 },
  { name: "Qui", leads: 24 },
  { name: "Sex", leads: 18 },
  { name: "Sab", leads: 10 },
  { name: "Dom", leads: 5 },
];

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800 transition-all hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
      </div>
      <div className="rounded-full bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className="font-bold text-green-500">{trend}</span>
      <span className="ml-2 text-slate-400">vs. mês anterior</span>
    </div>
  </div>
);

export default function Dashboard() {
  const { userContext } = useStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Olá, {userContext?.name.split(" ")[0]}</h1>
            <p className="text-slate-500">Aqui está o pulso das suas vendas hoje.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">Exportar Relatório</Button>
            <Button>Nova Campanha</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Leads" value="1,240" icon={Users} trend="+12%" />
        <StatCard title="Receita Estimada" value="R$ 420k" icon={DollarSign} trend="+8%" />
        <StatCard title="Taxa de Conversão" value="3.2%" icon={Activity} trend="+0.4%" />
        <StatCard title="Novos Hoje" value="18" icon={TrendingUp} trend="+4" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="mb-6 text-lg font-bold dark:text-white">Aquisição de Leads (7 Dias)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#94a3b8"}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: "#94a3b8"}} />
                        <Tooltip
                            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                        />
                        <Area type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-xl">
            <h3 className="text-xl font-bold">Dica da IA</h3>
            <p className="mt-4 text-indigo-100 leading-relaxed">
                Baseado nos seus últimos leads, empresas do setor de <strong>Logística</strong> estão convertendo 2x mais rápido.
            </p>
            <div className="mt-8 bg-white/10 rounded-xl p-4 backdrop-blur-md">
                <p className="text-sm font-bold uppercase tracking-wider opacity-70">Ação Recomendada</p>
                <p className="mt-1 font-medium">Ativar campanha "Logística Enterprise"</p>
            </div>
            <Button variant="secondary" className="mt-6 w-full text-indigo-700 font-bold bg-white hover:bg-slate-100">Executar Automação</Button>
        </div>
      </div>
    </div>
  );
}
