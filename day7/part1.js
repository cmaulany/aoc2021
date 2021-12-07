const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const crabs = input.split(',').map(Number);

const min = crabs.reduce((min, n) => Math.min(min, n));
const max = crabs.reduce((max, n) => Math.max(max, n));

const positionToFuel = {};
for (let i = min; i <= max; i++) {
    const fuel = crabs.reduce((fuel, crab) => fuel + Math.abs(i - crab), 0);
    positionToFuel[i] = fuel;
}

const answer = Object.values(positionToFuel).reduce((best, fuel) => Math.min(best, fuel));
console.log(`Answer: ${answer}`);