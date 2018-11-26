class TBLogic {

    constructor() {

        this.counter = 0;

        this.turns = new TurnContainer();

        this.init();

    }

    load() {



    }

    init() {

        this.turns.push(new Turn(this));
        this.turns.push(new Turn(this));
        this.turns.push(new Turn(this));
        this.turns.push(new Turn(this));

    }

    update() {

        console.log(this.turns.next());

    }

}

class Turn {

    constructor(parent) {

        this.id = parent.counter++;
        this.parent = parent;

    }

}

class TurnContainer extends Array{

    constructor() {

        super()

        

    }

    next() {

        return this.shift();

    }

}

