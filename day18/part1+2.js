const fs = require('fs');
const path_ = require('path');

const input = fs.readFileSync(path_.resolve(__dirname, 'input.txt'), 'utf8');

const numbers = input.split('\n').map(line => JSON.parse(line.trim()));

const get = (number, path) => path.reduce((pair, index) => pair?.[index], number);

const set = (number, path, element) => {
    if (path.length === 0) {
        return element;
    }
    const [index, ...rest] = path;
    return number.map((pair, i) =>
        i === index ?
            set(pair, rest, element) :
            pair
    );
};

const repeatPath = (number, index, path = []) => {
    const element = get(number, path);
    if (element === undefined) {
        return undefined;
    }

    return typeof element === 'number' ?
        path : repeatPath(number, index, [...path, index]);
}

const getRightMostPath = (number, path) => repeatPath(number, 1, path);

const getLeftMostPath = (number, path) => repeatPath(number, 0, path);

const findLeftNumberPath = (number, path) => {
    const sharedPathLength = path.lastIndexOf(1);
    if (sharedPathLength >= 0) {
        return getRightMostPath(number, [...path.slice(0, sharedPathLength), 0]);
    }
};

const findRightNumberPath = (number, path) => {
    const sharedPathLength = path.lastIndexOf(0);
    if (sharedPathLength >= 0) {
        return getLeftMostPath(number, [...path.slice(0, sharedPathLength), 1]);
    }
};

const findNestedPairPath = (number, depth = 4, path = []) => {
    const value = get(number, path);
    if (value === undefined) {
        return undefined;
    }

    if (path.length >= depth && Array.isArray(value)) {
        return path;
    }

    return (
        findNestedPairPath(number, depth, [...path, 0]) ??
        findNestedPairPath(number, depth, [...path, 1])
    );
};

const findNumberAbovePath = (number, n = 9, path = []) => {
    const value = get(number, path);
    if (value === undefined) {
        return undefined;
    }

    if (typeof value === 'number' && value > n) {
        return path;
    }

    return (
        findNumberAbovePath(number, n, [...path, 0]) ??
        findNumberAbovePath(number, n, [...path, 1])
    );
};

const explode = (number, path) => {
    const value = get(number, path);
    const [x, y] = value;

    number = set(number, path, 0);

    const leftPath = findLeftNumberPath(number, path);
    if (leftPath) {
        const left = get(number, leftPath);
        number = set(number, leftPath, left + x);
    }

    const rightPath = findRightNumberPath(number, path);
    if (rightPath) {
        const right = get(number, rightPath);
        number = set(number, rightPath, right + y);
    }

    return number;
}

const split = (number, path) => {
    const value = get(number, path);
    return set(number, path, [Math.floor(value / 2), Math.ceil(value / 2)]);
}

const snailReduce = (number) => {
    const explodePath = findNestedPairPath(number, 4);
    if (explodePath) {
        return snailReduce(explode(number, explodePath));
    }

    const splitPath = findNumberAbovePath(number);
    if (splitPath) {
        return snailReduce(split(number, splitPath));
    }

    return number;
};

const getMagnitude = (number) => {
    if (typeof number === 'string') {
        number = JSON.parse(number);
    }
    if (typeof number === 'number') {
        return number;
    }
    return (
        3 * getMagnitude(number[0]) +
        2 * getMagnitude(number[1])
    );
};

const add = (a, b) => snailReduce([a, b]);

const sum = numbers.reduce((sum, number) => add(sum, number));

const bestPair = numbers.reduce(
    (pair, a, i) => numbers.reduce(
        (pair, b, j) => {
            if (i === j) {
                return pair;
            }
            const sum = add(a, b);
            const magnitude = getMagnitude(sum);
            if (magnitude > pair.magnitude) {
                return { a, b, sum, magnitude };
            }
            return pair;
        },
        pair
    ),
    { magnitude: -Infinity }
);

const answerPart1 = getMagnitude(sum)
const answerPart2 = bestPair.magnitude;
console.log(`Answer Part 1: ${answerPart1}`);
console.log(`Answer Part 2: ${answerPart2}`);