var generateMessage = text => {
    return {
        text,
        createdAt: new Date().getTime()
    };
};

var generateLocationMessage = location => {
    return {
        location,
        createdAt: new Date().getTime()
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage
}