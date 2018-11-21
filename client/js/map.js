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

}