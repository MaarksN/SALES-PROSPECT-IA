import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUserContext } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock de Login
    setUserContext({
        id: "123",
        name: "Usuário Demo",
        email: "demo@salesprospector.com",
        credits: 45,
        plan: "free",
        onboardingCompleted: true,
        preferences: { theme: "light", language: "pt" }
    });

    toast.success("Login realizado com sucesso!");
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0B1120] to-[#0B1120]">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/5 p-10 border border-white/10 backdrop-blur-xl">
        <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tighter text-white">Sales Prospector v2</h1>
            <p className="mt-2 text-slate-400">Entre para acessar sua inteligência de vendas.</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div>
                <label className="text-xs font-bold uppercase text-slate-500">E-mail Corporativo</label>
                <input
                    type="email"
                    required
                    className="mt-2 w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="voce@empresa.com"
                />
            </div>
            <div>
                <label className="text-xs font-bold uppercase text-slate-500">Senha</label>
                <input
                    type="password"
                    required
                    className="mt-2 w-full rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="••••••••"
                />
            </div>

            <Button type="submit" className="w-full py-6 text-lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Acessar Plataforma"}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
        </form>

        <p className="text-center text-xs text-slate-600">
            Protegido por criptografia de ponta a ponta.
        </p>
      </div>
    </div>
  );
}