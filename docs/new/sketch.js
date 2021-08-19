const G = {
    SPAWN_COOLDOWN_MIN: 5,
    SPAWN_COOLDOWN_MAX: 15,
    EXPLOSION_LIFETIME_MIN: 20,
    EXPLOSION_LIFETIME_MAX: 90,
    EXPLOSION_SIZE_INIT: 0.05,
    EXPLOSION_SIZE_FINAL_MIN: 0.1,
    EXPLOSION_SIZE_FINAL_MAX: 0.3,
    EXPLOSION_WEIGHT_INIT: 0.2,
    EXPLOSION_WEIGHT_FINAL: 0,
    SPLASH_DIST_INIT: 0.0001,
    SPLASH_DIST_FINAL: 0.2,
    SPLASH_LENGTH_INIT: 0.1,
    SPLASH_LENGTH_FINAL: 0.0,
};
/** @type {number} */
let size;

/**
 * @typedef {{
 * pos: import("p5").Vector,
 * size_init: number,
 * size_final: number,
 * lifetime: number,
 * lifetime_init: number
 * }} Explosion
 */

/** @type { Explosion [] } */
let explosions;

/** @type { number } */
let spawnCooldown;

function setup() {
    size = (windowWidth > windowHeight) ? windowWidth : windowHeight;
    
    explosions = [];

    spawnCooldown = random(G.SPAWN_COOLDOWN_MIN, G.SPAWN_COOLDOWN_MAX);

    createCanvas(windowWidth, windowHeight);
}

function draw() {

    background(227);

    spawnCooldown--;
    if (spawnCooldown <= 0) {

        const lifetime = random(G.EXPLOSION_LIFETIME_MIN, G.EXPLOSION_LIFETIME_MAX);

        explosions.push({
            pos: createVector(random(windowWidth), random(windowHeight)),
            size_init: size * 0.001,
            size_final: size * random(G.EXPLOSION_SIZE_FINAL_MIN, G.EXPLOSION_SIZE_FINAL_MAX),
            lifetime: lifetime,
            lifetime_init: lifetime
        });
        spawnCooldown = random(G.SPAWN_COOLDOWN_MIN, G.SPAWN_COOLDOWN_MAX);
    }

    
    stroke('#CD5C5C');
    noFill();
    explosions.forEach(e => {
        e.lifetime--;
        const progress = (e.lifetime_init - e.lifetime)/e.lifetime_init;
        const eSize = e.size_init + (e.size_final - e.size_init) * easeOutCubic(progress);
        const weight = G.EXPLOSION_WEIGHT_INIT +
            (G.EXPLOSION_WEIGHT_FINAL - G.EXPLOSION_WEIGHT_INIT) * easeOutCubic(progress);

        strokeWeight(size * weight * 0.5);
        arc(e.pos.x, e.pos.y, eSize, eSize, 0, TWO_PI);

        for (let i = 0; i < 8; i++) {

            strokeWeight(size * 0.004);

            const angle = i * PI/4;
            const dist = (G.SPLASH_DIST_INIT +
                (G.SPLASH_DIST_FINAL - G.SPLASH_DIST_INIT)
                * easeOutCubic(progress)) * size;
            const length = (G.SPLASH_LENGTH_INIT +
                (G.SPLASH_LENGTH_FINAL - G.SPLASH_LENGTH_INIT)
                * easeOutCubic(progress)) * size;

            const x1 = e.pos.x + dist*cos(angle);
            const y1 = e.pos.y + dist*sin(angle);

            const x2 = x1 + length*cos(angle);
            const y2 = y1 + length*sin(angle);

            line(x1, y1, x2, y2);
        }
    });

    explosions = explosions.filter(e => e.lifetime > 3);

    console.log(explosions.length);
    

}

/**
 * @param {number} x 
 * @returns {number}
 */
function easeOutCubic(x) {
    return 1 - pow(1 - x, 3);    
}