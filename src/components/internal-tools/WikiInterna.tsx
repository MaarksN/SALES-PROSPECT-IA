import React, { useState } from "react";
import { Search } from "lucide-react";

export default function WikiInterna() {
  const [search, setSearch] = useState("");

  const articles = [
    { title: "Onboarding de Vendas", content: "Guia completo para novos SDRs..." },
    { title: "Script de Cold Call", content: "Olá, falo com [Nome]? O motivo..." },
    { title: "Objeções Comuns", content: "Como lidar com 'não tenho orçamento'..." },
  ];

  const filtered = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto">
        <div className="mb-8 relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" />
            <input
                placeholder="Buscar na base de conhecimento..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-800"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </div>
        <div className="grid gap-4">
            {filtered.map((article, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-800">
                    <h3 className="text-xl font-bold mb-2 dark:text-white">{article.title}</h3>
                    <p className="text-slate-500 line-clamp-2">{article.content}</p>
                </div>
            ))}
        </div>
    </div>
  );
}
