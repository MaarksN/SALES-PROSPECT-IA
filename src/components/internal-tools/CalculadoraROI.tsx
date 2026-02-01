import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function CalculadoraROI() {
  const [leads, setLeads] = useState(1000);
  const [conversion, setConversion] = useState(2);
  const [ticket, setTicket] = useState(500);

  const revenue = leads * (conversion / 100) * ticket;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Simulador de ROI</h2>

        <div className="grid gap-6 mb-8">
            <div>
                <label className="block text-sm font-bold mb-2">Leads Gerados / Mês</label>
                <input type="number" value={leads} onChange={e => setLeads(Number(e.target.value))} className="w-full p-3 rounded-lg border dark:bg-slate-950 dark:border-slate-800"/>
            </div>
            <div>
                <label className="block text-sm font-bold mb-2">Taxa de Conversão (%)</label>
                <input type="number" value={conversion} onChange={e => setConversion(Number(e.target.value))} className="w-full p-3 rounded-lg border dark:bg-slate-950 dark:border-slate-800"/>
            </div>
            <div>
                <label className="block text-sm font-bold mb-2">Ticket Médio (R$)</label>
                <input type="number" value={ticket} onChange={e => setTicket(Number(e.target.value))} className="w-full p-3 rounded-lg border dark:bg-slate-950 dark:border-slate-800"/>
            </div>
        </div>

        <div className="bg-indigo-50 p-6 rounded-xl text-center dark:bg-indigo-900/20">
            <p className="text-sm text-indigo-600 font-bold uppercase dark:text-indigo-400">Receita Projetada</p>
            <p className="text-4xl font-black text-indigo-700 mt-2 dark:text-white">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(revenue)}
            </p>
        </div>
    </div>
  );
}
