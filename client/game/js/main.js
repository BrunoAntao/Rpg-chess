let bgcanvas = document.createElement("canvas");
bgcanvas.width = 512;
bgcanvas.height = 512;
document.body.appendChild(bgcanvas);
let bgctx = bgcanvas.getContext("2d");

bgctx.webkitImageSmoothingEnabled = false;
bgctx.mozImageSmoothingEnabled = false;
bgctx.imageSmoothingEnabled = false;

let canvas = document.createElement("canvas");
canvas.width = 512;
canvas.height = 512;
document.body.appendChild(canvas);
let ctx = canvas.getContext("2d");

ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

let seed = Math.random();
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

let game = {

    cache: [],

    cursor: null,

    mouse: {

        x: -1,
        y: -1,
        left: false,
        middle: false,
        right: false,

    },

    keys: [],

    matrix: [],

    pieces: [],
    movesets: [],
    attacksets: [],

    uid: 0

}

for (let x = 0; x < 16; x++) {

    game.matrix[x] = [];

}

game.fg = {

    canvas: canvas,
    ctx: ctx,
    objects: [],
    game: game

}

game.bg = {

    canvas: bgcanvas,
    ctx: bgctx,
    objects: [],
    game: game

}

game.loadImage = function (path, key) {

    game.cache[key] = new Image();
    game.cache[key].temp = path;

}

game.load = function (array, init) {

    socket.emit('fetch sets');

    socket.on('sets', function (files) {

        let length1 = Object.keys(array).length;
        let length2 = files.length;
        let gcounter = 0;
        let counter1 = 0;
        let counter2 = 0;

        files.forEach(function (path) {

            game.loadSets(path, sc);

        })

        for (let key in array) {

            array[key].addEventListener('load', cc);
            array[key].src = array[key].temp;

        }

        function sc() {

            counter2++;

            if (counter2 === length2) {

                console.log('All sets loaded!');
                gcheck();

            }

        }

        function cc() {

            counter1++;

            if (counter1 === length1) {

                console.log('All images loaded!');
                gcheck();

            }

        }

        function gcheck() {

            gcounter++;

            if (gcounter === 2) {

                init();

            }

        }

    })

}

game.loadSets = function (path, callback) {

    var request = new XMLHttpRequest();

    request.open('GET', 'client/game/assets/movesets/' + path);
    request.responseType = 'text';

    request.onload = function () {

        let msg = request.response;

        msg = msg.replace(/(\r\n|\n|\r)/gm, "").split('');

        let tiles = [];
        let player = {};

        for (let i = 0; i < msg.length; i++) {

            if (msg[i] == '#') {

                tiles.push({ x: Math.floor(i % 16), y: Math.floor(i / 16), c: msg[i] });

            }

            if (msg[i] == '0') {

                player = { x: Math.floor(i % 16), y: Math.floor(i / 16) }

            }

        }

        tiles.forEach(function (tile) {

            tile.x = tile.x - player.x;
            tile.y = tile.y - player.y;

        })

        let name = path.split('.');

        if (name[1] == 'move') {

            game.movesets[name[0]] = tiles;

        } else {

            game.attacksets[name[0]] = tiles;

        }

        callback();

    };

    request.send();

}

var socket = io();
var logic;

socket.on('connect', function () {

    console.log('connected');

    var request = new XMLHttpRequest();

    request.open('GET', 'client/game/assets/sheets/warrior.json');
    request.responseType = 'text';

    request.onload = function () {

        game.test = JSON.parse(request.response);

    };

    request.send();

})

game.loadImage('client/game/assets/tileset1.png', 'tileset');
game.loadImage('client/game/assets/cursor.png', 'cursor');
game.loadImage('client/game/assets/pieces.png', 'pieces');
game.loadImage('client/game/assets/marker.png', 'marker');

game.load(game.cache, init);

function init() {

    requestAnimationFrame(draw);

    let data = '';

    for (let i = 0; i < 16 * 16; i++) {

        let x = i % 16;
        let y = Math.floor(i / 16);

        if (y == 0 || y == 15) {

            data += 9;

        } else if (x == 0 || x == 15) {

            data += 9;

        } else {

            data += Math.floor(8 + Math.random() * 2);

        }

    }

    let map = new Map(data);

    for (let x = 0; x < 16; x++) {

        for (let y = 0; y < 16; y++) {

            new TileSet(game.bg, 'tileset', x, y, map.tiles[x][y]).draw();

        }

    }

    game.cursor = new Cursor(game.fg, -1, -1);

    new Warrior(game.fg, 8, 10);
    new Ranger(game.fg, 1, 0);
    new Mage(game.fg, 6, 8);
    new Arcanist(game.fg, 3, 0);

    logic = new TBLogic();

}

function draw() {

    if(game.keys[75]) {

        logic.update();

    }

    mouseCheck();

    game.fg.ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.fg.objects.sort(function (a, b) {

        return a.z - b.z;

    })

    game.fg.objects.forEach(function (object) {

        object.draw();

    })

    requestAnimationFrame(draw);

}