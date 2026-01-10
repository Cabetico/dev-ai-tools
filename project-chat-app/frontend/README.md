# Chat Application Frontend

A modern, real-time chat application built with React, TypeScript, and WebSockets. Features user authentication, real-time messaging, typing indicators, and online/offline status.

## Features

- **User Authentication**: Login and registration with JWT token storage
- **Real-time Messaging**: WebSocket-based instant messaging
- **Typing Indicators**: See when other users are typing
- **Online/Offline Status**: Track user presence in real-time
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Auto-Reconnection**: Automatic WebSocket reconnection with exponential backoff
- **Optimistic Updates**: Instant UI feedback for better UX

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **WebSocket API** for real-time communication
- **Vitest** and **React Testing Library** for testing

## Prerequisites

- Node.js 18+ and npm
- A WebSocket backend server (see WebSocket API section below)

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set VITE_WS_URL to your WebSocket server URL
```

## Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

The development server will start at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_WS_URL=ws://localhost:3000
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Chat/           # Chat-related components
│   │   ├── Chat.tsx    # Main chat container
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   └── RoomList.tsx
│   ├── ui/             # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── hooks/              # Custom React hooks
│   └── useWebSocket.ts # WebSocket connection management
├── services/           # API services
│   └── auth.ts         # Authentication service
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── format.ts       # Date/time formatting
├── App.tsx             # Main app component with routing
└── main.tsx            # Application entry point
```

## WebSocket API Format

The frontend expects the WebSocket server to follow this message format:

### Client → Server Messages

#### Join Room
```json
{
  "type": "join",
  "payload": {
    "userId": "user-123",
    "username": "john_doe"
  }
}
```

#### Send Message
```json
{
  "type": "message",
  "payload": {
    "id": "msg-456",
    "content": "Hello, world!",
    "senderId": "user-123",
    "senderName": "john_doe",
    "timestamp": "2024-01-10T12:00:00.000Z"
  }
}
```

#### Typing Indicator
```json
{
  "type": "typing",
  "payload": {
    "userId": "user-123",
    "isTyping": true
  }
}
```

### Server → Client Messages

#### New Message
```json
{
  "type": "message",
  "payload": {
    "id": "msg-456",
    "content": "Hello, world!",
    "senderId": "user-123",
    "senderName": "john_doe",
    "timestamp": "2024-01-10T12:00:00.000Z"
  }
}
```

#### User Joined
```json
{
  "type": "user_joined",
  "payload": {
    "userId": "user-789"
  }
}
```

#### User Left
```json
{
  "type": "user_left",
  "payload": {
    "userId": "user-789"
  }
}
```

#### Typing Indicator
```json
{
  "type": "typing",
  "payload": {
    "userId": "user-123",
    "isTyping": true
  }
}
```

## Testing

The project includes comprehensive tests:

- **Unit Tests**: Utility functions (date formatting, etc.)
- **Component Tests**: Login/Registration forms
- **Hook Tests**: WebSocket connection management

Run tests with:
```bash
npm test
```

## Authentication

The application uses a mock authentication service that stores JWT tokens in localStorage. In a production environment, you would replace `src/services/auth.ts` with actual API calls to your backend.

### Mock Authentication Flow

1. User enters username
2. Mock service generates a token and user object
3. Token and user data are stored in localStorage
4. User is redirected to the chat interface

## Features in Detail

### WebSocket Connection Management

The `useWebSocket` hook provides:
- Automatic connection on mount
- Exponential backoff reconnection (up to 5 attempts)
- Connection state tracking (connecting, connected, disconnected)
- Message sending with connection validation
- Cleanup on unmount

### Responsive Design

The interface adapts to different screen sizes:
- **Desktop**: Side-by-side room list and chat area
- **Mobile**: Collapsible sidebar with overlay

### Message Display

Messages show:
- Sender name (for received messages)
- Timestamp (HH:mm format)
- Visual distinction between sent and received messages
- Auto-scroll to latest message

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request
