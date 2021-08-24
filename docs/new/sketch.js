const G = {
    BORDER_WIDTH: 0.05,
    // CORNER_RADIUS: 0.05,
};
/** @type { {s: number, l: number} } */
let size;
/** @type { import("p5").Vector } */
let mid;

/**
 * @typedef {{
 * pos: {x: number, y: number},
 * size: {x: number, y: number},
 * col: import("p5").Color;
 * }} Rect
 */
/** @type { Rect [] } */
let rects;

/** @type { import("p5").Color [] } */
let colorList;

function setup() {
    size = {
        l: (windowWidth >= windowHeight) ? windowWidth : windowHeight,
        s: (windowWidth <= windowHeight) ? windowWidth : windowHeight
    };
    colorList = [
        color('#ed5896'),
        color('#34cfbf'),
        color('#ffec70'),
    ];
    createCanvas(windowWidth, windowHeight);

    rects = [];
    createRect(0, 0, 1, 1, 0);
    noLoop();
}

function draw() {
    background(47);

    rects.forEach( r => {

        stroke(47);
        strokeWeight(size.l * G.BORDER_WIDTH);
        fill(r.col);
        rect(r.pos.x, r.pos.y, r.size.x * windowWidth, r.size.y * windowHeight,
            size.l * G.BORDER_WIDTH);
    });
}


function createRect(_x, _y, _sizeX, _sizeY, _childRate) {
    rects.push({
        pos: {
            x: _x,
            y: _y
        },
        size: {
            x: _sizeX,
            y: _sizeY
        },
        // col: color('#ff7700'),
        col: random(colorList),
    });
}