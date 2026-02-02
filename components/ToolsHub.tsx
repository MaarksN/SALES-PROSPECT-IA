
import React, { useState, useMemo, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { Icons } from '../constants';
import { TOOLS_REGISTRY } from '../constants/tools';
import { AIToolConfig, ToolInput, UserContext, SavedGen } from '../types';
import { executeSalesTool } from '../services/geminiService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { toast } from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { exportToPDF } from '../lib/pdfExport';

// --- TYPES LOCAL ---
interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

interface SpeechRecognitionEvent {
    results: {
        [key: number]: {
            [key: number]: {
                transcript: string;
            };
        };
    };
}

interface SpeechRecognitionErrorEvent {
    error: string;
    message?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('Navegador não suporta reconhecimento de voz.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error(event.error);
        setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.start();
  };

  return (
    <button 
      type="button"
      onClick={startListening}
      className={`absolute right-3 bottom-3 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-indigo-500'}`}
      title="Falar para digitar"
      aria-label="Ativar reconhecimento de voz"
    >
      <Icons.Mic />
    </button>
  );
};

const ToolsHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTool, setActiveTool] = useState<AIToolConfig | null>(null);
  const [viewMode, setViewMode] = useState<'tools' | 'history'>('tools');
  
  // Credits Store
  const credits = useStore(state => state.credits);
  const decrementCredits = useStore(state => state.decrementCredits);

  // Persistence
  const [savedGens, setSavedGens] = useLocalStorage<SavedGen[]>('sales_ai_history', []);
  const [userContext, setUserContext] = useLocalStorage<UserContext | null>('sales_ai_context', null);
  
  // UI States
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [showContextModal, setShowContextModal] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<SavedGen | null>(null);

  // Context Form State
  const [tempContext, setTempContext] = useState<UserContext>({
      myCompany: '', myRole: '', myProduct: '', toneOfVoice: 'Consultivo', targetAudience: ''
  });

  useEffect(() => {
      if (userContext) setTempContext(userContext);
  }, [userContext]);

  // React Query & Validation
  const mutation = useMutation({
    mutationFn: async (vars: { tool: AIToolConfig; values: Record<string, string>; context?: UserContext | null }) => {
        return executeSalesTool(vars.tool, vars.values, vars.context || undefined, (text) => {
            setResult(text);
        });
    },
    onSuccess: (data) => {
        setResult(data);
        toast.success('Gerado com sucesso! (1 Crédito usado)');
        if (navigator.vibrate) navigator.vibrate(200);
        decrementCredits(1);
    },
    onError: (error: Error) => {
        toast.error(error.message);
    }
  });

  const generateSchema = (inputs: ToolInput[]) => {
      const shape: any = {};
      inputs.forEach(input => {
        shape[input.name] = z.string().min(1, `Campo ${input.label} é obrigatório`);
      });
      return z.object(shape);
  };

  const filteredTools = useMemo(() => {
    return TOOLS_REGISTRY.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory]);

  const handleToolSelect = (tool: AIToolConfig) => {
    setActiveTool(tool);
    setResult(null);
    setFormValues({});
    setViewMode('tools');
    setComparisonMode(null);
    mutation.reset();
  };

  const handleExecute = () => {
    if (!activeTool) return;
    
    const schema = generateSchema(activeTool.inputs);
    const validation = schema.safeParse(formValues);

    if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return;
    }

    setResult(null);
    mutation.mutate({ tool: activeTool, values: formValues, context: userContext });
  };

  const handleSaveResult = () => {
      if (!activeTool || !result) return;
      const newGen: SavedGen = {
          id: crypto.randomUUID(),
          toolId: activeTool.id,
          toolName: activeTool.name,
          timestamp: new Date().toISOString(),
          inputs: formValues,
          output: result,
          isFavorite: false
      };
      setSavedGens([newGen, ...savedGens]);
      toast.success('Salvo no Histórico!');
  };

  const saveContext = () => {
      setUserContext(tempContext);
      setShowContextModal(false);
      toast.success('Cérebro da IA atualizado!');
  };

  // Renderiza Inputs
  const renderInput = (input: ToolInput) => {
    const commonClasses = "w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white pr-12";
    
    switch (input.type) {
      case 'textarea':
        return (
          <div className="relative">
            <textarea 
                rows={5}
                className={commonClasses}
                placeholder={input.placeholder}
                value={formValues[input.name] || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, [input.name]: e.target.value }))}
            />
            <VoiceInput onTranscript={(txt) => setFormValues(prev => ({ ...prev, [input.name]: (prev[input.name] || '') + ' ' + txt }))} />
          </div>
        );
      case 'select':
        return (
          <select 
            className={commonClasses}
            value={formValues[input.name] || ''}
            onChange={(e) => setFormValues(prev => ({ ...prev, [input.name]: e.target.value }))}
          >
            <option value="">Selecione...</option>
            {input.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      default:
        return (
          <div className="relative">
             <input 
                type={input.type} 
                className={commonClasses}
                placeholder={input.placeholder}
                value={formValues[input.name] || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, [input.name]: e.target.value }))}
            />
            <VoiceInput onTranscript={(txt) => setFormValues(prev => ({ ...prev, [input.name]: txt }))} />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-20 relative">
      
      {/* Context Modal */}
      {showContextModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center">
                      <h3 className="font-bold text-xl flex items-center gap-2"><Icons.Brain /> Ensinar a IA</h3>
                      <button onClick={() => setShowContextModal(false)} className="hover:bg-white/20 p-2 rounded-full" aria-label="Fechar Modal"><Icons.X /></button>
                  </div>
                  <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                          Preencha estes dados e a IA personalizará TODAS as respostas das 100 ferramentas para o seu negócio.
                      </p>
                      <div>
                          <label className="block text-sm font-bold mb-1 dark:text-white">Minha Empresa</label>
                          <input type="text" value={tempContext.myCompany} onChange={e => setTempContext({...tempContext, myCompany: e.target.value})} className="w-full p-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700" placeholder="Ex: Acme Corp" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-1 dark:text-white">Meu Cargo</label>
                          <input type="text" value={tempContext.myRole} onChange={e => setTempContext({...tempContext, myRole: e.target.value})} className="w-full p-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700" placeholder="Ex: Executivo de Vendas" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-1 dark:text-white">O que eu vendo (Produto/Serviço)</label>
                          <textarea rows={2} value={tempContext.myProduct} onChange={e => setTempContext({...tempContext, myProduct: e.target.value})} className="w-full p-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700" placeholder="Ex: Software de ERP para varejo" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-1 dark:text-white">Público Alvo</label>
                          <input type="text" value={tempContext.targetAudience} onChange={e => setTempContext({...tempContext, targetAudience: e.target.value})} className="w-full p-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700" placeholder="Ex: Diretores de Logística" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-1 dark:text-white">Tom de Voz</label>
                          <select value={tempContext.toneOfVoice} onChange={e => setTempContext({...tempContext, toneOfVoice: e.target.value as any})} className="w-full p-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700">
                              <option>Consultivo</option>
                              <option>Formal</option>
                              <option>Agressivo/Closer</option>
                              <option>Amigável/Casual</option>
                          </select>
                      </div>
                  </div>
                  <div className="p-4 border-t dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
                      <button onClick={() => setShowContextModal(false)} className="px-4 py-2 text-slate-500 font-bold">Cancelar</button>
                      <button onClick={saveContext} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Salvar Contexto</button>
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
            <h2 className="text-3xl font-bold dark:text-white flex items-center gap-2">
                <Icons.Sparkles /> 
                100 Power Tools
            </h2>
            <p className="text-slate-500">Suite de inteligência artificial para vendas.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
             <div className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 px-4 py-2 rounded-xl font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-2">
                 <Icons.CreditCard className="w-4 h-4" /> {credits} Créditos
             </div>
             <button 
                onClick={() => setShowContextModal(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold transition-all ${userContext ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-500'}`}
             >
                 <Icons.Brain /> {userContext ? 'IA Configurada (Ativo)' : 'Ensinar IA (Configurar)'}
             </button>
             <button 
                onClick={() => { setViewMode(viewMode === 'tools' ? 'history' : 'tools'); setActiveTool(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold transition-all ${viewMode === 'history' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
             >
                 <Icons.List /> {viewMode === 'tools' ? 'Ver Salvos' : 'Ver Ferramentas'}
             </button>
        </div>
      </div>

      {viewMode === 'tools' && (
      <>
      {/* Categories & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
            {['all', 'prospecting', 'enrichment', 'copywriting', 'strategy', 'closing'].map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-colors ${
                        selectedCategory === cat 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                >
                    {cat === 'all' ? 'Todas' : cat}
                </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
                <div className="absolute left-3 top-3 text-slate-400"><Icons.Search /></div>
                <input 
                    type="text" 
                    placeholder="Buscar ferramenta..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* Tools Grid */}
        <div className={`${activeTool ? 'lg:col-span-5 hidden lg:block' : 'lg:col-span-12'} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min`}>
            {filteredTools.map(tool => (
                <div 
                    key={tool.id}
                    onClick={() => handleToolSelect(tool)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
                        activeTool?.id === tool.id 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500/20' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                >
                    <div className="flex justify-between mb-3">
                        <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
                            tool.category === 'prospecting' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                            tool.category === 'closing' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                            {tool.category}
                        </span>
                        <span className="text-slate-300 font-mono text-xs">#{tool.id.split('_')[1]}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 dark:text-white leading-tight">{tool.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{tool.description}</p>
                </div>
            ))}
        </div>

        {/* Workspace */}
        {activeTool && (
            <div className="lg:col-span-7 fixed inset-0 lg:static z-50 bg-white dark:bg-[#0B1120] lg:bg-transparent lg:z-auto overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="p-6 h-full flex flex-col">
                    {/* Mobile Back */}
                    <div className="lg:hidden flex justify-between items-center mb-6">
                        <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 text-slate-500 font-bold">
                            <Icons.ChevronLeft /> Voltar
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 flex-1 flex flex-col">
                        <div className="mb-6 pb-6 border-b dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                                    <Icons.Zap />
                                </div>
                                <h2 className="text-2xl font-bold dark:text-white">{activeTool.name}</h2>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400">{activeTool.description}</p>
                            {userContext && (
                                <div className="mt-3 text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                                    <Icons.Brain /> Personalizado para: <span className="font-bold">{userContext.myCompany}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6 mb-8">
                            {activeTool.inputs.map(input => (
                                <div key={input.name}>
                                    <label className="block text-sm font-bold mb-2 dark:text-slate-300">
                                        {input.label}
                                    </label>
                                    {renderInput(input)}
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={handleExecute}
                            disabled={mutation.isPending}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                        >
                            {mutation.isPending ? <Icons.Refresh className="animate-spin" /> : <Icons.Zap />}
                            {mutation.isPending ? 'Processando Inteligência...' : 'Executar (1 Crédito)'}
                        </button>

                        {result && (
                            <div className="mt-8 pt-8 border-t dark:border-slate-700 animate-in slide-in-from-bottom fade-in duration-500">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                                        <Icons.Check className="text-green-500" /> Resultado Gerado:
                                    </h3>
                                    <div className="flex gap-2">
                                        {comparisonMode && (
                                            <button onClick={() => setComparisonMode(null)} className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">Fechar Comparação</button>
                                        )}
                                        <button 
                                            onClick={handleSaveResult}
                                            className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <Icons.Plus /> SALVAR
                                        </button>
                                        <button
                                            onClick={() => exportToPDF(activeTool.name, result)}
                                            className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <Icons.Download className="w-3 h-3" /> PDF
                                        </button>
                                        <button 
                                            onClick={() => {navigator.clipboard.writeText(result); toast.success('Copiado!')}}
                                            className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            COPIAR
                                        </button>
                                    </div>
                                </div>

                                {comparisonMode ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-200 dark:border-red-900">
                                            <div className="text-xs font-bold text-red-500 mb-2">VERSÃO ANTERIOR ({new Date(comparisonMode.timestamp).toLocaleDateString()})</div>
                                            <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{comparisonMode.output}</div>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-200 dark:border-green-900">
                                            <div className="text-xs font-bold text-green-600 mb-2">NOVA VERSÃO</div>
                                            <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{result}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 dark:bg-[#05050A] p-6 rounded-xl border border-slate-200 dark:border-slate-700 prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap overflow-auto max-h-[500px] shadow-inner">
                                        {result}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
      </>
      )}

      {/* History View */}
      {viewMode === 'history' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedGens.length === 0 ? (
                  <div className="col-span-2 text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed dark:border-slate-700">
                      <div className="text-slate-300 text-6xl mb-4"><Icons.List /></div>
                      <h3 className="text-xl font-bold text-slate-500">Nada salvo ainda</h3>
                      <p className="text-slate-400">Gere conteúdo e clique em "Salvar" para guardar seus melhores scripts.</p>
                  </div>
              ) : (
                  savedGens.map(gen => (
                      <div key={gen.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                              <div>
                                  <h4 className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mb-1">{gen.toolName}</h4>
                                  <p className="text-xs text-slate-400">{new Date(gen.timestamp).toLocaleString()}</p>
                              </div>
                              <button onClick={() => {
                                  setSavedGens(savedGens.filter(g => g.id !== gen.id));
                                  toast.success('Item removido');
                              }} className="text-slate-400 hover:text-red-500"><Icons.X /></button>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-sm text-slate-600 dark:text-slate-300 max-h-40 overflow-y-auto mb-4 whitespace-pre-wrap">
                              {gen.output}
                          </div>
                          <div className="flex justify-end gap-2">
                              <button onClick={() => {
                                  // Restore tool and context
                                  const tool = TOOLS_REGISTRY.find(t => t.id === gen.toolId);
                                  if (tool) {
                                      setActiveTool(tool);
                                      setFormValues(gen.inputs);
                                      setResult(null); // Reset result to force generation or we could set result = gen.output but the goal is comparison
                                      setComparisonMode(gen);
                                      setViewMode('tools');
                                      toast("Modo de Comparação Ativado. Gere novamente para ver a diferença.", { icon: '⚖️' });
                                  }
                              }} className="text-xs font-bold px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg dark:bg-indigo-900/20 dark:text-indigo-300">Comparar / Editar</button>
                              <button onClick={() => {navigator.clipboard.writeText(gen.output); toast.success('Copiado!')}} className="text-xs font-bold px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg dark:bg-slate-700 dark:hover:bg-slate-600">Copiar</button>
                          </div>
                      </div>
                  ))
              )}
          </div>
      )}
    </div>
  );
};

export default ToolsHub;
