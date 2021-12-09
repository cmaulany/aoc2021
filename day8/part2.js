const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const pairs = input.split('\n').map(line => {
    const [signals, output] = line.trim().split('|').map(part => part.trim().split(' '));
    return { signals, output };
});

const contains = (a, b) => b.split('').every(char => a.includes(char));

const sortString = (s) => s.split('').sort().join('');

function calculatePatternMap(signals) {
    const n1 = signals.find(signal => signal.length === 2);
    const n4 = signals.find(signal => signal.length === 4);
    const n7 = signals.find(signal => signal.length === 3);
    const n8 = signals.find(signal => signal.length === 7);

    const n9 = signals.find(signal =>
        signal.length === 6 &&
        contains(signal, n4)
    );

    const n6 = signals.find(signal =>
        signal.length === 6 &&
        !contains(signal, n7)
    );

    const n0 = signals.find(signal =>
        signal.length === 6 &&
        n6 !== signal &&
        n9 !== signal
    );

    const n3 = signals.find(signal =>
        signal.length === 5 &&
        contains(signal, n1)
    );

    const n5 = signals.find(signal =>
        signal.length === 5 &&
        contains(n6, signal)
    );

    const n2 = signals.find(signal =>
        signal.length === 5 &&
        !contains(n9, signal)
    );

    return {
        [sortString(n0)]: 0,
        [sortString(n1)]: 1,
        [sortString(n2)]: 2,
        [sortString(n3)]: 3,
        [sortString(n4)]: 4,
        [sortString(n5)]: 5,
        [sortString(n6)]: 6,
        [sortString(n7)]: 7,
        [sortString(n8)]: 8,
        [sortString(n9)]: 9
    }
}

const outputs = pairs.map(pair => {
    const patternMap = calculatePatternMap(pair.signals);

    const sNumber = pair.output.map(pattern => {
        return patternMap[sortString(pattern)];
    }).join('');

    return Number(sNumber);
});

const answer = outputs.reduce((sum, output) => sum + output, 0);
console.log(`Answer: ${answer}`);