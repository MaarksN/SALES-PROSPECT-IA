import React from "react";
import { Link } from "react-router-dom";
import { Calculator, FileText, MessageSquare, Trello, PenTool, Database } from "lucide-react";

const TOOLS = [
  { name: "Calculadora ROI", icon: Calculator, color: "text-blue-500", bg: "bg-blue-50", link: "/tools/roi" },
  { name: "Gerador de Faturas", icon: FileText, color: "text-green-500", bg: "bg-green-50", link: "/tools/invoice" },
  { name: "Linkador WhatsApp", icon: MessageSquare, color: "text-green-600", bg: "bg-green-100", link: "/tools/whatsapp" },
  { name: "Kanban Board", icon: Trello, color: "text-purple-500", bg: "bg-purple-50", link: "/tools/kanban" },
  { name: "Lousa Virtual", icon: PenTool, color: "text-orange-500", bg: "bg-orange-50", link: "/tools/whiteboard" },
  { name: "Formatador JSON", icon: Database, color: "text-slate-500", bg: "bg-slate-100", link: "/tools/json" },
];

export default function InternalToolsDashboard() {
  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold mb-2 dark:text-white">Ferramentas Internas</h1>
      <p className="text-slate-500 mb-8">Utilitários para acelerar seu dia a dia.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {TOOLS.map((tool) => (
          <Link
            key={tool.name}
            to={tool.link}
            className="group flex flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm border border-slate-100 transition-all hover:shadow-md hover:-translate-y-1 dark:bg-slate-900 dark:border-slate-800"
          >
            <div className={`mb-4 rounded-2xl ${tool.bg} p-4 dark:bg-slate-800`}>
              <tool.icon className={`h-8 w-8 ${tool.color}`} />
            </div>
            <h3 className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{tool.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}