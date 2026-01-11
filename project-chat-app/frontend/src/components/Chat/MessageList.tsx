import React, { useRef, useEffect } from 'react';
import type { Message, User } from '../../types';
import { formatMessageTime } from '../../utils/format';
import { clsx } from 'clsx';

interface MessageListProps {
    messages: Message[];
    currentUser: User | null;
    typingUsers: Set<string>;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUser, typingUsers }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, typingUsers]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 from-gray-50 to-white" ref={scrollRef}>
            {messages.map((msg) => {
                const isOwn = msg.senderId === currentUser?.id;
                return (
                    <div
                        key={msg.id}
                        className={clsx(
                            "flex flex-col max-w-[70%]",
                            isOwn ? "ml-auto items-end" : "items-start"
                        )}
                    >
                        <div className="flex items-center space-x-2 mb-1">
                            {!isOwn && (
                                <span className="text-xs font-bold text-gray-700">{msg.senderName}</span>
                            )}
                            <span className="text-xs text-gray-400">
                                {formatMessageTime(msg.timestamp)}
                            </span>
                        </div>
                        <div
                            className={clsx(
                                "px-4 py-2 rounded-lg shadow-sm break-words",
                                isOwn
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                            )}
                        >
                            {msg.content}
                        </div>
                    </div>
                );
            })}

            {typingUsers.size > 0 && (
                <div className="flex items-center space-x-2 text-gray-500 text-sm italic">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span>Someone is typing...</span>
                </div>
            )}
        </div>
    );
};
