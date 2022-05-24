
// yêu cầu server kết nối với client
const socket = io();

document.getElementById('form-message').addEventListener('submit', (e) => {
    e.preventDefault(); //loại bỏ hành vi mặc định load lại trang khi ấn vào submit
    const messageText = document.getElementById('input-message').value;
    const acknowledgement = (errors) => {
        if(errors) {
            return alert(errors);
        }
        console.log('Bạn đã gửi tin nhắn thành công!');
    }
    socket.emit('send message from client to server', messageText, acknowledgement);
})

socket.on('send message from server to client', (messageText) => {
    console.log(messageText);
})

//gửi vị trí 
document.getElementById('btn-share-location').addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('trình duyệt hiện tại không hỗ trợ chia sẻ vị trí!');
    }
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);

        const {latitude, longitude} = position.coords;
        socket.emit('share location from client to server', {latitude, longitude});
    })
})

socket.on('share location from server to client', (linkLocation) => {
    console.log(linkLocation);
})

//xử lý query String
const queryString = location.search;
// console.log(queryString);
const params = Qs.parse(queryString, {
    ignoreQueryPrefix: true    //loại bỏ dấu chấm hỏi
})
// console.log(params);
const {room, user_name} = params;
socket.emit('join room from client to server', {room, user_name});
document.getElementById('room_name').innerHTML = `Phòng ${room}`;

//xử lý userlist
socket.on('send userlist from server to client', (userList) => {
    console.log('userList: ', userList);
})