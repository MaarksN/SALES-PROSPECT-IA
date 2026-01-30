
import React, { useState } from 'react';

export const WhatsAppLinker = () => {
    const [phones, setPhones] = useState('');
    const [msg, setMsg] = useState('');

    const links = phones.split('\n').map(p => {
        const clean = p.replace(/\D/g, '');
        return `https://wa.me/55${clean}?text=${encodeURIComponent(msg)}`;
    });

    return (
        <div className="space-y-2">
            <h3 className="font-bold">WhatsApp Blaster</h3>
            <textarea className="w-full p-2 border" rows={3} placeholder="Phones (one per line)..." value={phones} onChange={e => setPhones(e.target.value)} />
            <input className="w-full p-2 border" placeholder="Message..." value={msg} onChange={e => setMsg(e.target.value)} />
            <div className="max-h-40 overflow-y-auto bg-slate-100 p-2">
                {links.map((l, i) => l.includes('55') && <a key={i} href={l} target="_blank" className="block text-blue-600 truncate">{l}</a>)}
            </div>
        </div>
    );
};
