
import React, { useState } from 'react';
import { Icons } from '../constants';
import { toast } from 'react-hot-toast';

const CNPJValidator: React.FC = () => {
  const [cnpj, setCnpj] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCnpj(formatCNPJ(e.target.value));
  };

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    
    if (cleanCNPJ.length !== 14) {
        toast.error("CNPJ incompleto");
        return;
    }

    setLoading(true);
    setResult(null);

    try {
        // Real API Call to BrasilAPI (Free, Public)
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`);
        
        if (!response.ok) {
            throw new Error("CNPJ não encontrado ou inválido.");
        }

        const data = await response.json();
        
        setResult({
            status: 'success',
            data: {
                razao_social: data.razao_social,
                nome_fantasia: data.nome_fantasia,
                cnpj: data.cnpj,
                situacao_cadastral: data.descricao_situacao_cadastral,
                cnae_fiscal_principal_code: data.cnae_fiscal_principal_code,
                cnae_fiscal_principal: data.cnae_fiscal_descricao,
                logradouro: `${data.logradouro}, ${data.numero}`,
                municipio: `${data.municipio} - ${data.uf}`,
                qsa: data.qsa // Sócios
            }
        });
        toast.success("Empresa validada com sucesso!");

    } catch (error: any) {
        setResult({ status: 'error', message: error.message || 'Erro na consulta.' });
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <h2 className="text-2xl font-black mb-2 dark:text-white flex items-center gap-3">
                <span className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl"><Icons.Check /></span>
                Validação Fiscal Real
            </h2>
            <p className="text-slate-500">Conectado à Receita Federal via BrasilAPI. Evite leads inativos.</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleValidate} className="flex gap-4">
                <div className="flex-1 relative">
                    <input 
                    type="text" 
                    placeholder="00.000.000/0000-00" 
                    value={cnpj}
                    onChange={handleChange}
                    className="w-full text-lg rounded-xl border-2 border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white px-6 py-4 focus:border-indigo-500 outline-none transition-all font-mono"
                    />
                </div>
                <button 
                type="submit" 
                disabled={loading || cnpj.length < 14}
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 hover:shadow-lg transition-all"
                >
                {loading ? <Icons.Refresh className="animate-spin" /> : 'Consultar Base'}
                </button>
            </form>

            {result && (
                <div className={`mt-8 p-6 rounded-2xl border-2 ${result.status === 'success' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'}`}>
                {result.status === 'success' ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-lg mb-4 border-b border-green-200 dark:border-green-800 pb-2">
                            <Icons.Check /> CNPJ VÁLIDO E ATIVO
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm dark:text-slate-300">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Razão Social</p>
                                <p className="font-bold text-lg">{result.data.razao_social}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Nome Fantasia</p>
                                <p className="font-bold">{result.data.nome_fantasia || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Situação</p>
                                <span className="inline-block px-2 py-1 rounded bg-green-200 text-green-800 text-xs font-bold">{result.data.situacao_cadastral}</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Localização</p>
                                <p>{result.data.municipio}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-xs font-bold text-slate-400 uppercase">Atividade Principal (CNAE)</p>
                                <p className="font-medium">{result.data.cnae_fiscal_principal_code} - {result.data.cnae_fiscal_principal}</p>
                            </div>
                            {result.data.qsa && result.data.qsa.length > 0 && (
                                <div className="md:col-span-2 bg-white/50 dark:bg-black/20 p-4 rounded-xl">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Quadro Societário (Sócios)</p>
                                    <div className="flex flex-wrap gap-2">
                                        {result.data.qsa.map((socio: any, idx: number) => (
                                            <span key={idx} className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg text-xs font-bold">
                                                👤 {socio.nome_socio} ({socio.qualificacao_socio})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 text-red-700 dark:text-red-400 font-bold">
                        <Icons.X /> 
                        <div>
                            <p className="text-lg">Problema na Validação</p>
                            <p className="text-sm font-normal opacity-80">{result.message}</p>
                        </div>
                    </div>
                )}
                </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default CNPJValidator;
