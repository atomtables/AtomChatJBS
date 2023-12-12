// noinspection JSValidateTypes

const config = require("./private/settings.js")
const CryptoJS = require("crypto-js")

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = config.port || 3000;

let users = []
let notOnline = []

//mainpage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/cookie.js', (req, res) => {
    res.sendFile(__dirname + '/scripts/cookie.js');
})
app.get('/lolzers', (req, res) => {
    res.send("export PS1=\"\\[\\e[32;40m\\]\\u\\[\\e[m\\]@\\[\\e[34m\\]\\h\\[\\e[m\\][\\[\\e[36m\\]\\w\\[\\e[m\\]]\\[\\e[33m\\]\\\\$\\[\\e[m\\] \"")
})


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
                io.emit("left", user)
                users.splice(users.indexOf(user), 1)
            } catch {
                // console.log("error: user not found")
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
        console.log(users)
    })
    // removes client from list of joined users
    socket.on("left", username => {
        console.log("user left: " + username)
        users.splice(users.indexOf(username), 1)
        io.emit("left", username)
        console.log(users)
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
        if (users.indexOf(username) === -1) socket.emit("is_still_online", false)
        else {
            let f = JSON.parse(JSON.stringify(users));
            f.splice(f.indexOf(username), 1)
            socket.emit("getUsers", f)
        }
    })
    // sends message to client
    socket.on('chat message', msg => {
        if (users.indexOf(msg[1]) === -1) socket.emit("is_still_online", false)
        else {
            io.emit("chat message", msg)
            console.log(msg[0], msg[1], msg[2])
        }
    });
    // sends typing notification to client
    socket.on("typing", username => {
        if (users.indexOf(username) === -1) socket.emit("is_still_online", false)
        else {
            console.log("user typing: " + username)
            socket.broadcast.emit("typing", username)
        }
    });
    // encryption check key
    socket.on("accessCodeCheck", code => {
        // console.log(code, config.accessCode, CryptoJS.AES.decrypt(code, config.accessCode).toString(CryptoJS.enc.Utf8))
        if (CryptoJS.AES.decrypt(code, config.accessCode).toString(CryptoJS.enc.Utf8) === config.accessCode) {
            socket.emit("accessCodeCheck", true)
        } else {
            socket.emit("accessCodeCheck", false)
        }
    })
    // send client settings from server
    socket.on("getSettings", () => {
        socket.emit("getSettings", {
            serverName: config.serverName,
            accessCodeEnabled: config.accessCodeEnabled,
            rememberAccessCode: config.rememberAccessCode
        })
    })
});
// http server init
http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
