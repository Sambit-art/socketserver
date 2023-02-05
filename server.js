const app = require('express')();
const http = require('http').Server(app);
const cors = require('cors')
app.use(cors())
const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    },

});

// io.origin((origin, callback) => {
//     if (origin.match(/lvh\.me/)) {
//         return callback(null, true)
//     }
//     callback('Origin not allowed', false)
// })

const path = require('path')
let room;



app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});



//Whenever someone connects this gets executed
io.on('connection', function (socket) {
    console.log('A user connected');

    socket.in(room).emit("bc", "a user connected")
    console.log('hello world');
    socket.on('ready', (id) => {
        console.log('your client is ready ..' + id);

        socket.emit('rec', 'yaa i have a coonection with you')

    })
    socket.on('stop', (id) => {
        console.log('want to stop' + id);
    })
    socket.on('disconnect', () => {
        console.log('a user disconnected');
        socket.leave(room)
        io.in(room).emit("bc", "a user disconnected")
    })
    socket.on('join', (roomname, username) => {
        socket.join(roomname)
        room = roomname;
        io.in(room).emit("bc", `${username} connected`)
    })
    socket.on('msg', (roomName, msg, id, username) => {
        console.log(roomName + "  " + msg);
        io.to(roomName).emit('receivemsg', msg, id, username)
    })
})

// setInterval(() => {
//     io.emit("bc", "emitted")
//     console.log('emmited');
// }, 10000);

http.listen(10000, function () {
    console.log('listening on *:10000');
});