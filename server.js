const compression = require('compression');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const port = 80;

app.set('view engine', 'ejs');
app.use(compression());
app.use('/client', express.static('client'));

require('./server/routes.js')(app);

http.listen(port, function () {

    console.log('listening on: ' + port);

});

io.on('connection', function (socket) {

    console.log(socket.id + ' connected');

    socket.on('fetch sets', function () {

        fs.readdir('./client/assets/movesets/', function (err, files) {

            if (err) throw err;

            socket.emit('sets', files);

        });

    })

})