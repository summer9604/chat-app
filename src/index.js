var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var socketio = require('socket.io');
var server = http.createServer(app);
var io = socketio(server);
var Filter = require('bad-words');
var { generateMessage, generateLocationMessage } = require('./utils/messages.js');
var { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users.js');

var publicDirectoryPath = path.join(__dirname, '../public');
var port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(publicDirectoryPath));

//esta função (socket.broadcast.emit) transmite os dados para todas as sockets menos a própria
//esta função (io.emit) transmite os dados para todas as sockets

io.on('connection', socket => {

    console.log('New connection');

    socket.on('join', ({ username, room }) => {

        if (getUser(username)) {
            socket.emit('forbidden');
        } else {
            addUser(username, room);

            socket.join(room);

            socket.emit('welcome-message', generateMessage('Welcome, user!'));

            socket.to(room).broadcast.emit('newUser', generateMessage(username + ' entered in the room'));
        }
    });

    socket.on('sendMessage', (message, callback) => {
        var filter = new Filter();

        if (filter.isProfane(message)) {
            callback('Content not allowed');
        } else {
            io.emit('new-message', generateMessage(message));
            callback('Message sent.');
        }
    });

    socket.on('sendLocation', ({ latitude, longitude }, callback) => {
        socket.broadcast.emit('broadcastLocation', generateLocationMessage('https://google.com/maps?q=' + latitude + ',' + longitude));
        callback('Location was shared!');
    });

    socket.on('disconnect', () => {
        io.emit('new-message', generateMessage('User left the room'));
    }); 
});

server.listen(port, () => console.log('Listening on port ' + port));  
