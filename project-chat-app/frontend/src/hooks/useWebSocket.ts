import { useEffect, useRef, useState, useCallback } from 'react';

interface UseWebSocketOptions {
    onMessage?: (event: MessageEvent) => void;
    onOpen?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (event: Event) => void;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
}

export const useWebSocket = (url: string, options: UseWebSocketOptions = {}) => {
    const {
        onMessage,
        onOpen,
        onClose,
        onError,
        reconnectInterval = 3000,
        maxReconnectAttempts = 5
    } = options;

    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const connect = useCallback(() => {
        try {
            if (wsRef.current?.readyState === WebSocket.OPEN) return;

            setIsConnecting(true);
            const ws = new WebSocket(url);

            ws.onopen = (event) => {
                setIsConnected(true);
                setIsConnecting(false);
                reconnectAttemptsRef.current = 0;
                onOpen?.(event);
                console.log('WebSocket connected');
            };

            ws.onmessage = (event) => {
                onMessage?.(event);
            };

            ws.onclose = (event) => {
                setIsConnected(false);
                setIsConnecting(false);
                wsRef.current = null;
                onClose?.(event);
                console.log('WebSocket disconnected');

                // Reconnect logic
                if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                    const timeout = Math.min(
                        reconnectInterval * Math.pow(1.5, reconnectAttemptsRef.current),
                        30000
                    );
                    console.log(`Reconnecting in ${timeout}ms...`);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectAttemptsRef.current++;
                        connect();
                    }, timeout);
                }
            };

            ws.onerror = (event) => {
                onError?.(event);
                console.error('WebSocket error:', event);
            };

            wsRef.current = ws;
        } catch (error) {
            setIsConnecting(false);
            console.error('WebSocket connection error:', error);
        }
    }, [url, maxReconnectAttempts, reconnectInterval, onMessage, onOpen, onClose, onError]);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connect]);

    const sendMessage = useCallback((data: string | object) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const message = typeof data === 'string' ? data : JSON.stringify(data);
            wsRef.current.send(message);
        } else {
            console.warn('WebSocket is not connected');
        }
    }, []);

    return { isConnected, isConnecting, sendMessage };
};
