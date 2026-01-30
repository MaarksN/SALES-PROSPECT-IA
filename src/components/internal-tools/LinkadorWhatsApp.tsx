import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function LinkadorWhatsApp() {
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");

  const link = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  };

  return (
    <div className="max-w-lg rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-900">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Gerador de Link WhatsApp</h2>
      <div className="space-y-4">
        <input
            placeholder="5511999999999"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full rounded-lg border p-3 dark:bg-slate-800 dark:text-white"
        />
        <textarea
            placeholder="Sua mensagem aqui..."
            value={msg}
            onChange={e => setMsg(e.target.value)}
            className="w-full rounded-lg border p-3 h-24 dark:bg-slate-800 dark:text-white"
        />
        <div className="flex gap-2">
            <Button onClick={copyToClipboard} variant="outline" className="flex-1"><Copy size={16} className="mr-2"/> Copiar</Button>
            <Button onClick={() => window.open(link, "_blank")} className="flex-1"><ExternalLink size={16} className="mr-2"/> Abrir</Button>
        </div>
      </div>
    </div>
  );
}