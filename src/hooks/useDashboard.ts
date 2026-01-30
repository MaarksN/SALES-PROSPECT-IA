
import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SavedGen } from '../../types';

export const useDashboardMetrics = () => {
  const leads = useStore(state => state.leads);
  const [savedGens] = useLocalStorage<SavedGen[]>('sales_ai_history', []);

  const stats = useMemo(() => {
    return {
        totalLeads: leads.length,
        qualifiedLeads: leads.filter(l => l.score > 70).length,
        conversionRate: leads.length > 0 ? ((leads.filter(l => l.status === 'won').length / leads.length) * 100).toFixed(1) : 0,
        projectedRevenue: leads.length * 15000 // Mock value per lead
    }
  }, [leads]);

  const pieData = useMemo(() => {
      // Logic for pie chart data preparation
      // This is now purely data transformation, decoupled from UI
      const counts = {
          new: leads.filter(l => l.status === 'new').length,
          qualifying: leads.filter(l => l.status === 'qualifying').length,
          negotiation: leads.filter(l => l.status === 'negotiation').length,
          won: leads.filter(l => l.status === 'won').length
      };
      return counts;
  }, [leads]);

  const toolStats = useMemo(() => {
      const counts: Record<string, number> = {};
      savedGens.forEach(gen => {
          counts[gen.toolName] = (counts[gen.toolName] || 0) + 1;
      });
      return Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name: name.split('.')[1] || name, count }));
  }, [savedGens]);

  return { leads, stats, pieData, toolStats, savedGens };
};
