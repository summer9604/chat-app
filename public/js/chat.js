var socket = io();

socket.on('welcome-message', data => console.log(data));

socket.on('newUser', data => console.log(data));

socket.on('new-message', data => console.log(data));

$('#message-form').on('submit', e => {

    e.preventDefault();

    var message = $('#message-input');
    socket.emit('sendMessage', message.val());
    message.val('');
});

$('#send-location').on('click', () => {

    if (!navigator.geolocation) return alert('Geolocation is not supported by your browser!');

    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    });
});
