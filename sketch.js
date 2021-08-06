let C = {width: null, height: null, mid: null};

/** @typedef {{pos: Vector, base: number, height: number, angle: number}} Parallelogram */
/** @type { Parallelogram [] } */
let shapes;

const G = {
    SPEED: 5,
}

function setup() {
    C.width = windowWidth;
    C.height = windowWidth/2;
    C.mid = createVector(C.width*0.5, C.height*0.5);

    shapes = [];
    for (let i = 0; i < 10; i++) {
        shapes.push({
            pos: createVector(C.mid.x, C.mid.y),
            base: 200,
            height: 100,
            angle: PI/1.5
        });
    }

    createCanvas(C.width, C.height);
}

function draw() {
    // background(102, 205, 170);
    // background(238, 238, 238);
    background(0);

    color(170);
    // rect(C.width*0.1, C.height*0.1, C.width*0.8, C.height*0.8);
    shapes.forEach((s) => {

        s.pos.x += G.SPEED*cos(s.angle);
        s.pos.y += G.SPEED*sin(s.angle);

        // let tl = createVector(s.pos.x - s.base/2, s.pos.y - s.height/2);
        // let tr = createVector(s.pos.x + s.base/2, s.pos.y - s.height/2);
        // let bl = createVector(s.pos.x - s.base/2, s.pos.y + s.height/2);
        // let br = createVector(s.pos.x + s.base/2, s.pos.y + s.height/2);
        const tl = createVector(s.pos.x, s.pos.y);
        const tr = createVector(s.pos.x + s.base, s.pos.y);
        const bl = createVector(s.pos.x - s.height*tan(s.angle-HALF_PI), s.pos.y + s.height);
        const br = createVector(bl.x + s.base, s.pos.y + s.height);
        color(255, 0, 0);
        quad(tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y);

        if (s.pos.y > C.height) {

        }
    });


    textAlign(CENTER);
    textSize(width*0.1);
    text("Juno Nguyen", C.mid.x, C.mid.y);
}
