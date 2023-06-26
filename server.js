const http=require('http');
const express = require('express');

const app = express();

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.static( `${process.cwd()}/public`));

app.get('/', (req, res) => {
    res.sendFile(`${process.cwd()}/index.html`)
})

// Socket.io configuration start//

const io = require('socket.io')(server);
var users = {}

 io.on('connection', (socket) => {
    socket.on('new-user-joined', (username) => {
        users[socket.id]=username;
        socket.broadcast.emit("user-connected", username);
        io.emit("user-list", users);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit("user-disconnected", user=users[socket.id]);
        delete users[socket.id];
        io.emit("user-list", users);
    });

    socket.on('message', (data) => {
        socket.broadcast.emit('message', {user: data.user, msg: data.msg});
    });
 });

// Socket.io configuration end//
server.listen(PORT, () => {
    console.log(`Server listen on PORT: ${PORT}`);
});