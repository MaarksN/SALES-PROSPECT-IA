import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStore } from './store/useStore';
import { leadService } from './services/leadService';
import { Lead } from './types';

// Mock toast
vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock leadService methods
vi.spyOn(leadService, 'createLead').mockImplementation(async (lead) => {
  await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay
  return lead;
});

vi.spyOn(leadService, 'createLeads').mockImplementation(async (leads) => {
  await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay for the BATCH
  return leads;
});

describe('Performance Benchmark', () => {
  beforeEach(() => {
    useStore.setState({
      credits: 1000,
      user: { email: 'test@example.com', name: 'Test' },
      leads: []
    });
    vi.clearAllMocks();
  });

  const createDummyLeads = (count: number): Lead[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `lead-${i}`,
      companyName: `Company ${i}`,
      status: 'new',
      score: 50,
      createdAt: new Date().toISOString(),
      tags: []
    }));
  };

  it('measures sequential addLead performance (BASELINE)', async () => {
    const leads = createDummyLeads(10);
    const start = performance.now();

    // Simulate OLD App.tsx handleAddLeads (sequential)
    const { addLead } = useStore.getState();
    for (const lead of leads) {
      await addLead(lead);
    }

    const end = performance.now();
    const duration = end - start;
    console.log(`Sequential execution time: ${duration.toFixed(2)}ms`);

    // 10 leads * 50ms = ~500ms
    expect(duration).toBeGreaterThan(450);
    expect(useStore.getState().leads.length).toBe(10);
  });

  it('measures bulk addLeads performance (OPTIMIZED)', async () => {
    // Reset state first (handled by beforeEach but let's be safe regarding leads)
    useStore.setState({ leads: [] });

    const leads = createDummyLeads(10);
    const start = performance.now();

    // Simulate NEW App.tsx handleAddLeads (bulk)
    const { addLeads } = useStore.getState();
    await addLeads(leads);

    const end = performance.now();
    const duration = end - start;
    console.log(`Bulk execution time: ${duration.toFixed(2)}ms`);

    // 1 batch * 50ms = ~50ms
    expect(duration).toBeLessThan(100);
    expect(useStore.getState().leads.length).toBe(10);
  });
});
