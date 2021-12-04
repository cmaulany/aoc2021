const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
const data = input.split('\n').map(Number);

const windows = [];
for (let i = 0; i < data.length - 2; i++) {
    const window = data[i] + data[i + 1] + data[i + 2];
    windows.push(window);
}

const measurements = windows.map((n, index) => {
    if (index === 0) {
        return null;
    }
    const previousN = windows[index - 1];
    return previousN < n ? 'increased' : 'decreased';
});

const answer = measurements.filter(measurement => measurement === "increased").length;

console.log(`Answer: ${answer}`);