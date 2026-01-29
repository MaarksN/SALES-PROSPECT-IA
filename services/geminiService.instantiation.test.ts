
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GoogleGenAI } from '@google/genai';

vi.mock('@google/genai', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    GoogleGenAI: vi.fn(function() {
      return {
        models: {
            generateContent: vi.fn().mockResolvedValue({ text: '{}' }),
        },
        chats: {
            create: vi.fn().mockReturnValue({
                sendMessage: vi.fn().mockResolvedValue({ text: 'response' })
            })
        }
      };
    }),
  };
});

import { executeAITool, executeBirthubEngine, sendChatMessage } from './geminiService';

describe('GeminiService Instantiation Optimization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.API_KEY = 'test';
  });

  it('executeAITool should reuse the global GoogleGenAI instance', async () => {
    try {
        await executeAITool("prompt", {}, "role");
    } catch (e) {
        console.error(e);
    }
    // Should be 0 if optimized, 1 if not.
    // If it's NOT optimized, it should be 1.
    expect(GoogleGenAI).toHaveBeenCalledTimes(0);
  });

  it('executeBirthubEngine should reuse the global GoogleGenAI instance', async () => {
    try {
        await executeBirthubEngine("target");
    } catch(e) {
        console.error(e);
    }
    expect(GoogleGenAI).toHaveBeenCalledTimes(0);
  });

   it('sendChatMessage should reuse the global GoogleGenAI instance', async () => {
    try {
        await sendChatMessage([], "msg");
    } catch(e) {
        console.error(e);
    }
    expect(GoogleGenAI).toHaveBeenCalledTimes(0);
  });
});
