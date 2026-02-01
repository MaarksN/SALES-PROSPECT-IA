import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { MainLayout } from "@/layouts/MainLayout";
import Login from "@/components/Login";
import OnboardingWizard from "@/components/OnboardingWizard";

// Lazy Loading
const Dashboard = lazy(() => import("@/components/Dashboard"));
const LeadList = lazy(() => import("@/components/LeadList"));
const InternalToolsDashboard = lazy(() => import("@/components/InternalToolsDashboard"));
const AILab = lazy(() => import("@/components/AILab"));

export default function App() {
  const { userContext } = useStore();
  const isAuthenticated = !!userContext;

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <MainLayout>
        {/* Verifica Onboarding */}
        {!userContext?.onboardingCompleted && <OnboardingWizard />}

        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<LeadList />} />
            <Route path="/tools" element={<InternalToolsDashboard />} />
            <Route path="/ai-lab" element={<AILab />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </MainLayout>
  );
}
