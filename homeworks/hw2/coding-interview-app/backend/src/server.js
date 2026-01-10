const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const yaml = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const routes = require('./routes');
const socketHandler = require('./socketHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for homework/dev
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', routes);

// Swagger
const openApiSpec = yaml.load(path.join(__dirname, '../openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Socket.io
socketHandler(io);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
    });
}

module.exports = { app, server, io };
