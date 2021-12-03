const fs = require('fs');
const path = require('path');

// const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const input = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

const data = input.split('\n').map(n => Number(n));

const measurements = data.map((n, index) => {
    if (index === 0) {
        return null;
    }
    const previousN = data[index - 1];
    return previousN < n ? 'increased' : 'decreased';
});

const answer = measurements.filter(measurement => measurement === "increased").length;

console.log(`Answer: ${answer}`);