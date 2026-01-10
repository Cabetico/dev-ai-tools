import { describe, it, expect } from 'vitest';
import { formatMessageTime } from './format';

describe('formatMessageTime', () => {
    it('formats valid ISO string correctly', () => {
        const date = new Date('2023-01-01T12:30:00Z');
        // Adjust for local time if needed, but for unit test we might want to mock timezone or just check format structure
        // Since HH:mm depends on timezone, we can check basic validity or use UTC

        // For simplicity in this env, we just check it returns a string in HH:mm format
        const result = formatMessageTime(date.toISOString());
        expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it('handles invalid dates gracefully', () => {
        expect(formatMessageTime('invalid-date')).toBe('Invalid Date');
    });
});
