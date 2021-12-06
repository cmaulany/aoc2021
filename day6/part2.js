const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const initialFishList = input.split(',').map(Number);

const addFish = (fishByAge, age, n = 1) => {
    fishByAge[age] = (fishByAge[age] ?? 0) + n
    return fishByAge;
}

const sumFish = (fishByAge) => Object.values(fishByAge).reduce((sum, n) => sum + n, 0);

const tick = (fishByAge) => Object.entries(fishByAge).reduce(
    (fishByAge, entry) => {
        const age = Number(entry[0]);
        const count = entry[1];

        if (age === 0) {
            addFish(fishByAge, 6, count);
            addFish(fishByAge, 8, count);
        } else {
            addFish(fishByAge, age - 1, count);
        }

        return fishByAge;
    },
    {}
);

let fishByAge = initialFishList.reduce((fishByAge, age) => addFish(fishByAge, age), {});
for (let i = 0; i < 256; i++) {
    fishByAge = tick(fishByAge);
}

const answer = sumFish(fishByAge);
console.log(`Answer: ${answer}`);