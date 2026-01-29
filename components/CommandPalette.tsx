
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { TOOLS_REGISTRY } from '../constants/tools';
import { Icons } from '../constants';

const CommandPalette: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const setActiveToolId = useStore(state => state.setActiveToolId);
    const setZenMode = useStore(state => state.setZenMode);
    const zenMode = useStore(state => state.zenMode);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const filteredItems = useMemo(() => {
        if (!query) return [];
        const tools = TOOLS_REGISTRY.filter(t =>
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        return tools;
    }, [query]);

    const handleSelect = (toolId: string) => {
        setActiveToolId(toolId);
        navigate('/tools');
        setIsOpen(false);
        setQuery('');
    };

    const toggleZen = () => {
        setZenMode(!zenMode);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh] animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                <div className="flex items-center p-4 border-b border-slate-100 dark:border-slate-700">
                    <Icons.Search className="text-slate-400 mr-3" />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Buscar ferramenta ou comando..."
                        className="flex-1 bg-transparent outline-none dark:text-white text-lg placeholder:text-slate-400"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <div className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-1 rounded">ESC</div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {filteredItems.length > 0 && (
                        <div className="mb-2">
                            <h4 className="text-xs font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">Ferramentas</h4>
                            {filteredItems.map(tool => (
                                <button
                                    key={tool.id}
                                    onClick={() => handleSelect(tool.id)}
                                    className="w-full text-left px-3 py-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group flex items-center justify-between transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-600">
                                            <Icons.Sparkles className="w-4 h-4 text-indigo-500" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-700 dark:text-slate-200">{tool.name}</div>
                                            <div className="text-xs text-slate-400 line-clamp-1">{tool.description}</div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-indigo-500 opacity-0 group-hover:opacity-100">Abrir ↵</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* System Commands */}
                    <div className="border-t border-slate-100 dark:border-slate-700 mt-2 pt-2">
                         <h4 className="text-xs font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">Sistema</h4>
                         <button onClick={toggleZen} className="w-full text-left px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3 text-slate-600 dark:text-slate-300">
                             <Icons.Zap /> {zenMode ? 'Sair do Modo Zen' : 'Ativar Modo Zen'}
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
