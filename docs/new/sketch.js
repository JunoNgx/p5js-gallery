const G = {
    SQUARE_SIZE_X: 0.05,
    SQUARE_SIZE_Y: 0.05,
    SQUARE_GAP: 0.02
};
/** @type { {s: number, l: number} } */
let size;
/** @type { import("p5").Vector } */
let mid;
/** @type { number } */
let time;

/**
 * @typedef {{
 * pos: import("p5").Vector
 * size: {x: number, y: number}
 * }} Square
 */
/** @type { Square [] }} */
let squares;

function setup() {
    size = {
        l: (windowWidth >= windowHeight) ? windowWidth : windowHeight,
        s: (windowWidth <= windowHeight) ? windowWidth : windowHeight
    };
    mid = createVector(windowWidth * 0.5, windowHeight * 0.5);
    time = 0;

    const column = (windowWidth - (windowWidth * G.SQUARE_GAP * 2))/
        (windowWidth * (G.SQUARE_GAP + G.SQUARE_SIZE_X));
    const row = (windowHeight - (windowHeight * G.SQUARE_GAP * 2))/
        (windowHeight * (G.SQUARE_GAP + G.SQUARE_SIZE_Y));

    // console.log((windowHeight - (windowHeight * G.SQUARE_GAP * 2)));

    squares = [];
    for (let i = 0; i < column; i++) {
        for (let j = 0; j < row; j++) {
            squares.push({
                pos: createVector(
                    windowWidth * (G.SQUARE_GAP + G.SQUARE_SIZE_X/2 + i * (G.SQUARE_SIZE_X + G.SQUARE_GAP)),
                    windowHeight * (G.SQUARE_GAP + G.SQUARE_SIZE_Y/2 + j * (G.SQUARE_SIZE_Y + G.SQUARE_GAP)),
                ),
                size: {
                    x: windowWidth * G.SQUARE_SIZE_X,
                    y: windowHeight * G.SQUARE_SIZE_Y,
                }
            })
            // squares.push({
            //     pos: createVector(
            //         windowWidth * G.SQUARE_GAP + i * windowWidth * (G.SQUARE_SIZE/2 + G.SQUARE_GAP),
            //         windowHeight * G.SQUARE_GAP + j * windowHeight * (G.SQUARE_SIZE/2 + G.SQUARE_GAP)
            //     ),
            //     size: size.l * G.SQUARE_SIZE
            // })
        }
    }

    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background('#ddd');
    
    time++;

    // for (let i = 0; i<100; i++) {
    //     line(
    //         i * (size.l * G.SQUARE_SIZE/2), -100,
    //         i * (size.l * G.SQUARE_SIZE/2), 1000,
    //     )
    // }

    rectMode(CENTER);
    squares.forEach( s => {
        fill(44);
        // rect(s.pos.x, s.pos.y, size.l * (G.SQUARE_SIZE + G.SQUARE_GAP), size.l * (G.SQUARE_SIZE + G.SQUARE_GAP));
        rect(s.pos.x, s.pos.y, s.size.x, s.size.y);
        circle(s.pos.x, s.pos.y, 12);
    });
}