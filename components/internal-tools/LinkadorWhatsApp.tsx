
import React, { useState } from 'react';

export const LinkadorWhatsApp = () => {
    const [phones, setPhones] = useState('');
    const [msg, setMsg] = useState('');

    const links = phones.split('\n').map(p => {
        const clean = p.replace(/\D/g, '');
        return `https://wa.me/55${clean}?text=${encodeURIComponent(msg)}`;
    });

    return (
        <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2">📱 Disparador de Links WhatsApp</h3>
            <textarea
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm"
                rows={3}
                placeholder="Lista de Telefones (um por linha)..."
                value={phones}
                onChange={e => setPhones(e.target.value)}
            />
            <input
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm"
                placeholder="Mensagem padrão..."
                value={msg}
                onChange={e => setMsg(e.target.value)}
            />
            <div className="max-h-40 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Links Gerados ({links.filter(l => l.includes('55')).length})</p>
                {links.map((l, i) => l.includes('55') && (
                    <a key={i} href={l} target="_blank" className="block text-green-600 hover:text-green-700 truncate text-sm py-1 border-b border-dashed border-slate-200 last:border-0">
                        {l}
                    </a>
                ))}
                {(!phones || links.filter(l => l.includes('55')).length === 0) && <span className="text-slate-400 text-xs italic">Nenhum telefone válido detectado.</span>}
            </div>
        </div>
    );
};
