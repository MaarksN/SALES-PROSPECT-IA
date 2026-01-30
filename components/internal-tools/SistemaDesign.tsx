
import React from 'react';
import Button from '../ui/Button';

export const SistemaDesign = () => {
    return (
        <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2">🎨 Sistema de Design</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-6 border rounded-xl bg-white shadow-sm">
                    <h4 className="mb-4 text-xs font-bold uppercase text-slate-400 tracking-wider">Botões (Tema Claro)</h4>
                    <div className="flex flex-wrap gap-3">
                        <Button>Primário</Button>
                        <Button variant="secondary">Secundário</Button>
                        <Button variant="danger">Perigo</Button>
                    </div>
                </div>
                <div className="p-6 border border-white/10 rounded-xl bg-[#0B1120] text-white shadow-sm">
                    <h4 className="mb-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Botões (Tema Escuro)</h4>
                    <div className="flex flex-wrap gap-3">
                        <Button>Primário</Button>
                        <Button variant="secondary">Secundário</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
