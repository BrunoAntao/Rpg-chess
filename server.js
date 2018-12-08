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

    socket.on('fetch classes', function () {

        let files = fs.readdirSync('./classes/sets');

        let sets = [];

        files.forEach(function (file) {

            let set = fs.readFileSync('./classes/sets/' + file, "utf8").replace(/(\r\n|\n|\r)/gm, "");

            sets.push({ name: file, data: set });

        })

        files = fs.readdirSync('./classes/sheets');

        let sheets = [];

        files.forEach(function (file) {

            let sheet = JSON.parse(fs.readFileSync('./classes/sheets/' + file, "utf8"));

            sheets.push({ name: file.split('.')[0], data: sheet });

        })

        socket.emit('classes', { sets: sets, sheets: sheets });

    })

})