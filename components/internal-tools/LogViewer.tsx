
import React, { useState } from 'react';
import { logger } from '../../lib/logger';

export const LogViewer = () => {
    const [logs, setLogs] = useState<any[]>([]);

    const refresh = () => {
        // In a real app, logger would persist to an array/storage we can read
        // For this demo, we mock it or assume logger exposes a history
        setLogs([
            { level: 'info', msg: 'System started', time: new Date().toISOString() },
            { level: 'warn', msg: 'API Rate limit approaching', time: new Date().toISOString() },
            { level: 'error', msg: 'Failed to connect to Redis', time: new Date().toISOString() },
        ]);
    };

    return (
        <div className="p-4 bg-slate-900 text-green-400 font-mono rounded-xl h-64 overflow-y-auto">
            <div className="flex justify-between mb-2 border-b border-green-900 pb-2">
                <span>System Logs (Local Sentry)</span>
                <button onClick={refresh} className="text-xs border px-2 rounded hover:bg-green-900">Refresh</button>
            </div>
            {logs.map((log, i) => (
                <div key={i} className="text-xs mb-1">
                    <span className="opacity-50">[{log.time}]</span> <span className={log.level === 'error' ? 'text-red-500' : log.level === 'warn' ? 'text-yellow-500' : 'text-green-400'}>{log.level.toUpperCase()}:</span> {log.msg}
                </div>
            ))}
        </div>
    );
};
