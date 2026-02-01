import React, { useEffect, useState } from "react";

export default function VisualizadorLogs() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Simula live tail
    const interval = setInterval(() => {
        const newLog = `[${new Date().toLocaleTimeString()}] INFO: Processed job #${Math.floor(Math.random() * 1000)}`;
        setLogs(prev => [newLog, ...prev].slice(0, 50));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-green-400 p-4 rounded-xl font-mono text-xs h-[500px] overflow-y-auto border border-slate-800">
        <div className="mb-2 pb-2 border-b border-white/10 flex justify-between">
            <span>LIVE SERVER LOGS (Simulated)</span>
            <span className="animate-pulse">● Connected</span>
        </div>
        {logs.map((log, i) => (
            <div key={i} className="mb-1">{log}</div>
        ))}
    </div>
  );
}
