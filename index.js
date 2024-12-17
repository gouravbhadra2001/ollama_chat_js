import { createRequire } from 'module'; 
const require = createRequire(import.meta.url);

const WebSocket = require('ws');
const http = require('http');
import ollama from 'ollama'

const PORT = 8080;

// Create an HTTP server
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('A user connected');

  // Listen for messages from the client
  ws.on('message', async (message) => {
    console.log(`Received message: ${message}`);
    
    const userMessage = { role: 'user', content: message.toString() };
    const response = await ollama.chat({ model: 'llama3.2', messages: [userMessage], stream: true });

    for await (const part of response) {
      ws.send(part.message.content);
    }
  });

  ws.on('close', () => {
    console.log('User disconnected');
  });
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`WebSocket server is running at ws://localhost:${PORT}`);
});