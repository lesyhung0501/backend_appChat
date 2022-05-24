let userList = [
    {
        id: 1,
        user_name: 'Le Sy Hung',
        room: '1'
    },
    {
        id: 2,
        user_name: 'Sy Hung',
        room: '2'
    }
]

const addUser = (newUser) => userList = [...userList, newUser];

const removeUser = (id) => userList = userList.filter(user => user.id !== id);

const getUserList = (room) => userList.filter(user => user.room === room);


module.exports = {
    getUserList,
    addUser,
    removeUser
}