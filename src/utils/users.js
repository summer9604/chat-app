var users = [];

var addUser = (id, username, room) => {

    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (users.find(user => user.username == username)) return { user: undefined, error: 'User already exists' };

    users.push({ id, username, room });

    return { user: getUser(id), error: undefined };
};

var removeUser = id => {

    var index = users.findIndex(user => user.id == id); //o find resulta mas ja que temos este...

    return index == -1 ? null : users.splice(index, 1)[0];
};

var getUser = id => users.find(user => user.id == id);

var getUsersInRoom = room => {
    room = room.trim().toLowerCase();
    return users.filter(user => user.room == room);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};
