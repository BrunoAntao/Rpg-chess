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
    selected: {},

    mouse: {

        x: -1,
        y: -1,
        left: false,
        middle: false,
        right: false,

    },

    keys: [],

    pieces: [],
    movesets: [],
    attacksets: [],

    uid: 0

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

game.bg.redraw = function (x, y, map) {

    game.bg.objects.forEach(function (object) {

        if (object.x == x, object.y == y) {

            object.frame = map.tiles[object.x][object.y];
            object.draw();

        }

    })

}

game.bg.redrawAll = function (map) {

    game.bg.objects.forEach(function (object) {

        object.frame = map.tiles[object.x][object.y];
        object.draw();

    })

}

game.loadImage = function (path, key) {

    game.cache[key] = new Image();
    game.cache[key].temp = path;

}

game.load = function (array, init) {

    length1 = Object.keys(array).length;
    counter1 = 0;

    for (let key in array) {

        array[key].addEventListener('load', cc);
        array[key].src = array[key].temp;

    }

    function cc() {

        counter1++;

        if (counter1 === length1) {

            console.log('All images loaded!');
            init();

        }

    }

}

game.loadImage('client/game/assets/tileset1.png', 'tileset');
game.loadImage('client/game/assets/cursor.png', 'cursor');
game.loadImage('client/game/assets/pieces.png', 'pieces');
game.loadImage('client/game/assets/marker.png', 'marker');

game.load(game.cache, init);

function init() {

    let data = '';

    for (let i = 0; i < 16 * 16; i++) {

        let x = i % 16;
        let y = Math.floor(i / 16);

        if (x == 7 && y == 7) {

            data += 8;

        } else {

            data += 9;

        }

    }

    let map = new Map(data);

    for (let x = 0; x < 16; x++) {

        for (let y = 0; y < 16; y++) {

            new TileSet(game.bg, 'tileset', x, y, map.tiles[x][y]).draw();

        }

    }

    game.cursor = new Cursor(game.fg, -1, -1);

    game.selected.down = function () {

        if (game.mouse.left) {

            if (!(game.cursor.x == 7 && game.cursor.y == 7)) {

                //console.log('Added tile at: ' + game.cursor.x + ' | ' + game.cursor.y);

                map.tiles[game.cursor.x][game.cursor.y] = '0';

            }

        } else if (game.mouse.right) {

            if (!(game.cursor.x == 7 && game.cursor.y == 7)) {

                //console.log('Deleted tile at: ' + game.cursor.x + ' | ' + game.cursor.y);

                map.tiles[game.cursor.x][game.cursor.y] = '9';

            }

        }

        game.bg.redraw(game.cursor.x, game.cursor.y, map);

    }

    game.map = map;

}

function draw() {

    if (game.keys[83]) {

        console.log(game.map.export());

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
requestAnimationFrame(draw);