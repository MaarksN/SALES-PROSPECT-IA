
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export const WikiInterna = () => {
    const [text, setText] = useState('# 📚 Bem-vindo à Wiki Local\n\nUse este espaço para documentar processos, scripts de vendas e anotações rápidas.\n\n- [ ] Tarefa 1\n- [ ] Tarefa 2\n\n**Suporta Markdown!**');
    const [mode, setMode] = useState<'edit' | 'view'>('edit');

    return (
        <div className="h-64 flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2">
                <h3 className="font-bold flex items-center gap-2">📝 Wiki & Anotações</h3>
                <div className="flex bg-slate-100 rounded-lg p-1">
                    <button
                        onClick={() => setMode('edit')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'edit' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => setMode('view')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'view' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Visualizar
                    </button>
                </div>
            </div>
            {mode === 'edit' ? (
                <textarea
                    className="flex-1 p-3 border rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono text-slate-700 bg-slate-50"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Comece a escrever em Markdown..."
                />
            ) : (
                <div className="flex-1 overflow-y-auto prose prose-sm prose-slate p-3 border rounded-xl bg-white"><ReactMarkdown>{text}</ReactMarkdown></div>
            )}
        </div>
    );
};
