
import React, { useState } from 'react';

export const TestadorAPI = () => {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [body, setBody] = useState('');
    const [response, setResponse] = useState('');

    const handleSend = async () => {
        try {
            setResponse('Carregando requisição...');
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: method !== 'GET' ? body : undefined
            });
            const data = await res.json();
            setResponse(JSON.stringify(data, null, 2));
        } catch (e: any) {
            setResponse(`Erro: ${e.message}`);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2">🔌 Testador de API (Local)</h3>
            <div className="flex gap-2">
                <select value={method} onChange={e => setMethod(e.target.value)} className="p-2 border rounded font-bold text-slate-700 bg-slate-50">
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                </select>
                <input
                    className="flex-1 p-2 border rounded text-sm font-mono"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://api.exemplo.com/v1/recurso"
                />
                <button onClick={handleSend} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-md transition-all">Enviar</button>
            </div>
            {method !== 'GET' && (
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Corpo da Requisição (JSON)</label>
                    <textarea
                        className="w-full p-3 border rounded h-24 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        placeholder='{"chave": "valor"}'
                    />
                </div>
            )}
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Resposta</label>
                <pre className="bg-slate-900 text-green-400 p-4 rounded-xl h-48 overflow-auto text-xs font-mono shadow-inner border border-slate-700">
                    {response || '// Aguardando resposta...'}
                </pre>
            </div>
        </div>
    );
};
