import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Send } from 'lucide-react';

interface MessageInputProps {
    onSendMessage: (content: string) => void;
    onTyping: () => void;
    disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, onTyping, disabled }) => {
    const [message, setMessage] = useState('');
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);

        // Debounce typing indicator
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Only trigger typing if we haven't sent one recently (managed by parent or throttled)
        // But for now, just call it. Parent can throttle.
        onTyping();

        typingTimeoutRef.current = setTimeout(() => {
            // Stopped typing
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white flex gap-2">
            <div className="flex-1">
                <Input
                    value={message}
                    onChange={handleChange}
                    placeholder="Type a message..."
                    disabled={disabled}
                    className="w-full"
                />
            </div>
            <Button type="submit" disabled={!message.trim() || disabled}>
                <Send className="w-4 h-4 mr-1" />
                Send
            </Button>
        </form>
    );
};
