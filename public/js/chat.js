var socket = io();

//ELEMENTS
var message = $('#message-input');
var submitButton = $("#submit-button");
var sendLocationButton = $('#send-location');
var messages = $('#messages');

//TEMPLATES
var messageTemplate = $('#message-template').html();
var locationMessageTemplate = $('#locationMessage-template').html();

//OPTIONS
var { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('welcome-message', data => {
    var html = Mustache.render(messageTemplate, {
        message: data.text,
        createdAt: moment(data.createdAt).format('hh:mm a')
    });
    messages.append(html);
});

socket.on('newUser', data => {
    var html = Mustache.render(messageTemplate, {
        message: data.text,
        createdAt: moment(data.createdAt).format('hh:mm a')
    });
    messages.append(html);
});

socket.on('broadcastLocation', data => {
    var html = Mustache.render(locationMessageTemplate, {
        message: 'User location',
        url: data.location,
        createdAt: moment(data.createdAt).format('hh:mm a')
    });
    messages.append(html);
});

socket.on('new-message', data => {
    var html = Mustache.render(messageTemplate, {
        message: data.text,
        createdAt: moment(data.createdAt).format('hh:mm a')
    });
    messages.append(html);
});

socket.on('forbidden', () => {
    window.location.href = "/error.html";
});

$('#message-form').on('submit', e => {

    e.preventDefault();
    submitButton.attr("disabled", true);

    socket.emit('sendMessage', message.val(), message => console.log(message));
    submitButton.attr("disabled", false);
    message.val('');
});

$('#send-location').on('click', () => {

    sendLocationButton.attr('disabled', true);

    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser!');
        sendLocationButton.attr('disabled', false);
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, message => {
            console.log(message);
            sendLocationButton.attr('disabled', false);
        });
    });
});

socket.emit('join', { username, room });
