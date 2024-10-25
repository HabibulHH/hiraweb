// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle socket connection
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Broadcast a welcome message to the connected client
    socket.emit('message', 'Welcome to the chat room!');

    // Broadcast received messages to all clients
    socket.on('message', (message) => {
        io.emit('message', message);
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('A client disconnected:', socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});