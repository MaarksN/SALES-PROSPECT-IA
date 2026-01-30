import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserContext } from "@/types";

interface AppState {
  credits: number;
  userContext: UserContext | null;
  onboardingProgress: Record<string, boolean>;

  // Actions
  setUserContext: (ctx: UserContext) => void;
  decrementCredits: (amount: number) => boolean; // Retorna true se sucesso
  addCredits: (amount: number) => void;
  updateOnboardingProgress: (stepId: string) => void;
  completeOnboarding: () => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      credits: 0,
      userContext: null,
      onboardingProgress: {},

      setUserContext: (ctx) => set({ userContext: ctx, credits: ctx.credits }),

      decrementCredits: (amount) => {
        const current = get().credits;
        if (current < amount) return false; // Bloqueia ação se saldo insuficiente
        set({ credits: current - amount });
        return true;
      },

      addCredits: (amount) => set((state) => ({
        credits: state.credits + amount
      })),

      updateOnboardingProgress: (stepId) => set((state) => ({
        onboardingProgress: { ...state.onboardingProgress, [stepId]: true }
      })),

      completeOnboarding: () => set((state) => {
        if (!state.userContext) return {};
        // Adiciona bônus apenas se ainda não completou
        const isNew = !state.userContext.onboardingCompleted;
        return {
            userContext: { ...state.userContext, onboardingCompleted: true },
            credits: isNew ? state.credits + 10 : state.credits
        };
      }),

      logout: () => {
        localStorage.removeItem("sales-prospector-storage"); // Limpeza profunda
        set({ userContext: null, credits: 0, onboardingProgress: {} });
      },
    }),
    {
      name: "sales-prospector-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persiste apenas dados essenciais, evita lixo de sessão
        credits: state.credits,
        userContext: state.userContext,
        onboardingProgress: state.onboardingProgress
      }),
    }
  )
);