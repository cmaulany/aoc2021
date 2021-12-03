const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
const data = input.split('\n').map(n => n.trim());

function getRating(data, keepCondition) {
    const rating = data[0].split('').reduce(
        (data, _, index) => {
            if (data.length === 1) {
                return data;
            }

            const zeroCount = data.filter(number => number[index] === '0').length;
            const oneCount = data.length - zeroCount;

            return data.filter(number => keepCondition(zeroCount, oneCount, number[index]));
        },
        data
    )[0];

    return parseInt(rating, 2);
}

const getOxygenGeneratorRating = (data) => getRating(
    data,
    (zeroCount, oneCount, bit) =>
        (zeroCount > oneCount ? '0' : '1') === bit
);

const getCo2ScrubberRating = (data) => getRating(
    data,
    (zeroCount, oneCount, bit) =>
        (zeroCount > oneCount ? '1' : '0') === bit
);

const oxygenGeneratorRating = getOxygenGeneratorRating(data);
const co2ScrubberRating = getCo2ScrubberRating(data);

const answer = oxygenGeneratorRating * co2ScrubberRating;
console.log(`Answer: ${answer}`);