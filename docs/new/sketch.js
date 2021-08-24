const G = {
    BORDER_WIDTH: 0.01,
    // CORNER_RADIUS: 0.05,
    MAX_CHILDREN: 2
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
    console.log(rects);
}

function draw() {
    background(47);

    rects.forEach( r => {

        stroke(47);
        strokeWeight(size.l * G.BORDER_WIDTH);
        fill(r.col);
        rect(
            r.pos.x * windowWidth,
            r.pos.y * windowHeight,
            r.size.x * windowWidth,
            r.size.y * windowHeight
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
        // const childrenAmt = 1+ Math.floor(random() * G.MAX_CHILDREN);
        const isInheritingX = random() < 0.5;
        // let remainingPortion = 1;
        // let remainingAmtOfChildren = childrenAmt;

        // for (let i = 0; i < childrenAmt; i++) {
            let cPos = { x: _x, y: _y};
            let cSize = { x: 0, y: 0};

            if (isInheritingX) { //inherits sizeX
                cSize.x = _sizeX;
                cSize.y = random(_sizeY * 0.4, _sizeY * 0.75);
                // remainingPortion -= cSize.y;
                // cPos.y += cSize.y + G.BORDER_WIDTH;
            } else {
                cSize.x = random(_sizeX * 0.4, _sizeX * 0.75);
                cSize.y = _sizeY; // Using parent's
                // remainingPortion -= cSize.x;
                // cPos.x += cSize.x + G.BORDER_WIDTH;
            }

            if (cSize.x <= G.BORDER_WIDTH * 4
                || cSize.y <= G.BORDER_WIDTH * 4) {
                console.log("Cancelled out of small amount");
                return;
            }
            createRect(
                cPos.x,
                cPos.y,
                cSize.x,
                cSize.y,
                _childRate * 0.95
            );

            // remainingAmtOfChildren--;
        // }
    }

    // if (random() < _childRate) {
    //     const childrenAmt = 1+ Math.floor(random() * G.MAX_CHILDREN);
    //     const isInheritingX = random() < 0.5;
    //     let remainingPortion = 1;
    //     let remainingAmtOfChildren = childrenAmt;

    //     for (let i = 0; i < childrenAmt; i++) {
    //         let cPos = { x: _x, y: _y};
    //         let cSize = { x: 0, y: 0};

    //         if (isInheritingX) { //inherits sizeX
    //             cSize.x = _sizeX;
    //             cSize.y = random(_sizeY * 0.2, _sizeY * (remainingPortion - (0.2 + G.BORDER_WIDTH) * remainingAmtOfChildren));
    //             remainingPortion -= cSize.y;
    //             cPos.y += cSize.y + G.BORDER_WIDTH;
    //         } else {
    //             cSize.x = random(_sizeX * 0.2, _sizeX * (remainingPortion - (0.2 + G.BORDER_WIDTH) * remainingAmtOfChildren));
    //             cSize.y = _sizeY; // Using parent's
    //             remainingPortion -= cSize.x;
    //             cPos.x += cSize.x + G.BORDER_WIDTH;
    //         }

    //         if (cSize.x <= G.BORDER_WIDTH * 5
    //             || cSize.y <= G.BORDER_WIDTH * 5) {
    //             console.log("Cancelled out of small amount");
    //             return;
    //         }
    //         createRect(
    //             cPos.x,
    //             cPos.y,
    //             cSize.x,
    //             cSize.y,
    //             _childRate * 0.9
    //         );

    //         remainingAmtOfChildren--;
    //     }
    // }
}