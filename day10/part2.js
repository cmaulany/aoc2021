const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const lines = input.split('\n').map(line => line.trim());

const charToScore = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
};

const openToCloseTag = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
};

function validateLine(line) {
    const stack = [];

    return line.split('').findIndex(char => {
        if ('([{<'.includes(char)) {
            stack.push(char);
        }
        else if (')]}>'.includes(char)) {
            const expectedCloseTag = openToCloseTag[stack.pop()];
            return char !== expectedCloseTag;
        }
    });
}

function getCompletionString(line) {
    const stack = [];

    line.split('').forEach(char => {
        if ('([{<'.includes(char)) {
            stack.push(char);
        }
        else if (')]}>'.includes(char)) {
            stack.pop();
        }
    });

    return stack.reverse().map(char => openToCloseTag[char]).join('');
}

const completionStringToScore = (completionString) => completionString.split('').reduce(
    (score, char) => score * 5 + charToScore[char],
    0
);

const validLines = lines.filter(line => validateLine(line) === -1);
const completionStrings = validLines.map(getCompletionString);
const sortedScores = completionStrings.map(completionStringToScore).sort((a, b) => a > b ? 1 : -1);

const answer = sortedScores[(sortedScores.length - 1) / 2]

console.log(`Answer: ${answer}`)