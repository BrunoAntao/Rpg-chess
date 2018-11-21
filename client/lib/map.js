class Map {

    constructor(string = '') {

        this.string = '';
        this.tiles = [];

        for (let i = 0; i < 16; i++) {

            this.tiles[i] = [];

        }

        if (string != '') {

            for (let i = 0; i < 16 * 16; i++) {

                this.tiles[Math.floor(i % 16)][Math.floor(i / 16)] = string[i];

            }

        }

    }

    export() {

        let string = '';

        for (let y = 0; y < 16; y++) {

            for (let x = 0; x < 16; x++) {

                string += this.tiles[x][y];

                if (this.tiles[x][y] == '8') {

                    string = x.toString() + ' ' + y.toString() + ' ' + string;

                }

            }

        }

        return string;

    }

    load(string) {

        this.string = '';
        this.tiles = [];

        for (let i = 0; i < 16; i++) {

            this.tiles[i] = [];

        }

        if (string != '') {

            for (let i = 0; i < 16 * 16; i++) {

                this.tiles[Math.floor(i % 16)][Math.floor(i / 16)] = string[i];

            }

        }

    }

}