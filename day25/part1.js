// const input = `v...>>.vv>
// .vv>>.vv..
// >>.>v>...v
// >>v>>.>.v.
// v>v.vv.v..
// >.>>..v...
// .vv..>.>v.
// v.v..>>v.v
// ....v..v.>`;

const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const map = input.split('\n').map(line => line.trim().split('').map(char => char));

const mapToString = (map) => map.map(row => row.join('')).join('\n');

const getNeighbors = (map, { x, y }) =>
    [
        { x: -1, y: 0 },
        { x: +1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: +1 }
    ].map(delta => ({
        x: (delta.x + x) % map[0].length,
        y: (delta.y + y) % map.length
    }));

const getPosition = (map, position) => {
    const width = map[0].length;
    const height = map.length;
    const x = ((position.x % width) + width) % width;
    const y = ((position.y % height) + height) % height;
    return map[y][x];
}

const forEachPosition = (map, callback) => {
    for (let y = 0; y < map.length; x++) {
        for (let x = 0; x < map[0].lenght; x++) {
            callback(getPosition({ x, y }), { x, y });
        }
    }
}

const moveEast = (map) => map.map(
    (row, y) => row.map(
        (value, x) => {
            if (value === '>' && getPosition(map, { x: x + 1, y }) === '.') {
                return '.';
            }
            if (value === '.' && getPosition(map, { x: x - 1, y }) === '>') {
                return '>';
            }
            return value;
        }
    )
);

const moveSouth = (map) => map.map(
    (row, y) => row.map(
        (value, x) => {
            if (value === 'v' && getPosition(map, { x, y: y + 1 }) === '.') {
                return '.'
            }
            if (value === '.' && getPosition(map, { x, y: y - 1 }) === 'v') {
                return 'v'
            }
            return value;
        }
    )
);

const doStep = (map) => {
    map = moveEast(map);
    map = moveSouth(map);
    return map;
};

let prevMap = map;
for (let i = 1; ; i++) {
    const map = doStep(prevMap);
    if (mapToString(map) === mapToString(prevMap)) {
        console.log(i);
        break;
    }
    prevMap = map;
}
// console.log("0\n", mapToString(map));
// const map1 = doStep(map);
// console.log("1\n", mapToString(map1));