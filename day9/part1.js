const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const map = input.split('\n').map(line => line.trim().split('').map(Number));

const getNeighbors = (map, { x, y }) => {
    const mapWidth = map[0].length;
    const mapHeight = map.length;

    const neighbors = [
        { x: -1, y: 0 },
        { x: +1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: +1 }
    ]
        .map(delta => ({
            x: delta.x + x,
            y: delta.y + y
        }))
        .filter(({ x, y }) =>
            x >= 0 && x < mapWidth &&
            y >= 0 && y < mapHeight
        );

    return neighbors;
};

const isLowPoint = (map, { x, y }) =>
    getNeighbors(map, { x, y }).every(
        neighbor => map[neighbor.y][neighbor.x] > map[y][x]
    );

const getLowPoints = (map) => map.reduce(
    (lowPoints, row, y) => row.reduce(
        (lowPoints, _, x) =>
            isLowPoint(map, { x, y }) ?
                [...lowPoints, { x, y }] :
                lowPoints,
        lowPoints
    ),
    []
);

const lowPoints = getLowPoints(map);

const answer = lowPoints.reduce((answer, { x, y }) => map[y][x] + 1 + answer, 0);

console.log(`Answer: ${answer}`);