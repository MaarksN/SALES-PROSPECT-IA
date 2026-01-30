
import React, { useState } from 'react';
import { logger } from '../../lib/logger';

export const VisualizadorLogs = () => {
    const [logs, setLogs] = useState<any[]>([]);

    const refresh = () => {
        setLogs([
            { level: 'info', msg: 'Sistema iniciado', time: new Date().toLocaleTimeString('pt-BR') },
            { level: 'warn', msg: 'Limite de API próximo (80%)', time: new Date().toLocaleTimeString('pt-BR') },
            { level: 'error', msg: 'Falha na conexão com Redis Local', time: new Date().toLocaleTimeString('pt-BR') },
        ]);
    };

    return (
        <div className="p-4 bg-slate-900 text-green-400 font-mono rounded-xl h-64 overflow-y-auto">
            <div className="flex justify-between mb-2 border-b border-green-900 pb-2">
                <span className="font-bold">🖥️ Logs do Sistema</span>
                <button onClick={refresh} className="text-xs border border-green-700 px-2 py-1 rounded hover:bg-green-900 transition-colors">Atualizar</button>
            </div>
            {logs.length === 0 && <div className="text-slate-600 text-xs text-center mt-10">Nenhum log registrado.</div>}
            {logs.map((log, i) => (
                <div key={i} className="text-xs mb-1 border-b border-green-900/30 pb-1">
                    <span className="opacity-50">[{log.time}]</span> <span className={log.level === 'error' ? 'text-red-500 font-bold' : log.level === 'warn' ? 'text-yellow-500 font-bold' : 'text-green-400'}>{log.level.toUpperCase()}:</span> {log.msg}
                </div>
            ))}
        </div>
    );
};
