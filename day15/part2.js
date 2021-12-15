const exp = require('constants');
const fs = require('fs');
const path_ = require('path');

const input = fs.readFileSync(path_.resolve(__dirname, 'input.txt'), 'utf8');

const initialMap = input.split('\n').map(line => line.trim().split('').map(Number));

const expandedMap = [];
const width = initialMap[0].length;
const height = initialMap.length;
for (let y = 0; y < height * 5; y++) {
    expandedMap[y] = [];
    for (let x = 0; x < width * 5; x++) {
        const extraRisk = Math.floor(x / width) + Math.floor(y / height);
        const newRisk = (initialMap[y % height][x % width] + extraRisk);
        expandedMap[y][x] = newRisk - Math.floor(newRisk / 10) * 9;
    }
}

const getNeighbors = (map, { x, y }) =>
    [
        { x: +1, y: 0 },
        { x: 0, y: +1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
    ]
        .map(delta => ({
            x: delta.x + x,
            y: delta.y + y
        }))
        .filter(({ x, y }) =>
            x >= 0 && x < map[0].length &&
            y >= 0 && y < map.length
        );


function createQueue() {
    const data = [];

    const add = (value, priority) => {
        const index = data.findIndex(item => item.priority > priority);
        if (index <= 0) {
            data.push({ value, priority });
        } else {
            data.splice(index, 0, { value, priority })
        }
    }

    const hasNext = () => data.length > 0;

    const pop = () => {
        const value = data.shift().value;
        return value;
    };

    return { add, pop, hasNext };
}

function findPath(map, from, to) {
    const toVisit = createQueue();
    toVisit.add(from, 0);

    const visisted = {};
    const scores = {};
    scores[`${from.x},${from.y}`] = 0;

    const cameFrom = {};
    const toPath = () => {
        const path = [];
        let node = to;
        while (node.x !== from.x || node.y !== from.y) {
            path.push(node);
            node = cameFrom[`${node.x},${node.y}`];
        }
        return path.reverse();
    }

    while (toVisit.hasNext()) {
        const node = toVisit.pop();

        if (node.x === to.x && node.y === to.y) {
            return toPath();
        }

        const nodeScore = scores[`${node.x},${node.y}`];
        const neighbors = getNeighbors(map, node);

        neighbors.forEach(neighbor => {
            const newScore = nodeScore + map[neighbor.y][neighbor.x];
            const key = `${neighbor.x},${neighbor.y}`;
            const currentScore = scores[key] ?? Number.MAX_SAFE_INTEGER;
            if (newScore < currentScore) {
                const score = Math.min(newScore, currentScore);
                cameFrom[key] = node;
                scores[key] = score;
                if (!visisted[`${neighbor.x},${neighbor.y}`]) {
                    toVisit.add(neighbor, score);
                }
            }

        });

        visisted[`${node.x},${node.y}`] = true;
    }

    return [];
}

const map = expandedMap;
const start = { x: 0, y: 0 };
const end = { x: map[0].length - 1, y: map.length - 1 };

const path = findPath(map, start, end);
const risk = path.reduce((risk, node) => risk + map[node.y][node.x], 0);
console.log(risk);