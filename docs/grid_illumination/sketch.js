const G = {
    SQUARE_SIZE_X: 0.04,
    SQUARE_SIZE_Y: 0.04,
    SQUARE_GAP: 0.01
};
/** @type { {s: number, l: number} } */
let size;
/** @type { import("p5").Vector } */
let mid;

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

    const column = (windowWidth - (windowWidth * G.SQUARE_GAP * 2))/
        (windowWidth * (G.SQUARE_GAP + G.SQUARE_SIZE_X));
    const row = (windowHeight - (windowHeight * G.SQUARE_GAP * 2))/
        (windowHeight * (G.SQUARE_GAP + G.SQUARE_SIZE_Y));

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
        }
    }

    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background('#ddd');
    
    rectMode(CENTER);
    squares.forEach( s => {

        const dist = s.pos.dist(createVector(mouseX, mouseY));
        let sizeRate = (dist < size.l * 0.2)
            ? (0.1 + 0.9 * (dist / (size.l * 0.2)))
            : 1;

        fill(44);
        rect(s.pos.x, s.pos.y, s.size.x * sizeRate, s.size.y * sizeRate);
        fill(255);
    });
}