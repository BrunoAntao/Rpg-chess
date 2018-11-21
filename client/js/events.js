window.addEventListener('contextmenu', function (e) {

    e.preventDefault();

});

function mouseCheck() {

    for (let i = 0; i < game.pieces.length; i++) {

        let obj = game.pieces[i];

        if (game.selected) {

            if (game.selected.out) game.selected.out();
            game.selected = null;

        }

        if (game.mouse.x > obj.x * 32 && game.mouse.x < obj.x * 32 + 32 &&
            game.mouse.y > obj.y * 32 && game.mouse.y < obj.y * 32 + 32) {

            if (obj.over) obj.over();
            game.selected = obj;
            break;

        }

    }

    if (game.selected && game.selected.down && (game.mouse.left || game.mouse.right)) {

        game.selected.down();

    }

}

window.addEventListener('mousemove', function (e) {

    game.mouse.x = e.clientX - canvas.offsetLeft;
    game.mouse.y = e.clientY - canvas.offsetTop;

})

window.addEventListener('mousedown', function (e) {

    switch (e.button) {

        case 0: game.mouse.left = true; break;
        case 1: game.mouse.middle = true; break;
        case 2: game.mouse.right = true; break;

    }

})

window.addEventListener('mouseup', function (e) {

    switch (e.button) {

        case 0: game.mouse.left = false; break;
        case 1: game.mouse.middle = false; break;
        case 2: game.mouse.right = false; break;

    }

})

window.addEventListener('click', function (e) {

    if (game.selected && game.selected.pressed) {

        game.selected.pressed();

    }

})

window.addEventListener('keydown', function (e) {

    game.keys[e.which] = true;

})

window.addEventListener('keyup', function (e) {

    game.keys[e.which] = false;

})

function keyCheck() {

    if (game.keys[87]) {

        game.camera.y += 1;

    }

    if (game.keys[83]) {

        game.camera.y -= 1;

    }

    if (game.keys[65]) {

        game.camera.x += 1;

    }

    if (game.keys[68]) {

        game.camera.x -= 1;
    }

}