const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

let fishList = input.split(',').map(Number);

for (let i = 0; i < 80; i++) {
    fishList = fishList.reduce((fishList, fish) => {
        if (fish === 0) {
            fishList.push(6, 8);
        } else {
            fishList.push(fish - 1);
        }

        return fishList;
    }, []);
}

const answer = fishList.length;
console.log(`Answer: ${answer}`);