var users = [];


var addUser = (name, room) => {

    if (users.length > 0) {
        var user = users.find(user => user.name == name);

        if (user) return undefined;
    }
    return users.push({ name, room });
};

var removeUser = name => users = users.filter(user => user.name != name);

var getUser = name => users.find(user => user.name == name);

var getUsersInRoom = roomName => users.filter(user => user.room == roomName);


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};