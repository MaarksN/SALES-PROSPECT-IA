
import React, { useState } from 'react';

export const APITester = () => {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [body, setBody] = useState('');
    const [response, setResponse] = useState('');

    const handleSend = async () => {
        try {
            setResponse('Loading...');
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: method !== 'GET' ? body : undefined
            });
            const data = await res.json();
            setResponse(JSON.stringify(data, null, 2));
        } catch (e: any) {
            setResponse(e.message);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="font-bold">Local Postman</h3>
            <div className="flex gap-2">
                <select value={method} onChange={e => setMethod(e.target.value)} className="p-2 border rounded">
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                </select>
                <input
                    className="flex-1 p-2 border rounded"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://api.example.com"
                />
                <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
            </div>
            {method !== 'GET' && (
                <textarea
                    className="w-full p-2 border rounded h-20"
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    placeholder='{"key": "value"}'
                />
            )}
            <pre className="bg-slate-100 p-4 rounded h-40 overflow-auto text-xs">
                {response}
            </pre>
        </div>
    );
};
