var rooms = [];

var getRoom = name => rooms.find(room => room.name == name);

var getUserFromRoom = (username, room) => {

    var desiredRoom = getRoom(room);

    return desiredRoom.users.length > 0 ?
        desiredRoom.users.find(user => user == username) : null;
};

var createRoom = name => {

    var room = getRoom(name);

    if (room) {
        return room;
    } else {
        rooms.push({ name, users: [] })
        return getRoom(name);
    }
};

var addUserToRoom = (username, roomName) => {

    var room = createRoom(roomName);
    var user;

    if (room.users.length > 0) user = room.users.find(user => user == username);

    if (user) {
        return undefined;
    } else {
        room.users.push(user);
        return getUserFromRoom(user, roomName);
    }
};

var removeUserFromRoom = (username, roomName) => {

    var room = getRoom(roomName);

    if (room.users.length > 0) room.users = room.users.filter(user => user != username);
};

module.exports = {
    addUserToRoom,
    removeUserFromRoom
};