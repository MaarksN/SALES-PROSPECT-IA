
import React, { useState } from 'react';
import { Icons } from '../constants';
import { toast } from 'react-hot-toast';

interface CRM {
    id: string;
    name: string;
    logo: string;
    connected: boolean;
    lastSync?: string;
}

const CRMConnectors: React.FC = () => {
    const [crms, setCrms] = useState<CRM[]>([
        { id: 'salesforce', name: 'Salesforce', logo: '☁️', connected: false },
        { id: 'hubspot', name: 'HubSpot', logo: '🟧', connected: false },
        { id: 'pipedrive', name: 'Pipedrive', logo: '🟢', connected: false },
    ]);

    const toggleConnection = (id: string) => {
        setCrms(prev => prev.map(crm => {
            if (crm.id === id) {
                const newState = !crm.connected;
                if (newState) {
                    toast.success(`Conectado ao ${crm.name} com sucesso!`);
                    return { ...crm, connected: true, lastSync: new Date().toLocaleString() };
                } else {
                    toast.success(`Desconectado do ${crm.name}`);
                    return { ...crm, connected: false, lastSync: undefined };
                }
            }
            return crm;
        }));
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400"><Icons.Database className="w-8 h-8" /></div>
                <div>
                    <h3 className="text-xl font-bold dark:text-white">Integrações CRM</h3>
                    <p className="text-slate-500 dark:text-slate-400">Sincronize seus leads automaticamente com seu CRM favorito.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crms.map(crm => (
                    <div key={crm.id} className={`p-6 border rounded-xl transition-all ${crm.connected ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-4xl">{crm.logo}</div>
                            <div className={`w-3 h-3 rounded-full ${crm.connected ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        </div>
                        <h4 className="font-bold text-lg dark:text-white mb-1">{crm.name}</h4>
                        <p className="text-xs text-slate-500 mb-6 min-h-[1.5em]">
                            {crm.connected ? `Sincronizado: ${crm.lastSync}` : 'Não conectado'}
                        </p>

                        <button
                            onClick={() => toggleConnection(crm.id)}
                            className={`w-full py-2 rounded-lg font-bold text-sm transition-colors ${
                                crm.connected
                                ? 'bg-white border border-red-200 text-red-500 hover:bg-red-50'
                                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                            }`}
                        >
                            {crm.connected ? 'Desconectar' : 'Conectar'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CRMConnectors;
