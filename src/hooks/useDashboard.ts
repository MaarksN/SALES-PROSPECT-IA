import { useQuery } from "@tanstack/react-query";
import { DashboardStats } from "@/types";
import { sleep } from "@/lib/utils";
import { logger } from "@/lib/logger";

// Mock Fetcher - Em produção, isso seria uma chamada ao Supabase/API
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  logger.debug("Fetching dashboard stats...");
  await sleep(1200); // Simula network latency

  // Dados simulados
  return {
    totalLeads: 1240,
    qualifiedLeads: 320,
    conversionRate: 3.2,
    creditsUsed: 45
  };
};

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"], // Chave única para cache
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5, // Dados considerados frescos por 5 min
    refetchOnWindowFocus: false, // Não recarrega ao trocar de aba
    retry: 1, // Tenta apenas 1 vez se falhar
  });
}