const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const map = [
    { type: 'hallway', amphipods: [] },
    { type: 'hallway', amphipods: [] },
    { type: 'A', amphipods: [], size: 2 },
    { type: 'hallway', amphipods: [] },
    { type: 'B', amphipods: [], size: 2 },
    { type: 'hallway', amphipods: [] },
    { type: 'C', amphipods: [], size: 2 },
    { type: 'hallway', amphipods: [] },
    { type: 'D', amphipods: [], size: 2 },
    { type: 'hallway', amphipods: [] },
    { type: 'hallway', amphipods: [] }
];

const insert = {
    2: ["D", "D"],
    4: ["B", "C"],
    6: ["A", "B"],
    8: ["C", "A"]
};

const lines = input.split('\n');
const mapPart1 = map.map((node, index) => node.type !== 'hallway' ?
    {
        ...node,
        amphipods: [
            lines[3][index + 1],
            lines[2][index + 1]
        ]
    } : node
);

const mapPart2 = mapPart1.map((node, index) => node.type !== 'hallway' ?
    {
        ...node,
        amphipods: [
            ...node.amphipods[0],
            ...insert[index],
            ...node.amphipods[1]
        ],
        size: 4
    } : node
);

const memoize = (callback) => {
    const memo = {};
    return (...args) => {
        const key = JSON.stringify(args);
        return memo.hasOwnProperty(key) ?
            memo[key] :
            memo[key] = callback(...args);
    };
};

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
                const hallwayToHallway =
                    map[from].type === 'hallway' &&
                    map[to].type === 'hallway';

                const amphipod = map[from].amphipods.slice(-1)[0];
                const toIncorrectType = map[to].type !== 'hallway' && (
                    amphipod !== map[to].type ||
                    map[to].amphipods.some(other => other !== amphipod)
                );

                if (
                    hallwayToHallway ||
                    toIncorrectType ||
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

const isFinished = (map) => map.every((node) =>
    node.type === 'hallway' ||
    (
        node.amphipods.length === node.size &&
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
        distance += 1 + map[from].size - map[from].amphipods.length;
    }

    if (map[to].type !== 'hallway') {
        distance += map[to].size - map[to].amphipods.length;
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
        (min, move) => Math.min(
            min,
            solve(doMove(map, move)) +
            getMoveCost(map, move)
        ),
        Infinity
    )
});

const answerPart1 = solve(mapPart1);
const answerPart2 = solve(mapPart2);
console.log(`Answer Part 1: ${answerPart1}`);
console.log(`Answer Part 2: ${answerPart2}`);