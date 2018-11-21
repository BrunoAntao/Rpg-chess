let canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
let ctx = canvas.getContext("2d");

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();

// create two boxes and a ground
var box1 = Bodies.rectangle(64, 64, 64, 64);
var box2 = Bodies.rectangle(64, 64 * 5, 500, 64, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [box1, box2]);

// run the engine
Engine.run(engine);

let game = {

    canvas: canvas,
    ctx: ctx,

    selected: null,

    mouse: {

        x: 0,
        y: 0,
        left: false,
        middle: false,
        right: false,

    },

    keys: [],

    camera: {

        x: 0,
        y: 0

    },

    objects: [],

}

let sq = new Square(game, 64, 64, 64, 64);
let ground = new Square(game, 64, 64 * 5, 500, 64);

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sq.x = box1.position.x;
    sq.y = box1.position.y;

    ground.x = box2.position.x;
    ground.y = box2.position.y;

    game.objects.forEach(function (object) {

        object.draw();

    })

    requestAnimationFrame(draw);

}
requestAnimationFrame(draw);