const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const lines = input.split('\n').map(line => line.trim());

const charToScore = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
};

const tags = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
};

function validateLine(line) {
    const stack = [];

    return line.split('').findIndex(char => {
        if (Object.keys(tags).includes(char)) {
            stack.push(char);
        }
        else if (Object.values(tags).includes(char)) {
            const expectedCloseTag = tags[stack.pop()];
            return char !== expectedCloseTag;
        }
    });
}

const errors = lines.map(validateLine);

const answer = errors.reduce(
    (score, columnIndex, lineIndex) =>
        (charToScore[lines[lineIndex][columnIndex]] ?? 0) + score,
    0
);

console.log(`Answer: ${answer}`);