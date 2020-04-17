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

    socket.on('join', ({ username, room }, callback) => {

        var { user, error } = addUser(socket.id, username, room);

        if (error) return callback(error);

        socket.join(user.room);

        socket.emit('welcome-message', generateMessage({ username: user.name, message: 'Welcome, ' + user.name + '!' }));

        socket.broadcast.to(user.room).emit('newUser', generateMessage({ username: user.name, message: user.name + ' entered in the room' }));
    });

    socket.on('sendMessage', ({ message }, callback) => {

        var user = getUser(socket.id);
        var filter = new Filter();

        if (filter.isProfane(message)) {
            socket.emit('profanity', generateMessage({ username: user.name, message: 'Profanity is not allowed!' }));
        } else {
            io.to(user.room).emit('new-message', generateMessage({ username: user.name, message }));
            callback('Message sent.');
        }
    });

    socket.on('sendLocation', ({ latitude, longitude }, callback) => {

        var user = getUser(socket.id);

        socket.broadcast.to(user.room).emit('broadcastLocation', generateLocationMessage({ username: user.name, location: 'https://google.com/maps?q=' + latitude + ',' + longitude }));
        callback('Location was shared!');
    });

    socket.on('disconnect', () => {

        var user = removeUser(socket.id);

        if (user) io.to(user.room).emit('new-message', generateMessage({ username: user.name, message: user.name + ' has left the room' }));
    });
});

server.listen(port, () => console.log('Listening on port ' + port));  
