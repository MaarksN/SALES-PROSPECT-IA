
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { GoogleGenAIMock, generateContentMock, createChatMock, sendMessageMock } = vi.hoisted(() => {
    const generateContentMock = vi.fn().mockResolvedValue({
        text: JSON.stringify({ result: 'success' }),
        candidates: []
    });
    const sendMessageMock = vi.fn().mockResolvedValue({
        text: 'Chat response'
    });
    const createChatMock = vi.fn().mockReturnValue({
        sendMessage: sendMessageMock
    });

    // Use a regular function for the mock implementation to support 'new'
    const GoogleGenAIMock = vi.fn();
    GoogleGenAIMock.mockImplementation(function() {
        return {
            models: {
                generateContent: generateContentMock
            },
            chats: {
                create: createChatMock
            }
        };
    });

    return { GoogleGenAIMock, generateContentMock, createChatMock, sendMessageMock };
});

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: GoogleGenAIMock,
    Type: {
        STRING: 'string',
        NUMBER: 'number',
        BOOLEAN: 'boolean',
        OBJECT: 'object',
        ARRAY: 'array'
    }
  };
});

// Import the service AFTER mocking
import { executeAITool, executeBirthubEngine, sendChatMessage } from './geminiService';

describe('GeminiService Optimization', () => {
  beforeEach(() => {
    // We do NOT clear constructor mock history here because we want to track it across the test file lifetime relative to import
    generateContentMock.mockClear();
    sendMessageMock.mockClear();
    createChatMock.mockClear();
  });

  it('should reuse the GoogleGenAI instance', async () => {
    // The constructor is called once when the module is imported.
    // We check how many times it has been called so far.
    const initialInstances = GoogleGenAIMock.mock.calls.length;

    // Verify it was instantiated at least once (at module load)
    expect(initialInstances).toBeGreaterThanOrEqual(1);

    // Call executeAITool
    await executeAITool('prompt', { key: 'value' });

    // Call executeBirthubEngine
    await executeBirthubEngine('target');

    // Call sendChatMessage
    await sendChatMessage([], 'message');

    // The number of instances should NOT have increased
    expect(GoogleGenAIMock).toHaveBeenCalledTimes(initialInstances);
  });

  it('should call generateContent on the instance', async () => {
    await executeAITool('prompt', { key: 'value' });
    expect(generateContentMock).toHaveBeenCalled();
  });
});
