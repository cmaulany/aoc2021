const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const map = input.split('\n').map(line => line.trim().split('').map(Number));

const getNeighbors = (map, { x, y }) =>
    [
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
            x >= 0 && x < map[0].length &&
            y >= 0 && y < map.length
        );

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

const getBasin = (map, lowPoint, visited = []) => {
    const basinNeighbors = getNeighbors(map, lowPoint)
        .filter(position => !visited.some(other =>
            other.x === position.x &&
            other.y === position.y
        ))
        .filter(neighbor => {
            const neighborHeight = map[neighbor.y][neighbor.x];
            return neighborHeight < 9 && neighborHeight > map[lowPoint.y][lowPoint.x];
        });

    visited.push(...basinNeighbors);

    return [
        lowPoint,
        ...basinNeighbors.map(neighbor => getBasin(map, neighbor, visited))
    ].flat();
};

const basins = getLowPoints(map).map(lowPoint => getBasin(map, lowPoint));

const threeLargestBasins = basins.sort((a, b) => a.length < b.length ? 1 : -1).slice(0, 3);

const answer = threeLargestBasins.reduce((answer, basin) => answer * basin.length, 1);
console.log(`Answer: ${answer}`);