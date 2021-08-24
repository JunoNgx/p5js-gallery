const G = {
    BORDER_WIDTH: 0.01,
    // CORNER_RADIUS: 0.05,
    MAX_CHILDREN: 3
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
    createRect(0, 0, 1, 1, 1);
    noLoop();
}

function draw() {
    background(47);

    rects.forEach( r => {

        stroke(47);
        strokeWeight(size.l * G.BORDER_WIDTH);
        fill(r.col);
        rect(r.pos.x, r.pos.y, r.size.x * windowWidth, r.size.y * windowHeight,
            // size.l * G.BORDER_WIDTH);
        );
    });
}

/**
 * 
 * @param {number} _x 
 * @param {number} _y 
 * @param {number} _sizeX 
 * @param {number} _sizeY 
 * @param {number} _childRate 
 */
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
        col: random(colorList),
    });

    // let sizeDivider = 1;

    // if (random() < _childRate) {
    //     const childrenAmt = Math.floor(random() * G.MAX_CHILDREN - 1) + 1;
    //     for (let i = 0; i < childrenAmt; i++) {
    //         const size = random() * sizeDivider;
    //     }
    // }

    if (random() < _childRate) {
        let cSize = { x: 0, y: 0};

        const isInheritingX = random() < 0.5;

        if (isInheritingX) { //inherits sizeX
            cSize.x = _sizeX;
            cSize.y = random(_sizeY * 0.3, _sizeY * 0.8);
        } else {
            cSize.x = random(_sizeX * 0.3, _sizeX * 0.8);
            cSize.y = _sizeY; // Using parent's
        }

        // if (_sizeX > _sizeX) {
        //     cSize.x = random(_sizeX * 0.1, _sizeX * 0.8);
        //     cSize.y = _sizeY; // Using parent's
        // } else {
        //     cSize.x = _sizeX;
        //     cSize.y = random(_sizeY * 0.1, _sizeY * 0.8);
        // }

        createRect(
            // (isInheritingX) ? _x : _x + size.l * G.BORDER_WIDTH,
            // _y + size.l * G.BORDER_WIDTH,
            _x,
            _y,
            cSize.x,
            cSize.y,
            _childRate * 0.9
        );
    }
}