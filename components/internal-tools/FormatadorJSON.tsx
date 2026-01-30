
import React, { useState } from 'react';

export const FormatadorJSON = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const format = () => {
        try {
            const obj = JSON.parse(input);
            setOutput(JSON.stringify(obj, null, 2));
        } catch (e) {
            setOutput("❌ Erro: JSON Inválido");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
            <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 mb-1 uppercase">Entrada (Minificado)</label>
                <textarea
                    className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder='Cole seu JSON bagunçado aqui...'
                />
            </div>
            <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 mb-1 uppercase">Saída (Prettified)</label>
                <textarea
                    className="flex-1 p-3 border rounded-xl bg-slate-50 font-mono text-xs text-slate-700"
                    value={output}
                    readOnly
                    placeholder="O resultado formatado aparecerá aqui..."
                />
            </div>
            <button onClick={format} className="md:col-span-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all">✨ Formatar JSON</button>
        </div>
    );
};
