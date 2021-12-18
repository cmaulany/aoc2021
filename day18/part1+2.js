const fs = require('fs');
const path_ = require('path');

const input = fs.readFileSync(path_.resolve(__dirname, 'input.txt'), 'utf8');

const getPath = (number, path) => path.reduce((pair, index) => pair?.[index], number);
const setPath = (number, path, element) => {
    if (path.length === 0) {
        return element;
    }
    const [index, ...rest] = path;
    return number.map((pair, i) => i === index ? setPath(pair, rest, element) : pair);
};

const getRightMostPath = (number, path) => {
    const element = getPath(number, path);
    if (element === undefined) {
        return undefined;
    }

    return typeof element === 'number' ?
        path : getRightMostPath(number, [...path, 1]);
}

const getLeftMostPath = (number, path = []) => {
    const element = getPath(number, path);
    if (element === undefined) {
        return undefined;
    }

    return typeof element === 'number' ?
        path : getLeftMostPath(number, [...path, 0]);
}

const findNestedPair = (number, depth = 4, path = []) => {
    const value = getPath(number, path);
    if (value === undefined) {
        return undefined;
    }

    if (path.length >= depth && Array.isArray(value)) {
        return path;
    }

    return (
        findNestedPair(number, depth, [...path, 0]) ??
        findNestedPair(number, depth, [...path, 1])
    );
};

const findNumberAbove = (number, n = 9, path = []) => {
    const value = getPath(number, path);
    if (value === undefined) {
        return undefined;
    }

    if (typeof value === 'number' && value > n) {
        return path;
    }

    return (
        findNumberAbove(number, n, [...path, 0]) ??
        findNumberAbove(number, n, [...path, 1])
    );
};

const explode = (number, path) => {
    const value = getPath(number, path);
    const [x, y] = value;

    number = setPath(number, path, 0);
    const leftIndex = path.reduce(
        (leftIndex, value, index) =>
            value === 1 ?
                index :
                leftIndex,
        -1
    );
    if (leftIndex >= 0) {
        const leftPath = getRightMostPath(number, [...path.slice(0, leftIndex), 0]);
        const left = getPath(number, leftPath);
        number = setPath(number, leftPath, left + x);
    }
    const rightIndex = path.reduce(
        (leftIndex, value, index) =>
            value === 0 ?
                index :
                leftIndex,
        -1
    );
    if (rightIndex >= 0) {
        const rightPath = getLeftMostPath(number, [...path.slice(0, rightIndex), 1]);
        const right = getPath(number, rightPath);

        number = setPath(number, rightPath, right + y);
    }
    
    return number;
}

const snailReduce = (number) => {
    const nestedPath = findNestedPair(number, 4);
    if (nestedPath) {
        return snailReduce(explode(number, nestedPath));
    } else {
        const pathAbove = findNumberAbove(number);
        if (pathAbove) {
            const value = getPath(number, pathAbove);
            number = setPath(number, pathAbove, [Math.floor(value / 2), Math.ceil(value / 2)])
            return snailReduce(number);
        }
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
const numbers = input
    .split('\n')
    .map(line => JSON.parse(line.trim()));
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

console.log(getMagnitude(sum));
console.log(bestPair.magnitude);
// const answer = add(a, b);
// const answer = snailReduce([[3, [2, [8, 0]]], [9, [5, [4, [3, 2]]]]]);
// console.log(JSON.stringify(answer));

// console.log(getRightMostPath)
