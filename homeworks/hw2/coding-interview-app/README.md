# Coding Interview App

An online platform for coding interviews with real-time collaborative code editing.

## Prerequisites

- Node.js installed on your machine.

## Project Structure

- `frontend`: React + Vite application.
- `backend`: Express + Socket.io server.

## Installation

1. Install dependencies for both frontend and backend.

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Running the Application

You can start both the backend and frontend at the same time from the root directory:

```bash
npm run dev
```

### Start Individually

#### Start the Backend

The backend server runs on port 3000 by default.

```bash
cd backend
npm run dev
# or
npm start
```

#### Start the Frontend

The frontend development server usually runs on port 5173.

```bash
cd frontend
npm run dev
```

Open your browser and navigate to the local URL provided by Vite (e.g., `http://localhost:5173`).

## Testing

To run the integration tests for the backend (API and WebSocket interactions):

```bash
cd backend
npm test
```

## API Documentation

When the backend server is running, you can view the Swagger API documentation at:

`http://localhost:3000/api-docs`
