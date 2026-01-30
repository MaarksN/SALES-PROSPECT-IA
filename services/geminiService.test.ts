
import { describe, it, expect } from 'vitest';
import { convertToGeminiSchema } from './geminiService';
import { Type } from '@google/genai';

describe('geminiService', () => {
    describe('convertToGeminiSchema', () => {
        it('should convert simple string properties', () => {
            const input = { name: 'string', job: 'string' };
            const result = convertToGeminiSchema(input);

            expect(result.type).toBe(Type.OBJECT);
            expect(result.required).toEqual(['name', 'job']);
            expect(result.properties?.name).toEqual({ type: Type.STRING });
            expect(result.properties?.job).toEqual({ type: Type.STRING });
        });

        it('should convert number and boolean properties', () => {
            const input = { age: 'number', active: 'boolean' };
            const result = convertToGeminiSchema(input);

            expect(result.properties?.age).toEqual({ type: Type.NUMBER });
            expect(result.properties?.active).toEqual({ type: Type.BOOLEAN });
        });

        it('should handle array types', () => {
            const input = { tags: 'array' };
            const result = convertToGeminiSchema(input);

            expect(result.properties?.tags).toEqual({
                type: Type.ARRAY,
                items: { type: Type.STRING }
            });
        });

        it('should handle generic objects', () => {
            const input = { meta: 'object' };
            const result = convertToGeminiSchema(input);

            expect(result.properties?.meta).toEqual({
                type: Type.OBJECT,
                properties: { data: { type: Type.STRING } }
            });
        });
    });
});
