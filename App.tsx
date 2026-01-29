
import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Icons } from './constants';
// Lazy loaded components for performance
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const LeadList = React.lazy(() => import('./components/LeadList'));
const CNPJValidator = React.lazy(() => import('./components/CNPJValidator'));
const AILab = React.lazy(() => import('./components/AILab'));
const ToolsHub = React.lazy(() => import('./components/ToolsHub'));
const BirthubEngine = React.lazy(() => import('./components/BirthubEngine'));
const ChatBot = React.lazy(() => import('./components/ChatBot'));
const Login = React.lazy(() => import('./components/Login'));

import LeadModal from './components/LeadModal';
import { Lead } from './types';
import { useStore } from './store/useStore'; // ZUSTAND
import { Toaster, toast } from 'react-hot-toast';
import { useLocalStorage } from './hooks/useLocalStorage';

// 404 Component
const NotFound: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-10 animate-in zoom-in">
        <div className="text-9xl mb-4">🛸</div>
        <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4">Área 404</h2>
        <p className="text-xl text-slate-500 mb-8">Parece que você navegou para um setor desconhecido da galáxia.</p>
        <button 
            onClick={onReset}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
        >
            Voltar para a Base (Dashboard)
        </button>
    </div>
);

const App: React.FC = () => {
  // Global State
  const { 
    user, 
    leads, 
    updateLead, 
    fetchLeads, 
    addLead,
    addLeads,
    logout 
  } = useStore();

  // Router Hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Derived State for UI Highlighting
  const currentPath = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);

  const [darkMode, setDarkMode] = useLocalStorage<boolean>('theme_dark', false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // UX States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initial Fetch
  useEffect(() => {
    fetchLeads();
  }, []);

  // #42 Dark Mode Implementation
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // DYNAMIC FAVICON
  useEffect(() => {
    const highLeads = leads.filter(l => l.score > 80).length;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
        ctx.beginPath();
        ctx.arc(16, 16, 16, 0, 2 * Math.PI);
        ctx.fillStyle = '#4f46e5'; 
        ctx.fill();
        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('S', 16, 17);

        if (highLeads > 0) {
            ctx.beginPath();
            ctx.arc(26, 6, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#ef4444';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) {
            link.href = canvas.toDataURL();
        } else {
            const newLink = document.createElement('link');
            newLink.rel = 'icon';
            newLink.href = canvas.toDataURL();
            document.head.appendChild(newLink);
        }
        document.title = highLeads > 0 ? `(${highLeads}) Oportunidades` : 'Sales Prospector';
    }
  }, [leads]);

  const handleUpdateLead = async (updated: Lead) => {
    await updateLead(updated);
    setSelectedLead(updated);
  };

  const handleAddLeads = async (newLeads: Lead[]) => {
      await addLeads(newLeads);
  }

  const handleNavigate = (viewId: string) => {
      const path = viewId === 'dashboard' ? '/' : `/${viewId}`;
      navigate(path);
      setMobileMenuOpen(false);
  }

  // --- AUTH GUARD ---
  if (!user) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <Login />
        </Suspense>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#05050A] font-sans selection:bg-purple-500 selection:text-white transition-colors duration-500">
      
      <Toaster position="top-right" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white' }} />

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg text-slate-600 dark:text-white"
      >
          {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white dark:bg-[#0B1120] z-40 p-8 flex flex-col gap-6 animate-in slide-in-from-right">
              <div className="text-2xl font-black mb-6">Menu de Navegação</div>
              <button onClick={() => handleNavigate('dashboard')} className="text-xl font-bold p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">Dashboard</button>
              <button onClick={() => handleNavigate('birthub')} className="text-xl font-bold p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl">BIRTHUB AI v2.1</button>
              <button onClick={() => handleNavigate('leads')} className="text-xl font-bold p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">Leads & IA</button>
              <button onClick={() => handleNavigate('tools')} className="text-xl font-bold p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">Ferramentas (100+)</button>
              <button onClick={() => handleNavigate('ailab')} className="text-xl font-bold p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">Laboratório IA</button>
              <button onClick={() => handleNavigate('validation')} className="text-xl font-bold p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">Validação</button>
              <button onClick={() => setDarkMode(!darkMode)} className="mt-auto p-4 border rounded-2xl">Alternar Tema</button>
              <button onClick={logout} className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold">Sair</button>
          </div>
      )}

      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-24' : 'w-80'} bg-white dark:bg-[#0B1120] border-r border-slate-200 dark:border-white/5 hidden md:flex flex-col shadow-2xl z-20 relative transition-all duration-500`}>
        <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-10 w-6 h-6 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center text-slate-500 z-50 shadow-sm hover:scale-110 transition-transform"
        >
            {sidebarCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
        </button>

        <div className="absolute top-0 left-0 w-full h-40 bg-purple-500/10 blur-[50px] pointer-events-none"></div>

        <div className={`p-8 flex flex-col items-center justify-center border-b border-slate-100 dark:border-white/5 relative z-10 transition-all ${sidebarCollapsed ? 'px-2' : ''}`}>
          <div className={`${sidebarCollapsed ? 'w-12 h-12 rounded-xl mb-2' : 'w-20 h-20 mb-5 rounded-[2rem]'} bg-gradient-to-br from-blue-600 via-purple-600 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-500/30 ring-4 ring-white/10 transition-all duration-500`}>
             <div className="text-white transform scale-125"><Icons.Sparkles /></div>
          </div>
          {!sidebarCollapsed && (
            <>
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-amber-400 bg-clip-text text-transparent uppercase leading-tight text-center tracking-tighter drop-shadow-sm whitespace-nowrap">
                    SALES<br/>PROSPECTOR
                </h1>
                <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 mt-2 uppercase whitespace-nowrap">AI Intelligence v2.0</span>
            </>
          )}
        </div>

        <div className="px-4 py-8 flex-1 overflow-y-auto overflow-x-hidden">
            {!sidebarCollapsed && (
                <div className="bg-slate-50 dark:bg-white/5 backdrop-blur-md rounded-[2rem] p-6 mb-8 border border-slate-100 dark:border-white/10 shadow-inner group hover:border-amber-500/30 transition-colors animate-in fade-in">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sistema Online</p>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                    </div>
                    <p className="text-3xl font-black text-slate-700 dark:text-white tabular-nums tracking-tight">
                        {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-slate-500 truncate">{user.email}</span>
                    </div>
                </div>
            )}

            <nav className="space-y-4">
                {[
                    { id: 'dashboard', icon: <Icons.Dashboard />, label: 'Dashboard' },
                    { id: 'birthub', icon: <Icons.Target />, label: 'BIRTHUB AI v2.1' },
                    { id: 'leads', icon: <Icons.Leads />, label: 'Leads & IA' },
                    { id: 'tools', icon: <Icons.Sparkles />, label: '100 Power Tools' },
                    { id: 'ailab', icon: <Icons.Lab />, label: 'Laboratório IA' },
                    { id: 'validation', icon: <Icons.Check />, label: 'Validação' },
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        title={sidebarCollapsed ? item.label : ''}
                        className={`group flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'px-6'} py-5 w-full text-lg font-bold rounded-[2rem] transition-all duration-300 relative overflow-hidden ${currentPath === item.id ? 'text-white shadow-xl shadow-purple-900/20' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5 hover:pl-8'} ${item.id === 'birthub' && currentPath !== 'birthub' ? 'text-indigo-500 dark:text-indigo-400' : ''}`}
                    >
                        {currentPath === item.id && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>}
                        <span className="relative z-10 flex items-center gap-4">
                            {item.icon} 
                            {!sidebarCollapsed && item.label}
                        </span>
                        {item.id === 'birthub' && !sidebarCollapsed && currentPath !== 'birthub' && (
                            <span className="absolute right-4 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                        )}
                    </button>
                ))}
            </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-200 dark:border-white/5 space-y-3">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center justify-center gap-3 w-full px-4 py-4 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 rounded-2xl transition-all`}
            title="Alternar Tema"
          >
            {darkMode ? <Icons.Sun /> : <Icons.Moon />}
            {!sidebarCollapsed && (darkMode ? 'Modo Claro' : 'Modo Escuro')}
          </button>
          
          <button 
            onClick={logout}
            className={`flex items-center justify-center gap-3 w-full px-4 py-4 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all`}
            title="Sair"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            {!sidebarCollapsed && "Encerrar Sessão"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#05050A] relative scroll-smooth">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
         
        <div className="p-6 md:p-10 max-w-[1800px] mx-auto relative z-10">
          
          <div className="mb-6 flex items-center gap-2 text-sm text-slate-400 font-medium animate-in fade-in slide-in-from-left">
              <span className="hover:text-purple-500 cursor-pointer" onClick={() => handleNavigate('dashboard')}>Home</span>
              <span>/</span>
              <span className="text-slate-600 dark:text-white capitalize">{currentPath === 'ailab' ? 'Laboratório IA' : currentPath === 'tools' ? 'Ferramentas de Vendas' : currentPath === 'birthub' ? 'Birthub AI v2.1' : currentPath}</span>
          </div>

          <Suspense fallback={
            <div className="flex items-center justify-center h-[50vh] animate-in fade-in">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse tracking-wide">Carregando Módulo...</p>
              </div>
            </div>
          }>
             <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads" element={<LeadList leads={leads} onSelect={setSelectedLead} onAddLeads={handleAddLeads} />} />
                <Route path="/tools" element={<ToolsHub />} />
                <Route path="/birthub" element={<BirthubEngine onSaveLead={(lead) => addLead(lead)} />} />
                <Route path="/ailab" element={<AILab />} />
                <Route path="/validation" element={<CNPJValidator />} />
                <Route path="*" element={<NotFound onReset={() => navigate('/')} />} />
             </Routes>
          </Suspense>

        </div>
      </main>

      {/* Floating Chatbot (Available in all views) */}
      <Suspense fallback={null}>
          <ChatBot />
      </Suspense>

      {/* Modal */}
      {selectedLead && (
        <LeadModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)}
          onUpdate={handleUpdateLead}
        />
      )}

    </div>
  );
};

export default App;
