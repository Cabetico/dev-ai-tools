#### Create frontend

"""
**Core Features:**
* Build a chat interface with a room list, message display area, and input field
* Implement WebSocket client that connects to the backend and handles real-time messages
* Add user registration and login forms with JWT token storage (localStorage)
* Show online/offline status for users in the chat

**Technical Requirements:**
* Use React hooks (useState, useEffect, useContext) for state management
* Create a custom hook for WebSocket connection management
* Implement proper error handling for WebSocket disconnections and reconnections
* Add loading states for async operations
* Use environment variables for backend WebSocket URL configuration

**UI/UX:**
* Make the interface responsive (mobile-friendly)
* Add message timestamps
* Show typing indicators when users are typing
* Distinguish between sent and received messages visually
* Include basic CSS styling (or specify: Tailwind CSS / Material-UI / styled-components)

**Code Quality:**
* Use TypeScript (optional but recommended for learning)
* Include PropTypes or TypeScript interfaces for component props
* Add comments explaining WebSocket connection logic
* Follow React best practices for component structure

**Testing:** (Yes, ask for this!)
* Include unit tests for utility functions (JWT handling, message formatting)
* Add component tests for Login/Registration forms using React Testing Library
* Provide example tests for the WebSocket custom hook

**Documentation:**
* Include a README with setup instructions
* Document the expected backend WebSocket API format (what messages to send/receive)
* Add inline code comments for complex logic

**Notes:**
* Consider AGENT.md for instructions
* Crate a frontend folder and place all frontend code there
"""