const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
const data = input.split('\n').map(n => n.trim());

const first = data[0];

const bGammaRate = first.split('').map((_, index) => {
    const zeroCount = data.filter(number => number[index] === '0').length;
    return zeroCount > (data.length / 2) ? '0' : '1'
}).join('');

const bEpsilonRate = bGammaRate.split('').map(bit => bit === '0' ? '1' : '0').join('');

const gammaRate = parseInt(bGammaRate, 2);
const epsilonRate = parseInt(bEpsilonRate, 2);

const answer = gammaRate * epsilonRate;

console.log(`Answer: ${answer}`);