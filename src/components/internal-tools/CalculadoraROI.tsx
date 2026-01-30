import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function CalculadoraROI() {
  const [custo, setCusto] = useState(0);
  const [receita, setReceita] = useState(0);
  const [roi, setRoi] = useState<number | null>(null);

  const calcular = () => {
    if (custo > 0) {
      const res = ((receita - custo) / custo) * 100;
      setRoi(res);
    }
  };

  return (
    <div className="max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-900">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Calculadora ROI</h2>
      <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Custo do Investimento (R$)</label>
            <input type="number" value={custo} onChange={e => setCusto(Number(e.target.value))} className="mt-1 w-full rounded-md border p-2 dark:bg-slate-800 dark:text-white" />
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Receita Gerada (R$)</label>
            <input type="number" value={receita} onChange={e => setReceita(Number(e.target.value))} className="mt-1 w-full rounded-md border p-2 dark:bg-slate-800 dark:text-white" />
        </div>
        <Button onClick={calcular} className="w-full">Calcular ROI</Button>
      </div>
      {roi !== null && (
        <div className={`mt-6 rounded-lg p-4 text-center ${roi >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <p className="text-sm font-bold uppercase">Resultado</p>
            <p className="text-3xl font-black">{roi.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}