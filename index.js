const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const fs = require('fs')

var users = []
var notOnline = []

//mainpage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


// push notification support
app.get('/worker.js', (req, res) => {
    res.sendFile(__dirname + "/public/worker.js")
})

setInterval(() => {
    notOnline = JSON.parse(JSON.stringify(users));
    io.emit("online_check")
    setTimeout(() => {
        notOnline.forEach(user => {
            try {
                console.log("user went offline: " + user)
                users.splice(users.indexOf(user), 1)
            } catch {
                console.log("error: user not found")
            }
        })
    }, 5000)
}, 10000)

// message receiver
io.on('connection', (socket) => {
    socket.on("is_still_online", username => {
        if (users.indexOf(username) !== -1) {
            socket.emit("is_still_online", true)
        } else {
            socket.emit("is_still_online", false)
        }
    })
    socket.on("joined", username => {
        console.log("new user joined: " + username)
        if (notOnline.indexOf(username) === -1) {
            users.push(username)
        }
        try {
            notOnline.splice(notOnline.indexOf(username), 1)
        } catch {
            console.log("error: user not found")
        }
        io.emit("joined", username)
    })
    socket.on("left", username => {
        console.log("user left: " + username)
        users.splice(users.indexOf(username), 1)
        io.emit("left", username)
    })
    socket.on("online_response", username => {
        try {
            notOnline.splice(notOnline.indexOf(username), 1)
        } catch {
            console.log("error: user not found")
        }
    })
    socket.on("getUsers", (username) => {
        var f = JSON.parse(JSON.stringify(users));
        f.splice(f.indexOf(username), 1)
        io.emit("getUsers", f)
    })
    socket.on('chat message', msg => {
        io.emit("chat message", msg)
        console.log(msg[0], msg[1], msg[2])
    });
});
// http server init
http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
