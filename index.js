const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

let users = [];

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('set username', (username) => {
        const userId = socket.id;
        const userIcon = `https://i.pravatar.cc/150?u=${userId}`;
        const user = { id: userId, username, icon: userIcon };
        users.push(user);

        io.emit('user list', users);

        socket.on('chat message', (msg) => {
            io.emit('chat message', { userId, username, msg });
        });

        socket.on('disconnect', () => {
            users = users.filter(user => user.id !== userId);
            io.emit('user list', users);
            console.log('A user disconnected');
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
