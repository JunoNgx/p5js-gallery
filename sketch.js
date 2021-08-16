let C = {width: null, height: null, mid: null};

/** @typedef {{pos: Vector, base: number, height: number, angle: number, speed: number}} Parallelogram */
/** @type { Parallelogram [] } */
let shapes;

/** @typedef {{cooldown: number, pos: Vector, interval: number, base: number, height: number, speed: number, color: Color}} Spawner */
/** @type { Spawner [] } */
let spawners;

function setup() {
    C.width = windowWidth;
    C.height = windowWidth/2;
    C.mid = createVector(C.width*0.5, C.height*0.5);

    shapes = [];

    spawners = [
        {
            pos: createVector(C.width * 0.3, C.height * -0.5),
            cooldown: 0,
            interval: 150,
            base: C.width * 0.14,
            height: C.height * 0.35,
            speed: C.height * 0.003,
            isDown: true,
            // color: color(32, 178, 170)
            // color: color(143, 188, 139)
            color: color(203, 235, 185)
        },
        {
            pos: createVector(C.width * -0.032, C.height * 1.2),
            cooldown: 0,
            interval: 120,
            base: C.width * 0.29,
            height: C.height * 0.47,
            speed: C.height * 0.005,
            isDown: false,
            // color: color(255, 20, 147)
            color: color(255, 192, 203)
        },
        {
            pos: createVector(C.width * 0.86, C.height * -0.8),
            cooldown: 0,
            interval: 420,
            base: C.width * 0.18,
            height: C.height * 0.64,
            speed: C.height * 0.002,
            isDown: true,
            color: color(255, 250, 205)
        },
        {
            pos: createVector(C.width * 0.4, C.height * 1.5),
            cooldown: 0,
            interval: 60,
            base: C.width * 0.27,
            height: C.height * 0.17,
            speed: C.height * 0.004,
            isDown: false,
            // color: color(0, 191, 255)
            color: color(166, 229, 245)
        },
    ];

    createCanvas(C.width, C.height);
}

function draw() {
    background(238);

    spawners.forEach(s => {
        s.cooldown--;
        if (s.cooldown <= 0) {
            shapes.push(paral(
                createVector(s.pos.x, s.pos.y),
                s.base,
                s.height,
                s.speed,
                s.isDown,
                s.color
            ));
            s.cooldown = s.interval;
        }
    });

    shapes.forEach((s) => {
        s.pos.y += s.speed*sin(s.angle);
        s.pos.x += s.speed*cos(s.angle);

        const tl = createVector(s.pos.x, s.pos.y);
        const tr = createVector(s.pos.x + s.base, s.pos.y);
        const bl = createVector(s.pos.x - s.height*tan(s.angle-HALF_PI), s.pos.y + s.height);
        const br = createVector(bl.x + s.base, s.pos.y + s.height);

        fill(s.color);
        noStroke();
        quad(tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y);
    });
    
    shapes = shapes.filter(s =>
        C.height * -1.0 < s.pos.y
        && s.pos.y < C.height * 2.0
    );

    fill(238, 238, 238);
    textAlign(CENTER);
    textSize(width*0.15);
    text("Juno Nguyen", C.mid.x, C.mid.y);
}

function paral(_pos, _base, _height, _speed, _isDown, _color) {
    return {
        pos: _pos,
        base: _base,
        height: _height,
        speed: _speed,
        angle: _isDown ? PI/1.5 : PI/1.5 + PI,
        color: _color
    };
}