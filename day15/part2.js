const exp = require('constants');
const fs = require('fs');
const path_ = require('path');

const input = fs.readFileSync(path_.resolve(__dirname, 'input.txt'), 'utf8');

// const input = `1163751742
// 1381373672
// 2136511328
// 3694931569
// 7463417111
// 1319128137
// 1359912421
// 3125421639
// 1293138521
// 2311944581`;

// const input = `1133
// 3133
// 3111
// 3331`;

const map = input.split('\n').map(line => line.trim().split('').map(Number));

const expandedMap = [];
const width = map[0].length;
const height = map.length;
for (let y = 0; y < height * 5; y++) {
    expandedMap[y] = [];
    for (let x = 0; x < width * 5; x++) {
        const extraRisk = Math.floor(x / width) + Math.floor(y / height);
        const newRisk = (map[y % height][x % width] + extraRisk);
        expandedMap[y][x] = newRisk - Math.floor(newRisk / 10) * 9;
    }
}

const start = { x: 0, y: 0 };
const end = { x: expandedMap[0].length - 1, y: expandedMap.length - 1 };

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


function findPath(map, from, to) {
    const toVisit = [from];
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

    while (toVisit.length > 0) {
        console.log(Object.keys(visisted).length);
        toVisit.sort((a, b) => scores[`${a.x},${a.y}`] > scores[`${b.x},${b.y}`] ? 1 : -1);
        const node = toVisit.shift();

        if (node.x === to.x && node.y === to.y) {
            break;
        }

        const score = scores[`${node.x},${node.y}`];
        const neighbors = getNeighbors(map, node);

        neighbors.forEach(next => {
            const newScore = score + map[next.y][next.x];
            const key = `${next.x},${next.y}`;
            const currentScore = scores[key] ?? Number.MAX_SAFE_INTEGER;
            if (newScore < currentScore) {
                cameFrom[key] = node;
                scores[key] = Math.min(newScore, currentScore);
            }
        });

        const neighborsToVisit = neighbors.filter(
            neighbor =>
                !visisted[`${neighbor.x},${neighbor.y}`] &&
                toVisit.every(
                    other =>
                        other.x !== neighbor.x ||
                        other.y !== neighbor.y
                )
        );

        toVisit.push(...neighborsToVisit);
        visisted[`${node.x},${node.y}`] = true;
    }

    return toPath();
}

// console.log(expandedMap);

const path = findPath(expandedMap, start, end);
const risk = path.reduce((risk, node) => risk + expandedMap[node.y][node.x], 0);
console.log(risk);