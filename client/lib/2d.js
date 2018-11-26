class TileSet {

    constructor(scene, key, x = 0, y = 0, frame = 0) {

        this.scene = scene;
        this.scene.objects.push(this);

        this.key = key;

        this.x = x;
        this.y = y;
        this.z = 0;

        this.scale = { x: 4, y: 4 };

        this.frame = frame;

        this.image = this.scene.game.cache[this.key];

    }

    draw() {

        this.scene.ctx.drawImage(this.image, Math.floor(this.frame * 8 % this.image.width), Math.floor((this.frame * 8) / this.image.width) * 8, 8, 8, this.x * 8 * 4, this.y * 8 * 4, this.scale.x * 8, this.scale.y * 8);

    }

}

class Cursor {

    constructor(scene, x = 0, y = 0) {

        this.scene = scene;
        this.scene.objects.push(this);

        this.x = x;
        this.y = y;
        this.z = 2;

        this.frame = 1;

        this.scale = { x: 4, y: 4 };

        this.image = this.scene.game.cache['cursor'];

    }

    draw() {

        this.x = Math.floor(game.mouse.x / 32);

        if (this.x > 15) {

            this.x = 15;

        } else if (this.x < 0) {

            this.x = 0;

        }

        this.y = Math.floor(game.mouse.y / 32);

        if (this.y > 15) {

            this.y = 15;

        } else if (this.y < 0) {

            this.y = 0;

        }
        this.scene.ctx.drawImage(this.image, Math.floor(this.frame * 8 % this.image.width), Math.floor((this.frame * 8) / this.image.width) * 8, 8, 8, this.x * 8 * 4, this.y * 8 * 4, this.scale.x * 8, this.scale.y * 8);

    }

}

class Piece {

    constructor(scene, x = 0, y = 0) {

        this.scene = scene;
        this.scene.objects.push(this);
        this.scene.game.matrix[x][y] = this;
        this.scene.game.pieces.push(this);
        this.uid = this.scene.game.uid++;

        this.x = x;
        this.y = y;
        this.z = 0;

        this.frame = 0;

        this.showingMoves = false;
        this.showingAttacks = false;

        this.markers = [];

        this.scale = { x: 4, y: 4 };

        this.image = this.scene.game.cache['pieces'];

    }

    pressed() {

        if (this.sheet.res.energy.move > 0) {

            this.showMoves();

        } else if (this.sheet.res.energy.attack > 0) {

            console.log('Showing attacks');

        }

    }

    showMoves() {

        if (!this.showingMoves) {

            this.moves.forEach(function (tile) {

                if (!this.scene.game.matrix[this.x + tile.x][this.y - tile.y]) {

                    this.markers.push(new Marker(this.scene, this.x + tile.x, this.y - tile.y, this));

                } else {

                    this.markers.push(new Marker(this.scene, this.x + tile.x, this.y - tile.y, this, 1));

                }

            }, this);

            this.showingMoves = !this.showingMoves;

        } else {

            this.markers.forEach(function (marker) {

                marker.destroy();

            })

            this.markers = [];

            this.showingMoves = !this.showingMoves;

        }

    }

    move(x, y) {

        if (this.sheet.res.energy.move > 0) {

            this.scene.game.matrix[this.x][this.y] = null;

            this.x = x;
            this.y = y;

            this.scene.game.matrix[this.x][this.y] = this;

            this.sheet.res.energy.move--;

        }

    }

    draw() {

        this.scene.ctx.drawImage(this.image, Math.floor(this.frame * 8 % this.image.width), Math.floor((this.frame * 8) / this.image.width) * 8, 8, 8, this.x * 8 * 4, this.y * 8 * 4, this.scale.x * 8, this.scale.y * 8);

    }

}

class Warrior extends Piece {

    constructor(scene, x = 0, y = 0) {

        super(scene, x, y)

        this.sheet = scene.game.test;

        this.frame = 0;

        this.moves = this.scene.game.movesets['warrior'];

    }

}

class Ranger extends Piece {

    constructor(scene, x = 0, y = 0) {

        super(scene, x, y)

        this.frame = 1;

    }

}

class Mage extends Piece {

    constructor(scene, x = 0, y = 0) {

        super(scene, x, y)

        this.frame = 2;

        this.moves = this.scene.game.movesets['mage'];

    }

    pressed() {

        this.showMoves();

    }

}

class Arcanist extends Piece {

    constructor(scene, x = 0, y = 0) {

        super(scene, x, y)

        this.frame = 3;

    }

}

class Marker {

    constructor(scene, x = 0, y = 0, parent, frame = 0) {

        this.scene = scene;
        this.scene.objects.push(this);
        this.scene.game.pieces.push(this);

        this.x = x;
        this.y = y;
        this.z = 1;

        this.parent = parent;

        this.frame = frame;

        this.scale = { x: 4, y: 4 };

        this.image = this.scene.game.cache['marker'];

    }

    pressed() {

        switch (this.frame) {

            case 0:

                if (this.parent.showingMoves) {

                    this.parent.showMoves();
                    this.parent.move(this.x, this.y);

                }
                break;

            case 1:

                //console.log(this.parent.uid + ' attacked: ' + this.scene.game.matrix[this.x][this.y].uid);
                break;
        }

    }

    destroy() {

        this.scene.objects.splice(this.scene.objects.indexOf(this), 1);
        this.scene.game.pieces.splice(this.scene.game.pieces.indexOf(this), 1);

    }

    draw() {

        this.scene.ctx.drawImage(this.image, Math.floor(this.frame * 8 % this.image.width), Math.floor((this.frame * 8) / this.image.width) * 8, 8, 8, this.x * 8 * 4, this.y * 8 * 4, this.scale.x * 8, this.scale.y * 8);

    }

}