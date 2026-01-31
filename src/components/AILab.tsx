import React, { useState } from "react";
import { geminiService } from "@/services/geminiService";
import { Button } from "@/components/ui/Button";
import { Sparkles, Send, Bot, Copy, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { env } from "@/env";

export default function AILab() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;

    setLoading(true);
    try {
        const text = await geminiService.generateText(prompt);
        setResponse(text);
        toast.success("Gerado com sucesso!");
    } catch (err) {
        toast.error("Erro ao conectar com Gemini.");
    } finally {
        setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    toast.success("Copiado!");
  }

  return (
    <div className="flex h-[80vh] flex-col overflow-hidden rounded-2xl border bg-white shadow-xl dark:bg-slate-900 dark:border-slate-800">
      <div className="flex justify-between items-center border-b bg-slate-50 p-4 dark:bg-slate-950 dark:border-slate-800">
        <h2 className="flex items-center gap-2 font-bold dark:text-white"><Bot className="text-indigo-600"/> AI Lab (Gemini 1.5 Real)</h2>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-slate-50/50 dark:bg-black/20">
        {response ? (
            <div className="relative group">
                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <p className="font-mono text-sm leading-relaxed dark:text-slate-300 whitespace-pre-wrap">{response}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={copyToClipboard} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy size={16}/>
                </Button>
            </div>
        ) : (
            <div className="flex h-full flex-col items-center justify-center text-slate-400 gap-4">
                <Sparkles size={48} className="text-slate-200 dark:text-slate-800" />
                <p>O resultado da IA aparecerá aqui...</p>
            </div>
        )}
      </div>

      <div className="border-t p-4 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex gap-2">
            <input
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Ex: Crie um script de cold call para vender ERP para indústria..."
                className="flex-1 rounded-lg border bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white transition-all"
                onKeyDown={e => e.key === "Enter" && handleGenerate()}
            />
            <Button onClick={handleGenerate} disabled={loading || !prompt} className="w-12">
                {loading ? <Sparkles className="animate-spin" /> : <Send size={18} />}
            </Button>
        </div>
      </div>
    </div>
  );
}
