const { sessions } = require('./mockDb');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join-room', (roomId) => {
            socket.join(roomId);
            const session = sessions[roomId];
            if (session) {
                // Send current state to the new user
                socket.emit('init-state', {
                    code: session.code,
                    language: session.language
                });
            }
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on('code-change', ({ roomId, code }) => {
            if (sessions[roomId]) {
                sessions[roomId].code = code;
                // Broadcast to everyone else in the room
                socket.to(roomId).emit('code-update', code);
            }
        });

        socket.on('language-change', ({ roomId, language }) => {
            if (sessions[roomId]) {
                sessions[roomId].language = language;
                socket.to(roomId).emit('language-update', language);
            }
        });

        // Optional: Cursor positions
        socket.on('cursor-change', ({ roomId, position }) => {
            socket.to(roomId).emit('cursor-update', { msg: 'Cursor moved', userId: socket.id, position });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
