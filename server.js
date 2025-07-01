const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const { processMessage } = require('./services/chatbot');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', async (message) => {
        try {
            console.log('Received WebSocket message:', message.toString());
            const data = JSON.parse(message);
            // Handle different message types
            switch (data.type) {
                case 'chat':
                    console.log('Processing chat message:', data.message);
                    // Process message using chatbot service
                    const response = await processMessage(data.message);
                    console.log('Chatbot response:', response);
                    ws.send(JSON.stringify({
                        type: 'chat',
                        message: response.message,
                        action: response.action
                    }));
                    break;
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}`);
        server.close();
        app.listen(PORT + 1, () => {
            console.log(`Server is running on port ${PORT + 1}`);
        });
    } else {
        console.error('Server error:', error);
    }
});

// Upgrade HTTP server to WebSocket
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
}); 