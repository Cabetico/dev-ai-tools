const request = require('supertest');
const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');
const { app, server, io } = require('../src/server');

describe('Coding Interview App Integration Tests', () => {
    let clientSocket;
    let testSessionId;

    // Use a different port for testing to avoid conflicts
    const TEST_PORT = 3001;
    let testServer;

    beforeAll((done) => {
        // Because server.js exports the already created server instance,
        // we should make sure it's listening or reused correctly.
        // In our modifications, server.listen is conditional, so we can listen here.
        testServer = server.listen(TEST_PORT, () => {
            done();
        });
    });

    afterAll((done) => {
        io.close();
        testServer.close(done);
    });

    beforeEach((done) => {
        clientSocket = new Client(`http://localhost:${TEST_PORT}`);
        clientSocket.on('connect', done);
    });

    afterEach(() => {
        clientSocket.disconnect();
    });

    test('POST /api/sessions should create a new session', async () => {
        const response = await request(app)
            .post('/api/sessions')
            .send({ language: 'python' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('language', 'python');
        expect(response.body).toHaveProperty('code');

        testSessionId = response.body.id;
    });

    test('GET /api/sessions/:id should return session details', async () => {
        // Ensure we have a session to get (from previous test or create one)
        if (!testSessionId) {
            const createRes = await request(app)
                .post('/api/sessions')
                .send({ language: 'javascript' });
            testSessionId = createRes.body.id;
        }

        const response = await request(app).get(`/api/sessions/${testSessionId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(testSessionId);
    });

    test('WebSocket interaction: joining a room and receiving init state', (done) => {
        if (!testSessionId) {
            // Fallback if previous tests didn't run sequentially or failed
            // For independence, ideally we create a new session here
            request(app)
                .post('/api/sessions')
                .send({ language: 'java' })
                .end((err, res) => {
                    const sessionId = res.body.id;

                    clientSocket.emit('join-room', sessionId);
                    clientSocket.on('init-state', (state) => {
                        expect(state).toHaveProperty('code');
                        expect(state).toHaveProperty('language', 'java');
                        done();
                    });
                });
        } else {
            clientSocket.emit('join-room', testSessionId);
            clientSocket.on('init-state', (state) => {
                expect(state).toHaveProperty('code');
                done();
            });
        }
    });

    test('WebSocket interaction: code propagation', (done) => {
        // Create a new session for this test
        request(app)
            .post('/api/sessions')
            .send({ language: 'cpp' })
            .end((err, res) => {
                const sessionId = res.body.id;

                // Connect a second client
                const client2 = new Client(`http://localhost:${TEST_PORT}`);
                client2.on('connect', () => {

                    // Both join
                    clientSocket.emit('join-room', sessionId);
                    client2.emit('join-room', sessionId);

                    const newCode = '#include <iostream>\nint main() { return 0; }';

                    // Listen on client2 for updates sent by clientSocket
                    client2.on('code-update', (code) => {
                        expect(code).toBe(newCode);
                        client2.disconnect();
                        done();
                    });

                    // Send update from client1
                    clientSocket.emit('code-change', { roomId: sessionId, code: newCode });
                });
            });
    });
});
