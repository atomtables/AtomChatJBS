const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const fs = require('fs')

const d = new Date();
d.setTime(d.getTime())
let options = { year: 'numeric', month: 'numeric', day: 'numeric' };

fs.writeFile(d.toString("MM_DD_YYYY__HH__MM") + "log-messages.txt", "log-init\n", err => {
    if (err) {
        console.error(err)
        return
    }
    //file written successfully
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.get('/d', (req, res) => {
    res.sendFile(__dirname + '/darkmode.html');
});

app.get('/worker.js', (req, res) => {
    res.sendFile(__dirname + "/worker.js")
})


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

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});