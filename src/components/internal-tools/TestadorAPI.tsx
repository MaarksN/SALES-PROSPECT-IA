import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Play } from "lucide-react";

export default function TestadorAPI() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.salesprospector.com/v1/health");

  return (
    <div className="space-y-4">
        <div className="flex gap-0 rounded-lg border bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800 p-2">
            <select
                value={method}
                onChange={e => setMethod(e.target.value)}
                className="rounded bg-slate-100 px-4 font-bold text-slate-700 outline-none dark:bg-slate-800 dark:text-white"
            >
                <option>GET</option>
                <option>POST</option>
            </select>
            <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="flex-1 px-4 outline-none dark:bg-slate-900 dark:text-white"
            />
            <Button size="sm"><Play size={14} className="mr-2"/> Send</Button>
        </div>

        <div className="rounded-xl border bg-slate-50 p-4 dark:bg-slate-950 dark:border-slate-800 h-64">
            <p className="text-xs text-slate-400 font-mono">Response Body will appear here...</p>
        </div>
    </div>
  );
}