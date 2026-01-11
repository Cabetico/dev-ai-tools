import React, { useState, useCallback } from 'react';
import { RoomList } from './RoomList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useAuth } from '../../contexts/AuthContext';
import type { Message, User } from '../../types';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

// Mock list of users for now, in a real app this would come from the backend/room
const MOCK_USERS: User[] = [
    { id: '1', username: 'Alice' },
    { id: '2', username: 'Bob' },
    { id: '3', username: 'Charlie' },
];

export const Chat: React.FC = () => {
    const { user, logout } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    const handleMessage = useCallback((event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'message':
                    setMessages((prev) => [...prev, data.payload]);
                    break;
                case 'user_joined':
                    setOnlineUsers((prev) => {
                        const newSet = new Set(prev);
                        newSet.add(data.payload.userId);
                        return newSet;
                    });
                    break;
                case 'user_left':
                    setOnlineUsers((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(data.payload.userId);
                        return newSet;
                    });
                    break;
                case 'typing':
                    setTypingUsers((prev) => {
                        const newSet = new Set(prev);
                        if (data.payload.isTyping) {
                            newSet.add(data.payload.userId);
                        } else {
                            newSet.delete(data.payload.userId);
                        }
                        return newSet;
                    });
                    break;
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (e) {
            console.error('Failed to parse message:', e);
        }
    }, []);

    const { sendMessage, isConnected } = useWebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:3000', {
        onOpen: () => {
            // Announce presence
            sendMessage({
                type: 'join',
                payload: { userId: user?.id, username: user?.username }
            });
        },
        onMessage: handleMessage
    });

    const handleSendMessage = (content: string) => {
        if (!user) return;

        // Optimistic update
        const tempId = Date.now().toString();
        const newMessage: Message = {
            id: tempId,
            content,
            senderId: user.id,
            senderName: user.username,
            timestamp: new Date().toISOString(),
        };

        // In a real app we might wait for ack, or just append. 
        // Here we append optimistically. The server should ideally echo back.
        setMessages((prev) => [...prev, newMessage]);

        sendMessage({
            type: 'message',
            payload: newMessage
        });
    };

    const handleTyping = () => {
        sendMessage({
            type: 'typing',
            payload: { userId: user?.id, isTyping: true }
        });

        // In a real app, we'd debounce sending 'false' after some time.
        // For simplicity, we just send start typing. 
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Mobile sidebar overlay */}
            {showMobileSidebar && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setShowMobileSidebar(false)}
                />
            )}

            {/* Sidebar (Room List) */}
            <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h1 className="font-bold text-xl text-gray-800">Chat App</h1>
                        <Button variant="ghost" size="sm" onClick={() => setShowMobileSidebar(false)} className="md:hidden">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    <RoomList
                        // In a real app we'd fetch all possible users or just show online ones
                        users={MOCK_USERS}
                        currentUser={user}
                        onlineUsers={onlineUsers}
                    />
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                            <Button variant="secondary" onClick={logout} className="text-xs h-8">Logout</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col w-full">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between shadow-sm z-10">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            className="md:hidden mr-2 p-2"
                            onClick={() => setShowMobileSidebar(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </Button>
                        <div>
                            <h2 className="font-semibold text-lg">General Room</h2>
                            <div className="flex items-center text-xs text-gray-500">
                                <span className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {isConnected ? 'Connected' : 'Disconnected'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Messages */}
                <MessageList
                    messages={messages}
                    currentUser={user}
                    typingUsers={typingUsers}
                />

                {/* Input */}
                <MessageInput
                    onSendMessage={handleSendMessage}
                    onTyping={handleTyping}
                    disabled={!isConnected}
                />
            </div>
        </div>
    );
};
