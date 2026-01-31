import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function FormatadorJSON() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const format = () => {
    try {
        const obj = JSON.parse(input);
        setOutput(JSON.stringify(obj, null, 2));
        toast.success("JSON Válido!");
    } catch (e) {
        toast.error("JSON Inválido");
        setOutput("");
    }
  };

  return (
    <div className="grid h-[80vh] grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
            <label className="font-bold dark:text-white">Input (Raw)</label>
            <textarea
                className="flex-1 rounded-lg border p-4 font-mono text-xs dark:bg-slate-900 dark:text-white"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="{ 'a': 1 }"
            />
        </div>
        <div className="flex flex-col gap-2">
            <div className="flex justify-between">
                <label className="font-bold dark:text-white">Output (Prettified)</label>
                <Button size="sm" onClick={format}>Formatar</Button>
            </div>
            <textarea
                readOnly
                className="flex-1 rounded-lg border bg-slate-50 p-4 font-mono text-xs text-green-600 dark:bg-slate-950 dark:text-green-400"
                value={output}
            />
        </div>
    </div>
  );
}