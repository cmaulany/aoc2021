const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const map = input.split('\n').map(line => line.trim().split('').map(char => char));

const mapToString = (map) => map.map(row => row.join('')).join('\n');

const getPosition = (map, position) => {
    const width = map[0].length;
    const height = map.length;
    const x = ((position.x % width) + width) % width;
    const y = ((position.y % height) + height) % height;
    return map[y][x];
};

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
for (let step = 1; ; step++) {
    const map = doStep(prevMap);
    if (mapToString(map) === mapToString(prevMap)) {
        console.log(`Answer: ${step}`);
        break;
    }
    prevMap = map;
}