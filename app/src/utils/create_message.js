const format = require('date-format');

const createMessage = (messageText) => {
    return {
        messageText,
        createdAt: format('dd/MM/yyyy - hh:mm:ss', new Date())
    }
}

module.exports = {
    createMessage,
}