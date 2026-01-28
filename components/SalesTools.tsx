import React, { useState } from 'react';
import { Icons } from '../constants';
import { TOOLS_REGISTRY } from '../constants/tools';
import { AIToolConfig } from '../types';
import { executeSalesTool } from '../services/geminiService';

const SalesTools: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<AIToolConfig | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'prospecting', label: '🔍 Prospecção' },
    { id: 'enrichment', label: '⚡ Enriquecimento' },
    { id: 'strategy', label: '🧠 Estratégia' },
    { id: 'copywriting', label: '✍️ Copywriting' },
    { id: 'closing', label: '🤝 Fechamento' },
  ];

  const filteredTools = TOOLS_REGISTRY.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (tool.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectTool = (tool: AIToolConfig) => {
    setSelectedTool(tool);
    setFormValues({});
    setResult(null);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool) return;

    setLoading(true);
    setResult(null);

    const generatedText = await executeSalesTool(selectedTool, formValues);
    setResult(generatedText);
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      alert('Copiado para a área de transferência!');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      
      {/* LEFT: Tools List */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${selectedTool ? 'hidden md:flex md:w-1/3 md:flex-none' : 'w-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <h2 className="text-2xl font-black mb-4 dark:text-white flex items-center gap-2">
            <span className="text-indigo-600"><Icons.Tools /></span> Ferramentas
          </h2>
          
          <div className="relative mb-4">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Icons.Search />
             </div>
             <input 
                type="text" 
                placeholder="Buscar ferramenta..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
             />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
           {filteredTools.map(tool => (
             <button
                key={tool.id}
                onClick={() => handleSelectTool(tool)}
                className={`w-full text-left p-4 rounded-xl border transition-all hover:scale-[1.01] ${selectedTool?.id === tool.id ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 dark:bg-indigo-900/20' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 hover:border-indigo-300'}`}
             >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-sm ${selectedTool?.id === tool.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
                    {tool.name}
                  </h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    tool.category === 'prospecting' ? 'bg-green-100 text-green-700' :
                    tool.category === 'enrichment' ? 'bg-blue-100 text-blue-700' :
                    tool.category === 'strategy' ? 'bg-amber-100 text-amber-700' :
                    tool.category === 'copywriting' ? 'bg-pink-100 text-pink-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {tool.category.substring(0,4)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{tool.description || ''}</p>
             </button>
           ))}
           {filteredTools.length === 0 && (
             <div className="text-center py-10 text-slate-400">
               Nenhuma ferramenta encontrada.
             </div>
           )}
        </div>
      </div>

      {/* RIGHT: Workspace */}
      {selectedTool ? (
        <div className="flex-[2] bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-right-4">
          
          {/* Tool Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
            <div>
               <button onClick={() => setSelectedTool(null)} className="md:hidden text-sm text-indigo-600 mb-2 font-bold">← Voltar</button>
               <h2 className="text-xl font-black dark:text-white">{selectedTool.name}</h2>
               <p className="text-sm text-slate-500">{selectedTool.description || selectedTool.name}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
              <Icons.Robot />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto space-y-8">
              
              {/* Form */}
              <form onSubmit={handleExecute} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {selectedTool.inputs.map((input, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        {input.label}
                      </label>
                      {input.type === 'textarea' ? (
                        <textarea
                          required
                          placeholder={input.placeholder || ''}
                          value={formValues[input.name] || ''}
                          onChange={(e) => handleInputChange(input.name, e.target.value)}
                          className="w-full p-4 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white min-h-[120px]"
                        />
                      ) : (
                        <input
                          type={input.type}
                          required
                          placeholder={input.placeholder || ''}
                          value={formValues[input.name] || ''}
                          onChange={(e) => handleInputChange(input.name, e.target.value)}
                          className="w-full p-4 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? <Icons.Refresh /> : <Icons.Sparkles />}
                  {loading ? 'Processando com IA...' : 'Gerar Resultado'}
                </button>
              </form>

              {/* Output */}
              {result && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg dark:text-white">Resultado:</h3>
                    <button onClick={copyToClipboard} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase bg-indigo-50 px-3 py-1 rounded-lg">
                      Copiar
                    </button>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 prose dark:prose-invert max-w-none whitespace-pre-wrap">
                    {result}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-[2] bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 items-center justify-center text-center p-10">
          <div>
            <div className="inline-block p-6 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
              <span className="text-4xl text-indigo-300"><Icons.Tools /></span>
            </div>
            <h3 className="text-xl font-bold text-slate-400">Selecione uma ferramenta</h3>
            <p className="text-slate-400 mt-2">Escolha uma das 100 ferramentas de vendas à esquerda para começar.</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default SalesTools;