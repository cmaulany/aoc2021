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
console.log(map);

const start = { x: 0, y: 0 };
const end = { x: map[0].length - 1, y: map.length - 1 };

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
    const visisted = [];
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
        const node = toVisit.shift();

        // if (node.x === to.x && node.y === to.y) {
            
        // }

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
            neighbor => visisted.concat(toVisit).every(
                other =>
                    other.x !== neighbor.x ||
                    other.y !== neighbor.y
            )
        );

        toVisit.push(...neighborsToVisit);
        visisted.push(node);
    }

    return toPath();
}

const path = findPath(map, start, end);
const risk = path.reduce((risk, node) => risk + map[node.y][node.x], 0);
console.log(path);
console.log(risk);