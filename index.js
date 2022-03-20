const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const fs = require('fs')


/*
const d = new Date();
d.setTime(d.getTime())
let options = { year: 'numeric', month: 'numeric', day: 'numeric' };
// attempt to log messages fail

fs.writeFile(d.toString("MM_DD_YYYY__HH__MM") + "log-messages.txt", "log-init\n", err => {
    if (err) {
        console.error(err)
        return
    }
    //file written successfully
});*/

//mainpage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


// push notification support
app.get('/worker.js', (req, res) => {
    res.sendFile(__dirname + "/public/worker.js")
})

// message receiver
io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
        console.log(msg[0])
        fs.appendFile(d.toString("MM_DD_YYYY__HH__MM") + "log-messages.txt", msg[0] + "\n", err => {
            if (err) {
                console.error(err)
                return
            }
            //file written successfully
        })
    });
});
// http server init
http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});