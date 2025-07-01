const express = require('express');
const router = express.Router();
const { processMessage } = require('../services/chatbot');

// Get chatbot response
router.post('/response', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = processMessage(message);
        res.json(response);
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 