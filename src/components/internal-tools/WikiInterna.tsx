import React from "react";
import { Book } from "lucide-react";

export default function WikiInterna() {
  return (
    <div className="flex h-[80vh] gap-6">
        <div className="w-64 border-r pr-6 dark:border-slate-800">
            <h3 className="mb-4 flex items-center gap-2 font-bold dark:text-white"><Book size={16}/> Documentação</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="font-bold text-indigo-600">Começando</li>
                <li className="pl-4 hover:text-indigo-500 cursor-pointer">Instalação</li>
                <li className="pl-4 hover:text-indigo-500 cursor-pointer">Configuração .env</li>
                <li className="font-bold text-indigo-600 mt-4">API Reference</li>
                <li className="pl-4 hover:text-indigo-500 cursor-pointer">/leads</li>
                <li className="pl-4 hover:text-indigo-500 cursor-pointer">/auth</li>
            </ul>
        </div>
        <div className="flex-1 prose dark:prose-invert">
            <h1 className="text-3xl font-bold dark:text-white">Bem-vindo à Wiki</h1>
            <p className="text-slate-500">Este é o centro de conhecimento do Sales Prospector v2.</p>
            <hr className="my-6 border-slate-200 dark:border-slate-800"/>
            <h2 className="text-xl font-bold dark:text-white">Arquitetura</h2>
            <p className="text-slate-500">O sistema utiliza React 18, Vite e Supabase.</p>
        </div>
    </div>
  );
}