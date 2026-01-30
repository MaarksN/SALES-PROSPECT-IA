
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export const LocalWiki = () => {
    const [text, setText] = useState('# Welcome to Local Wiki\nEdit me...');
    const [mode, setMode] = useState<'edit' | 'view'>('edit');

    return (
        <div className="h-64 flex flex-col">
            <div className="flex justify-between border-b pb-2 mb-2">
                <h3 className="font-bold">Wiki</h3>
                <button onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')}>{mode === 'edit' ? 'Preview' : 'Edit'}</button>
            </div>
            {mode === 'edit' ? (
                <textarea className="flex-1 p-2 border" value={text} onChange={e => setText(e.target.value)} />
            ) : (
                <div className="flex-1 overflow-y-auto prose prose-sm"><ReactMarkdown>{text}</ReactMarkdown></div>
            )}
        </div>
    );
};
