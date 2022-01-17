const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

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
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});