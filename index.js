// noinspection JSValidateTypes

const config = require("./private/settings.js")

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = config.port;

let users = []
let notOnline = []

//mainpage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


// push notification support
app.get('/worker.js', (req, res) => {
    res.sendFile(__dirname + "/public/worker.js")
})

// checks for users that disconnected before performing the closing handshake
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
    }, 12500)
}, 15000)

// message receiver
io.on('connection', (socket) => {
    // informs client if they were kicked due to not responding to the closing handshake
    socket.on("is_still_online", username => {
        if (users.indexOf(username) !== -1) {
            socket.emit("is_still_online", true)
        } else {
            socket.emit("is_still_online", false)
        }
    })
    // adds client to list of joined users
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
    // removes client from list of joined users
    socket.on("left", username => {
        console.log("user left: " + username)
        users.splice(users.indexOf(username), 1)
        io.emit("left", username)
    })
    // recieves the response from the check before
    socket.on("online_response", username => {
        try {
            notOnline.splice(notOnline.indexOf(username), 1)
        } catch {
            console.log("error: user not found")
        }
    })
    // sends list of joined users to client
    socket.on("getUsers", (username) => {
        var f = JSON.parse(JSON.stringify(users));
        f.splice(f.indexOf(username), 1)
        io.emit("getUsers", f)
    })
    // sends message to client
    socket.on('chat message', msg => {
        io.emit("chat message", msg)
        console.log(msg[0], msg[1], msg[2])
    });

    socket.on("typing", username => {
        console.log("user typing: " + username)
        socket.broadcast.emit("typing", username)
    });
});
// http server init
http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
