const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {createMessage} = require('./utils/create_message');
const {getUserList, addUser, removeUser} = require('./utils/users');

const directoryPath = path.join(__dirname, '../public');
app.use(express.static(directoryPath));

const server = http.createServer(app);
const io = socketio(server);


//lắng nghe sự kiện kết nối từ client
io.on("connection", (socket) => {
  



  socket.on('join room from client to server', ({room, user_name}) => {
    socket.join(room);    //server cho tham gia vào phòng là room

    //chào
    //gửi thông báo cho client vừa mới kết nối vào
    socket.emit('send message from server to client', createMessage(`Chào mừng bạn đến với phòng ${room}!`));

    //gửi thông báo cho các client còn lại
    socket.broadcast.to(room).emit('send message from server to client', createMessage(`${user_name} vừa tham gia vào phòng ${room}!`));

    //chat
    socket.on('send message from client to server', (messageText, callback) => {
      // console.log(messageText);
      const filter = new Filter();
      if(filter.isProfane(messageText)) {
        return callback("Tin nhắn không hợp lệ!")
      }
      
      io.to(room).emit('send message from server to client', createMessage(messageText));  //có thêm to(room) để server gửi cho đúng cùng phòng 
      callback();
    })
    
    //xử lý chia sẻ vị trí
    socket.on('share location from client to server', ({latitude, longitude}) => {
      const linkLocation = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      io.to(room).emit('share location from server to client', linkLocation);
    })

    //xử lý userList
    const newUser = {
      id: socket.id,
      user_name,
      room
    }
    addUser(newUser);
    io.to(room).emit('send userlist from server to client', getUserList(room));


    //ngắt kết nối
    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.to(room).emit('send userlist from server to client', getUserList(room));
      console.log('client left server'); 
    });
  })
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
