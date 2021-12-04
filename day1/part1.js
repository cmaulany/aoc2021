const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
const data = input.split('\n').map(Number);

const measurements = data.map((n, index) => {
    if (index === 0) {
        return null;
    }
    const previousN = data[index - 1];
    return previousN < n ? 'increased' : 'decreased';
});

const answer = measurements.filter(measurement => measurement === "increased").length;

console.log(`Answer: ${answer}`);