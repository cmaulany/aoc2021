const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const pairs = input.split('\n').map(line => {
    const [rawSignals, rawOutput] = line.trim().split('|');
    const signals = rawSignals.trim().split(' ');
    const output = rawOutput.trim().split(' ');
    return { signals, output };
});

function patternToNumber(pattern) {
    switch (pattern.length) {
        case 2:
            return 1;
        case 3:
            return 7;
        case 4:
            return 4;
        case 7:
            return 8;
        default: -1;
    }
}

const answer = pairs.reduce(
    (count, pair) =>
        pair.output.reduce(
            (count, pattern) => {
                const number = patternToNumber(pattern);
                return number > 0 ? count + 1 : count
            },
            count
        )
    ,
    0
);

console.log(`Answer: ${answer}`);