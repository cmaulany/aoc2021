const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
const data = input.split('\n').map(n => n.trim());

const first = data[0];

const bOxygenGeneratorRating = first.split('').reduce(
    (data, _, index) => {
        if (data.length === 1) {
            return data;
        }

        const zeroCount = data.filter(number => number[index] === '0').length;
        const bitToKeep = zeroCount > (data.length / 2.0) ? '0' : '1';
        
        return data.filter(number => number[index] === bitToKeep);
    },
    data
)[0];

const bCo2ScrubberRating = first.split('').reduce(
    (data, _, index) => {
        if (data.length === 1) {
            return data;
        }

        const zeroCount = data.filter(number => number[index] === '0').length;
        const bitToKeep = zeroCount > (data.length / 2.0) ? '1' : '0';
        
        return data.filter(number => number[index] === bitToKeep);
    },
    data
)[0];

console.log(parseInt(bOxygenGeneratorRating, 2));
console.log(parseInt(bCo2ScrubberRating, 2));


const ocygenGeneratorRating = parseInt(bOxygenGeneratorRating, 2);
const co2ScrubberRating = parseInt(bCo2ScrubberRating, 2);

const answer = ocygenGeneratorRating * co2ScrubberRating;

console.log(`Answer: ${answer}`);