const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
const pairs = input.split('\n').map(line => {
    const [rawSignals, rawOutput] = line.trim().split('|');
    const signals = rawSignals.trim().split(' ');
    const output = rawOutput.trim().split(' ');
    return { signals, output };
});

const contains = (a, b) => b.split('').every(char => a.includes(char));

const sortString = (s) => s.split('').sort().join('');

function calculatePatternMap(signals) {
    const n1 = signals.find(signal => signal.length === 2);
    const n4 = signals.find(signal => signal.length === 4);
    const n7 = signals.find(signal => signal.length === 3);
    const n8 = signals.find(signal => signal.length === 7);

    const n6 = signals.find(
        signal =>
            signal.length === 6 &&
            ![n1, n4, n7, n8].includes(signal) &&
            !contains(signal, n7)
    );

    const n9 = signals.find(
        signal =>
            signal.length === 6 &&
            ![n1, n4, n7, n8, n6].includes(signal) &&
            contains(signal, n4)
    );

    const n0 = signals.find(
        signal =>
            signal.length === 6 &&
            ![n1, n4, n7, n8, n6, n9].includes(signal)
    );

    const n3 = signals.find(
        signal =>
            ![n1, n4, n7, n8, n0, n6, n9].includes(signal) &&
            contains(signal, n1)
    );

    const n5 = signals.find(
        signal =>
            ![n1, n4, n7, n8, n0, n6, n9, n3].includes(signal) &&
            contains(n6, signal)
    );

    const n2 = signals.find(
        signal =>
            ![n1, n4, n7, n8, n0, n6, n9, n3, n5].includes(signal)
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
    return pair.output.map(pattern => {
        return patternMap[sortString(pattern)];
    }).join('');
}).map(Number);

const answer = outputs.reduce((sum, output) => sum + output, 0);
console.log(`Answer: ${answer}`);