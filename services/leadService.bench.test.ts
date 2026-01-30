
import { describe, it, expect, vi } from 'vitest';
import { leadService } from './leadService';

// Mock Supabase config to force local fallback
vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: () => false,
  supabase: {
    from: vi.fn(),
  }
}));

describe('leadService Performance Benchmark', () => {
  it('fetchLeads should have a baseline delay', async () => {
    const start = performance.now();
    await leadService.fetchLeads();
    const end = performance.now();
    const duration = end - start;

    console.log(`fetchLeads duration: ${duration.toFixed(2)}ms`);

    // Optimized assertion: should be near instant
    expect(duration).toBeLessThan(50);
  });
});
