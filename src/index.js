var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var socketio = require('socket.io');
var server = http.createServer(app);
var io = socketio(server);

var publicDirectoryPath = path.join(__dirname, '../public');
var port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(publicDirectoryPath));

//esta função (socket.broadcast.emit) transmite os dados para todas as sockets menos a própria
//esta função (io.emit) transmite os dados para todas as sockets

io.on('connection', socket => {

    console.log('New connection');

    socket.emit('welcome-message', 'Welcome, user!');

    socket.broadcast.emit('newUser', 'New user entered in  the room');

    socket.on('sendMessage', data => io.emit('new-message', data));

    socket.on('disconnect', () => io.emit('new-message', 'User left the room'));

    socket.on('sendLocation', ({ latitude, longitude }) => {
        socket.broadcast.emit('new-message', 'https://google.com/maps?q=' + latitude + ',' + longitude);
    });
});

server.listen(port, () => console.log('Listening on port ' + port));  
