var socket = io();

//ELEMENTS
var message = $('#message-input');
var submitButton = $("#submit-button");
var sendLocationButton = $('#send-location');
var messages = $('#messages');
var sidebar = $('#sidebar');

//TEMPLATES
var messageTemplate = $('#message-template').html();
var locationMessageTemplate = $('#locationMessage-template').html();
var profanityMessageTemplate = $("#profanity-template").html();
var sidebarTemplate = $('#sidebar-template').html();

//OPTIONS
var { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('welcome-message', ({ username, message, createdAt }) => {
    var html = Mustache.render(messageTemplate, {
        username: username,
        message: message,
        createdAt: moment(createdAt).format('hh:mm a')
    });
    messages.append(html);
});

socket.on('newUser', ({ username, message, createdAt }) => {
    var html = Mustache.render(messageTemplate, {
        username: username,
        message: message,
        createdAt: moment(createdAt).format('hh:mm a')
    });
    messages.append(html);
});

socket.on('broadcastLocation', ({ username, location, createdAt }) => {
    var html = Mustache.render(locationMessageTemplate, {
        username,
        message: 'User location',
        url: location,
        createdAt: moment(createdAt).format('hh:mm a')
    });
    messages.append(html);
});

socket.on('online-users', ({ room, users }) => {
    console.log(room);
    console.log(users);
    var html = Mustache.render(sidebarTemplate, { room, users }); // not working...
    sidebar.html(html);
});

socket.on('new-message', ({ username, message, createdAt }) => {
    var html = Mustache.render(messageTemplate, {
        username: username,
        message: message,
        createdAt: moment(createdAt).format('hh:mm a')
    });
    messages.append(html);
});

socket.on('profanity', ({ username, message, createdAt }) => {
    var html = Mustache.render(profanityMessageTemplate, {
        username: username,
        message: message,
        createdAt: moment(createdAt).format('hh:mm a')
    });
    messages.append(html);
});

$('#message-form').on('submit', e => {

    e.preventDefault();
    submitButton.attr("disabled", true);

    socket.emit('sendMessage', { message: message.val() }, message => console.log(message));
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

socket.emit('join', { username, room }, error => {
    if (error) location.href = '/error.html';
});