const fs = require('fs');
const path_ = require('path');

const input = fs.readFileSync(path_.resolve(__dirname, 'input.txt'), 'utf8');

const [
    minX,
    maxX,
    minY,
    maxY
] = input.match(/x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/).slice(1, 5).map(Number);
const target = { minX, maxX, minY, maxY };

function willHitTarget(position, velocity, target) {
    const { minX, maxX, minY, maxY } = target;

    let { x, y } = position;
    let { x: xVelocity, y: yVelocity } = velocity;
    do {
        x += xVelocity;
        y += yVelocity;

        xVelocity -= Math.sign(xVelocity);
        yVelocity -= 1;

        if (
            x >= minX &&
            x <= maxX &&
            y >= minY &&
            y <= maxY
        ) {
            return true;
        }
    } while (x <= maxX && y >= minY)

    return false;
};

const startPosition = { x: 0, y: 0 };

const hits = [];
for (let x = 0; x < 500; x++) {
    for (let y = -500; y < 500; y++) {
        const velocity = { x, y };
        if (willHitTarget(startPosition, velocity, target)) {
            hits.push(velocity)
        }
    }
}
const highestHit = hits.reduce((highest, hit) => hit.y > highest.y ? hit : highest);

const answerPart1 = highestHit.y * (highestHit.y + 1) * 0.5;
const answerPart2 = hits.length;
console.log(`Answer Part 1: ${answerPart1}`);
console.log(`Answer Part 2: ${answerPart2}`);