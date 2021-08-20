const G = {

};
/** @type {number} */
let size;

function setup() {
    size = (windowWidth > windowHeight) ? windowWidth : windowHeight;

}

function draw() {

}

/**
 * @param {number} x 
 * @returns {number}
 */
function easeFunc(x) {

    // easeOutExpo
    return x === 1 ? 1 : 1 - pow(2, -10 * x);

    // easeOutQuad
    // return 1 - pow(1 - x, 4);

    // easeOutCubic
    // return 1 - pow(1 - x, 3);
}