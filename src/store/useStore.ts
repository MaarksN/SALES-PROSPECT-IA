import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { UserContext } from "@/types";

interface UserState {
  userContext: UserContext | null;
  setUserContext: (ctx: UserContext) => void;
  logout: () => void;
}

interface CreditsState {
  credits: number;
  decrementCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
}

interface OnboardingState {
  onboardingProgress: Record<string, boolean>;
  updateOnboardingProgress: (stepId: string) => void;
  completeOnboarding: () => void;
}

// Combined Store Type
type AppState = UserState & CreditsState & OnboardingState;

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // --- User Slice ---
        userContext: null,
        setUserContext: (ctx) => set({ userContext: ctx, credits: ctx.credits }),
        logout: () => {
          localStorage.removeItem("sales-prospector-storage");
          set({ userContext: null, credits: 0, onboardingProgress: {} });
        },

        // --- Credits Slice ---
        credits: 0,
        decrementCredits: (amount) => {
          const current = get().credits;
          if (current < amount) return false;
          set({ credits: current - amount });
          return true;
        },
        addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),

        // --- Onboarding Slice ---
        onboardingProgress: {},
        updateOnboardingProgress: (stepId) => set((state) => ({
          onboardingProgress: { ...state.onboardingProgress, [stepId]: true }
        })),
        completeOnboarding: () => set((state) => {
          if (!state.userContext) return {};
          const isNew = !state.userContext.onboardingCompleted;
          return {
              userContext: { ...state.userContext, onboardingCompleted: true },
              credits: isNew ? state.credits + 10 : state.credits
          };
        }),
      }),
      {
        name: "sales-prospector-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          credits: state.credits,
          userContext: state.userContext,
          onboardingProgress: state.onboardingProgress
        }),
      }
    ),
    { name: "AppStore" } // DevTools config
  )
);
