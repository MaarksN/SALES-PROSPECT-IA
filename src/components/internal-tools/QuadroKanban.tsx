import React from "react";
import { MoreHorizontal, Plus } from "lucide-react";

const COLUMNS = [
  { id: "todo", title: "A Fazer", color: "bg-slate-100 dark:bg-slate-800" },
  { id: "doing", title: "Em Progresso", color: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "done", title: "Concluído", color: "bg-green-50 dark:bg-green-900/20" },
];

export default function QuadroKanban() {
  return (
    <div className="flex h-[80vh] gap-6 overflow-x-auto pb-4">
        {COLUMNS.map(col => (
            <div key={col.id} className={`w-80 flex-shrink-0 rounded-xl ${col.color} p-4 flex flex-col`}>
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200">{col.title}</h3>
                    <MoreHorizontal size={16} className="text-slate-400"/>
                </div>

                <div className="flex-1 space-y-3">
                    {/* Card Exemplo */}
                    <div className="cursor-grab rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-slate-900 dark:border dark:border-slate-700">
                        <p className="text-sm font-medium dark:text-white">Implementar Login</p>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">Dev</span>
                        </div>
                    </div>
                </div>

                <button className="mt-3 flex w-full items-center justify-center rounded-lg border border-dashed border-slate-300 py-2 text-sm text-slate-500 hover:bg-white/50 dark:border-slate-600">
                    <Plus size={16} className="mr-1"/> Add Card
                </button>
            </div>
        ))}
    </div>
  );
}