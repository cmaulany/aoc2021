const fs = require('fs');
const path_ = require('path');

const input = fs.readFileSync(path_.resolve(__dirname, 'input.txt'), 'utf8');

const [dotsInput, foldsInput] = input.split('\n\n');

const dots = dotsInput.split('\n').map(line => {
    const [x, y] = line.trim().split(',').map(Number);
    return { x, y }
});

const folds = foldsInput.split('\n').map(line => {
    const [axis, offset] = line.substr('fold along '.length).split('=');
    return { axis, offset: Number(offset) };
});

function dotsToString(dots) {
    const positionToDot = dots.reduce((positionToDot, { x, y }) => {
        positionToDot[`${x},${y}`] = true;
        return positionToDot;
    }, {});

    const maxX = dots.reduce((maxX, { x }) => Math.max(maxX, x), 0);
    const maxY = dots.reduce((maxY, { y }) => Math.max(maxY, y), 0);

    const lines = [];
    for (let y = 0; y <= maxY; y++) {
        const line = [];
        for (let x = 0; x <= maxX; x++) {
            line.push(
                positionToDot[`${x},${y}`] ? '#' : '.'
            );
        }
        lines.push(line.join(''));
    }

    return lines.join('\n');
}

const overlay = (aDots, bDots) => [
    ...aDots,
    ...bDots.filter(
        ({ x, y }) => aDots.every(dot =>
            dot.x !== x ||
            dot.y !== y
        )
    )
];

const flipAxis = (dots, axis, offset = 0) => dots.map(dot => ({
    ...dot,
    [axis]: 2 * offset - dot[axis],
}));

const fold = (dots, { axis, offset }) => {
    const firstHalf = dots.filter(dot => dot[axis] < offset);
    const secondHalf = dots.filter(dot => dot[axis] > offset);
    const flipped = flipAxis(secondHalf, axis, offset);
    return overlay(firstHalf, flipped);
};

const answerPart1 = fold(dots, folds[0]).length;
const answerPart2 = dotsToString(folds.reduce(fold, dots));
console.log(`Answer Part 1: ${answerPart1}`);
console.log(`Answer Part 2: \n${answerPart2}`);