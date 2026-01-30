
import React, { useState } from 'react';

export const CalculadoraROI = () => {
    const [cost, setCost] = useState(1000);
    const [revenue, setRevenue] = useState(5000);
    const roi = ((revenue - cost) / cost) * 100;

    return (
        <div className="p-6 bg-slate-50 rounded-xl text-center border border-slate-200">
            <h3 className="font-bold mb-6 text-lg">📈 Calculadora de ROI</h3>
            <div className="flex justify-center gap-4 mb-6">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Custo (R$)</label>
                    <input type="number" className="p-2 border rounded-lg w-28 text-center font-bold text-slate-700" value={cost} onChange={e => setCost(Number(e.target.value))} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Receita (R$)</label>
                    <input type="number" className="p-2 border rounded-lg w-28 text-center font-bold text-slate-700" value={revenue} onChange={e => setRevenue(Number(e.target.value))} />
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase">Retorno sobre Investimento</span>
                <div className={`text-4xl font-black mt-1 ${roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>{roi.toFixed(1)}%</div>
            </div>
        </div>
    );
};
