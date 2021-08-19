/** @type { number } */
let size;
/** @type { import("p5").Vector } */
let mid;
/** @type { number } */
let coreOrbitalPos;

/**
 * @typedef {{
 * pos: import("p5").Vector,
 * speed: number,
 * orbitalPos: number,
 * movementRadius: number,
 * radius: number
 * }} Planet
 * */
/** @type { Planet [] } */
let planets;

const C = {
    PLANET_DISTANCE: 0.05,
    CORE_SPEED: 0.07,
    CORE_RADIUS: 0.05
}

function setup() {
    size = max(windowWidth, windowHeight);
    mid = createVector(windowWidth * 0.5, windowHeight * 0.5);
    coreOrbitalPos = 0;

    planets = [];
    for (let i = 1; i < 7; i++) {
        planets.push({
            pos: createVector(windowWidth * 0.5,
                windowHeight * 0.5 - i*size*C.PLANET_DISTANCE),
            speed: random(-PI/70,PI/70),
            orbitalPos: 0,
            movementRadius: i*size*C.PLANET_DISTANCE,
            radius: random(0.01, 0.025)
        });
    }
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    coreOrbitalPos += C.CORE_SPEED;


    background(227);

    stroke(47);
    noFill();

    strokeWeight(5);
    circle(mid.x, mid.y, size*0.15);
    
    strokeWeight(3);
    arc(mid.x, mid.y, size*C.CORE_RADIUS, size*C.CORE_RADIUS,
        coreOrbitalPos, coreOrbitalPos+PI*0.8);
    arc(mid.x, mid.y, size*C.CORE_RADIUS, size*C.CORE_RADIUS,
        coreOrbitalPos+PI, coreOrbitalPos+PI*0.8+PI);

    planets.forEach((p) => {

        p.orbitalPos += p.speed;

        strokeWeight(2);
        stroke(47);
        noFill();

        const posX = mid.x + p.movementRadius*cos(p.orbitalPos); 
        const posY = mid.y + p.movementRadius*sin(p.orbitalPos);
        
        circle(posX, posY, size*p.radius);
    });
}
