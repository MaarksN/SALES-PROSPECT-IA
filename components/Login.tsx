
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Icons } from '../constants';

const Login: React.FC = () => {
  const login = useStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulating Auth Delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    login(email);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05050A] text-white p-4 relative overflow-hidden">
        {/* Background FX */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -mt-20 -ml-20"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -mb-20 -mr-20"></div>

        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
                    <Icons.Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-black mb-2">Bem-vindo de volta</h1>
                <p className="text-slate-400">Acesse o Sales Prospector AI v2.1</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">E-mail Corporativo</label>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="seu@email.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Senha</label>
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {loading ? <Icons.Refresh className="animate-spin" /> : 'Entrar no Sistema'}
                </button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-500">
                <p>Protegido por criptografia Enterprise Grade.</p>
                <p>Sales Prospector © 2026</p>
            </div>
        </div>
    </div>
  );
};

export default Login;
