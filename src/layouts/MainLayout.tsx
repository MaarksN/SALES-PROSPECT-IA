import React, { Suspense } from "react";
import { useStore } from "@/store/useStore";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Zap, Bot, Loader2 } from "lucide-react";
import clsx from "clsx";
import { Toaster } from "sonner";

// Sidebar Component
const Sidebar = () => {
  const { credits } = useStore();
  const location = useLocation();

  const navItemClass = (path: string) => clsx(
    "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
    location.pathname === path
      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 font-medium"
      : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
  );

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white px-6 py-8 dark:bg-slate-900 dark:border-slate-800">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">SP</div>
        <span className="text-lg font-bold text-slate-900 dark:text-white">Prospector v2</span>
      </div>

      <nav className="space-y-2">
        <Link to="/" className={navItemClass("/")}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
        </Link>
        <Link to="/leads" className={navItemClass("/leads")}>
            <Users size={20} /> <span>Meus Leads</span>
        </Link>
         <Link to="/tools" className={navItemClass("/tools")}>
            <Zap size={20} /> <span>Ferramentas</span>
        </Link>
        <Link to="/ai-lab" className={navItemClass("/ai-lab")}>
            <Bot size={20} /> <span>AI Lab</span>
        </Link>
      </nav>

      <div className="absolute bottom-8 left-6 right-6">
        <div className="mb-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
                <span>Créditos</span>
                <span>{credits}/500</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-full bg-indigo-500 transition-all" style={{ width: `${(credits / 500) * 100}%` }}></div>
            </div>
            <button className="mt-3 w-full rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white hover:bg-indigo-700">
                Upgrade Pro
            </button>
        </div>
      </div>
    </aside>
  );
};

// MainLayout Component
export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar />
        <main className="pl-64 transition-all">
             <div className="mx-auto max-w-7xl p-8">
                <Suspense fallback={
                    <div className="flex h-[50vh] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                }>
                    {children}
                </Suspense>
             </div>
        </main>
        <Toaster />
    </div>
  );
};
