export interface User {
    id: string;
    username: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface Message {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    timestamp: string;
    isOwn?: boolean;
}

export interface Room {
    id: string;
    name: string;
}
