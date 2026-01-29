
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { executeBirthubEngine } from './geminiService';

// Mock the GoogleGenAI library
const { generateContentMock } = vi.hoisted(() => {
  return { generateContentMock: vi.fn() };
});

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models: any;
      chats: any;
      constructor() {
        this.models = {
          generateContent: generateContentMock,
        };
        this.chats = {
            create: vi.fn().mockReturnValue({
                sendMessage: vi.fn().mockResolvedValue({ text: "Mock response" })
            })
        };
      }
    },
    Type: {
        OBJECT: 'object',
        STRING: 'string',
        NUMBER: 'number',
        BOOLEAN: 'boolean',
        ARRAY: 'array',
    },
    Modality: {},
  };
});

describe('geminiService Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Simulate a slow API response (100ms)
    generateContentMock.mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return {
        text: JSON.stringify({
          company: { legal_name: "Test Company" },
          decision: { status: "APPROVED" },
          scoring: { total_score: 90 },
        }),
      };
    });
  });

  it('should measure execution time without cache (baseline)', async () => {
    const target = "Test Target Company";

    const start1 = performance.now();
    await executeBirthubEngine(target);
    const end1 = performance.now();
    const duration1 = end1 - start1;

    const start2 = performance.now();
    await executeBirthubEngine(target);
    const end2 = performance.now();
    const duration2 = end2 - start2;

    console.log(`Call 1 Duration: ${duration1.toFixed(2)}ms`);
    console.log(`Call 2 Duration: ${duration2.toFixed(2)}ms`);

    // The first call should take ~100ms
    expect(duration1).toBeGreaterThan(90);

    // The second call should be instant (cached)
    expect(duration2).toBeLessThan(10);

    // Verify that the API was called only ONCE
    expect(generateContentMock).toHaveBeenCalledTimes(1);
  });
});
