const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { sessions } = require('./mockDb');

router.post('/sessions', (req, res) => {
    const { language = 'javascript' } = req.body;
    const id = uuidv4();
    const newSession = {
        id,
        language,
        code: '// Start coding here...',
        createdAt: new Date().toISOString()
    };
    sessions[id] = newSession;
    res.status(201).json(newSession);
});

router.get('/sessions/:id', (req, res) => {
    const { id } = req.params;
    const session = sessions[id];
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
});

module.exports = router;
