const input = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`

const fs = require('fs');
const path = require('path');

// const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

// const map = [
//     { type: 'hallway', amphipods: [] },
//     { type: 'hallway', amphipods: [] },
//     { type: 'A', amphipods: ["A"] },
//     { type: 'hallway', amphipods: [] },
//     { type: 'B', amphipods: ["B", "B"] },
//     { type: 'hallway', amphipods: ["D"] },
//     { type: 'C', amphipods: ["C", "C"] },
//     { type: 'hallway', amphipods: [] },
//     { type: 'D', amphipods: ["A", "D"] },
//     { type: 'hallway', amphipods: [] },
//     { type: 'hallway', amphipods: [] }
// ];

const memoize = (callback) => {
    const memo = {};
    return (...args) => {
        const key = JSON.stringify(args);
        return memo.hasOwnProperty(key) ?
            memo[key] :
            memo[key] = callback(...args);
    };
};

// example
// const map = [
//     { type: 'hallway', amphipods: [] },
//     { type: 'hallway', amphipods: [] },
//     { type: 'A', amphipods: ["A", "B"] },
//     { type: 'hallway', amphipods: [] },
//     { type: 'B', amphipods: ["D", "C"] },
//     { type: 'hallway', amphipods: [] },
//     { type: 'C', amphipods: ["C", "B"] },
//     { type: 'hallway', amphipods: [] },
//     { type: 'D', amphipods: ["A", "D"] },
//     { type: 'hallway', amphipods: [] },
//     { type: 'hallway', amphipods: [] }
// ];

// input
const map = [
    { type: 'hallway', amphipods: [] },
    { type: 'hallway', amphipods: [] },
    { type: 'A', amphipods: ["C", "D", "D", "C"] },
    { type: 'hallway', amphipods: [] },
    { type: 'B', amphipods: ["A", "B", "C", "A"] },
    { type: 'hallway', amphipods: [] },
    { type: 'C', amphipods: ["D", "A", "B", "B"] },
    { type: 'hallway', amphipods: [] },
    { type: 'D', amphipods: ["B", "C", "A", "D"] },
    { type: 'hallway', amphipods: [] },
    { type: 'hallway', amphipods: [] }
];

// const map = [
//     { type: 'hallway', amphipods: [] },
//     { type: 'hallway', amphipods: [] },
//     { type: 'A', amphipods: ["A"] },
//     { type: 'hallway', amphipods: [] },
//     { type: 'B', amphipods: [] },
//     { type: 'hallway', amphipods: ["A"] },
//     { type: 'C', amphipods: [] },
//     { type: 'hallway', amphipods: [] },
//     { type: 'D', amphipods: [] },
//     { type: 'hallway', amphipods: [] },
//     { type: 'hallway', amphipods: [] }
// ];

const hallwayIsFree = (map, from, to) => map.every((node, index) =>
    node.type !== 'hallway' ||
    index === from ||
    index < Math.min(from, to) ||
    index > Math.max(from, to) ||
    node.amphipods.length === 0
);

const getMoves = (map) => {
    const froms = map.reduce(
        (froms, node, index) =>
            node.amphipods.some(amphipod => amphipod !== node.type) ?
                [...froms, index] :
                froms,
        []
    );

    const tos = map.reduce(
        (tos, node, index) =>
            (
                node.type !== 'hallway' ||
                node.amphipods.length === 0
            ) ?
                [...tos, index] :
                tos,
        []
    );

    const moves = froms.reduce(
        (moves, from) => tos.reduce(
            (moves, to) => {
                const amphipod = map[from].amphipods.slice(-1)[0];
                if (
                    (map[from].type === 'hallway' && map[to].type === 'hallway') ||
                    (
                        map[to].type !== 'hallway' &&
                        amphipod !== map[to].type
                    ) ||
                    (
                        map[to].type !== 'hallway' &&
                        map[to].amphipods.some(other => other !== amphipod)
                    ) ||
                    !hallwayIsFree(map, from, to)
                ) {
                    return moves;
                }
                return [...moves, [from, to]];
            },
            moves
        ),
        []
    );

    return moves;
}

// console.log(getMoves(map));
const isFinished = (map) => map.every((node) =>
    node.type === 'hallway' ||
    (
        node.amphipods.length >= 4 &&
        node.amphipods.every(amphipod => amphipod === node.type)
    )
);


const getMoveCost = (map, [from, to]) => {
    const energyCost = {
        A: 1,
        B: 10,
        C: 100,
        D: 1000
    };

    let distance = Math.abs(to - from);
    if (map[from].type !== 'hallway') {
        distance += 5 - map[from].amphipods.length;
    }
    if (map[to].type !== 'hallway') {
        distance += 4 - map[to].amphipods.length;
    }
    const amphipod = map[from].amphipods.slice(-1)[0];
    return energyCost[amphipod] * distance;
}

const doMove = (map, [from, to]) => {
    const amphipod = map[from].amphipods.slice(-1)[0];

    return map.map((node, index) => {
        if (index === from) {
            return {
                ...node,
                amphipods: node.amphipods.slice(0, -1)
            };
        }

        if (index === to) {
            return {
                ...node,
                amphipods: [...node.amphipods, amphipod]
            };
        }

        return node;
    });
};

const solve = memoize((map) => {
    if (isFinished(map)) {
        return 0;
    }

    const moves = getMoves(map);
    if (moves.length === 0) {
        return Infinity;
    }

    return moves.reduce(
        (min, move) => {
            const cost =
                solve(doMove(map, move)) +
                getMoveCost(map, move);
            return Math.min(min, cost);
        },
        Infinity
    )
});

// let s0 = map;
// console.log(getMoveCost(s0, [6, 3]))
// let s1 = doMove(s0, [6, 3]);
// console.log(getMoveCost(s1, [4, 6]));
// let s2 = doMove(s1, [4, 6]);
// console.log(getMoveCost(s2, [4, 5]));
// let s3 = doMove(s2, [4, 5]);
// console.log(getMoveCost(s3, [3, 4]));
// let s4 = doMove(s3, [3, 4]);

const solution = solve(map);
console.log("sol", solution);

// const moves = getMoves(map);
// console.log(moves);
// console.log(getMoveCost(map, [10, 8]))


