
import React, { useState } from 'react';

export const JSONFormatter = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const format = () => {
        try {
            const obj = JSON.parse(input);
            setOutput(JSON.stringify(obj, null, 2));
        } catch (e) {
            setOutput("Invalid JSON");
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4 h-64">
            <textarea className="p-2 border rounded" value={input} onChange={e => setInput(e.target.value)} placeholder="Paste JSON here..." />
            <textarea className="p-2 border rounded bg-slate-50 font-mono text-xs" value={output} readOnly placeholder="Result..." />
            <button onClick={format} className="col-span-2 py-2 bg-indigo-600 text-white rounded">Format</button>
        </div>
    );
};
