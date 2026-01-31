import React from "react";
import { Terminal } from "lucide-react";

export default function VisualizadorLogs() {
  const logs = [
    { time: "10:00:01", level: "INFO", msg: "Sistema iniciado v2.1.0" },
    { time: "10:05:23", level: "WARN", msg: "API Gemini demorou 1.2s para responder" },
    { time: "10:12:45", level: "INFO", msg: "Usuário 'demo' fez login" },
    { time: "10:15:00", level: "ERROR", msg: "Falha ao sincronizar com HubSpot (Timeout)" },
  ];

  return (
    <div className="rounded-xl bg-[#0d1117] p-6 text-slate-300 font-mono text-xs h-[80vh] border border-slate-800 overflow-auto">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-800 pb-2 text-slate-400">
            <Terminal size={14} /> System Logs
        </div>
        <div className="space-y-1">
            {logs.map((log, i) => (
                <div key={i} className="flex gap-4 hover:bg-white/5 p-1 rounded">
                    <span className="text-slate-500">{log.time}</span>
                    <span className={`font-bold ${
                        log.level === "INFO" ? "text-blue-400" :
                        log.level === "WARN" ? "text-yellow-400" : "text-red-500"
                    }`}>{log.level}</span>
                    <span className="text-slate-300">{log.msg}</span>
                </div>
            ))}
            <div className="animate-pulse text-indigo-500">_</div>
        </div>
    </div>
  );
}