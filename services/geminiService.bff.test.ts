
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeSalesTool } from './geminiService';

global.fetch = vi.fn();

describe('geminiService BFF', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call /api/generate with correct payload', async () => {
    const mockResponse = { text: 'AI Response' };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
      body: null, // mock body for stream check
    });

    const tool = {
      id: 'test',
      name: 'Test Tool',
      description: 'Test',
      category: 'test' as any,
      inputs: [{ name: 'input', label: 'Input', type: 'text' as const }],
      promptTemplate: 'Hello {{input}}',
    };

    const result = await executeSalesTool(tool, { input: 'World' });

    expect(global.fetch).toHaveBeenCalledWith('/api/generate', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('Hello World'),
    }));
    expect(result).toBe('AI Response');
  });
});
