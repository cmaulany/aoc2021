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

const getBasin = (map, lowPoint) => {
    const height = map[lowPoint.y][lowPoint.x];
    const neighbors = getNeighbors(map, lowPoint);

    const higherNeighbors = neighbors
        .filter(neighbor => {
            const neighborHeight = map[neighbor.y][neighbor.x];
            return neighborHeight < 9 && neighborHeight > height;
        });

    const basins = [
        lowPoint,
        ...higherNeighbors.map(neighbor => getBasin(map, neighbor)).flat()
    ];

    return basins.filter(
        (position1, index1) => !basins.some(
            (position2, index2) =>
                index1 < index2 &&
                position1.x === position2.x &&
                position1.y === position2.y
        ));
};

const basins = getLowPoints(map).map(lowPoint => getBasin(map, lowPoint));

const threeLargestBasins = basins.sort((a, b) => a.length < b.length ? 1 : -1).slice(0, 3);

const answer = threeLargestBasins.reduce((answer, basin) => answer * basin.length, 1);
console.log(`Answer: ${answer}`);