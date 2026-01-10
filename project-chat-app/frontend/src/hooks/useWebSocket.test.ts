import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useWebSocket } from './useWebSocket';

// Mock WebSocket with proper constants
class MockWebSocket {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;

    onopen: ((event: Event) => void) | null = null;
    onmessage: ((event: MessageEvent) => void) | null = null;
    onclose: ((event: CloseEvent) => void) | null = null;
    onerror: ((event: Event) => void) | null = null;
    readyState = 0; // CONNECTING
    url: string;

    constructor(url: string) {
        this.url = url;
        // Simulate async connection
        setTimeout(() => {
            this.readyState = 1; // OPEN
            if (this.onopen) {
                this.onopen(new Event('open'));
            }
        }, 10);
    }

    send(_data: string | object) {
        // Echo for testing - no-op
    }

    close() {
        this.readyState = 3; // CLOSED
        if (this.onclose) {
            this.onclose(new CloseEvent('close'));
        }
    }
}

describe('useWebSocket', () => {
    beforeEach(() => {
        // Set up WebSocket mock
        vi.stubGlobal('WebSocket', MockWebSocket);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('initializes with correct state', () => {
        const { result } = renderHook(() => useWebSocket('ws://localhost:3000'));

        // Initially should be connecting
        expect(result.current.isConnecting).toBe(true);
        expect(result.current.isConnected).toBe(false);
        expect(typeof result.current.sendMessage).toBe('function');
    });

    it('connects to websocket after timeout', async () => {
        const onOpen = vi.fn();
        const { result } = renderHook(() =>
            useWebSocket('ws://localhost:3000', { onOpen })
        );

        // Advance timers and flush promises
        await act(async () => {
            vi.advanceTimersByTime(20);
            // Allow promises to resolve
            await Promise.resolve();
        });

        expect(result.current.isConnected).toBe(true);
        expect(result.current.isConnecting).toBe(false);
        expect(onOpen).toHaveBeenCalled();
    });
});
