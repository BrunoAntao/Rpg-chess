function panel(id, width = 512, height = 512) {

    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    canvas.id = id;
    let ctx = canvas.getContext("2d");

    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    return { canvas: canvas, ctx: ctx };

}

let bg = panel('main');
let fg = panel('main');

var left = panel('left', 160, 512);
left.ctx.fillStyle = '#212121';
left.ctx.fillRect(0, 0, 160, 512);

var right = panel('right', 160, 512);
right.ctx.fillStyle = '#212121';
right.ctx.fillRect(0, 0, 160, 512);

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

    sheets: [],

    uid: 0

}

function visit(object) {

    let values = [];

    for (let key in object) {

        if (typeof object[key] == 'object') {

            visit(object[key]).forEach(function (value) {

                values.push(value);

            });

        } else {

            values.push(object[key]);

        }

    }

    return values;

}

for (let x = 0; x < 16; x++) {

    game.matrix[x] = [];

}

game.fg = {

    canvas: fg.canvas,
    ctx: fg.ctx,
    objects: [],
    game: game

}

game.bg = {

    canvas: bg.canvas,
    ctx: bg.ctx,
    objects: [],
    game: game

}

game.loadImage = function (path, key) {

    game.cache[key] = new Image();
    game.cache[key].temp = path;

}

game.init = function () {

    let c = 0;
    let ct = Object.keys(game.cache).length + 1;

    socket.emit('fetch classes');

    socket.on('classes', function (data) {

        data.sets.forEach(function (set) {

            let data = set.data.split('');

            let tiles = [];
            let player = {};

            for (let i = 0; i < data.length; i++) {

                if (data[i] == '#') {

                    tiles.push({ x: Math.floor(i % 16), y: Math.floor(i / 16), c: data[i] });

                }

                if (data[i] == '0') {

                    player = { x: Math.floor(i % 16), y: Math.floor(i / 16) }

                }

            }

            tiles.forEach(function (tile) {

                tile.x = tile.x - player.x;
                tile.y = tile.y - player.y;

            })

            let name = set.name.split('.');

            if (name[1] == 'move') {

                game.movesets[name[0]] = tiles;

            } else {

                game.attacksets[name[0]] = tiles;

            }

        })

        data.sheets.forEach(function (sheet) {

            game.sheets[sheet.name] = sheet.data;

        })

        check();

    })

    Object.keys(game.cache).forEach(function (key) {

        let image = game.cache[key];

        image.src = image.temp;
        image.addEventListener('load', function () {

            check();

        })

    })

    function check () {

        c++;

        if(c == ct) {

            init();

        }

    }

}

var socket = io();
var logic;

socket.on('connect', function () {

    console.log('connected');

})

game.loadImage('client/game/assets/tileset1.png', 'tileset');
game.loadImage('client/game/assets/cursor.png', 'cursor');
game.loadImage('client/game/assets/pieces.png', 'pieces');
game.loadImage('client/game/assets/marker.png', 'marker');

game.init();

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
    new Ranger(game.fg, 1, 5);
    new Mage(game.fg, 6, 8);
    new Arcanist(game.fg, 3, 3);

    logic = new TBLogic();

}

function draw() {

    if (game.keys[75]) {

        logic.update();

    }

    mouseCheck();

    game.fg.ctx.clearRect(0, 0, game.fg.canvas.width, game.fg.canvas.height);

    game.fg.objects.sort(function (a, b) {

        return a.z - b.z;

    })

    game.fg.objects.forEach(function (object) {

        object.draw();

    })

    requestAnimationFrame(draw);

}