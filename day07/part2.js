const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const crabs = input.split(',').map(Number);

const min = crabs.reduce((min, n) => Math.min(min, n));
const max = crabs.reduce((max, n) => Math.max(max, n));

const positionToFuel = {};
for (let position = min; position <= max; position++) {
    const fuel = crabs.reduce((fuel, crab) => {
        const distance = Math.abs(position - crab);
        const crabFuel = distance * (distance + 1) / 2;
        return fuel + crabFuel;
    }, 0);
    positionToFuel[position] = fuel;
}

const answer = Object.values(positionToFuel).reduce((best, fuel) => Math.min(best, fuel));
console.log(`Answer: ${answer}`);