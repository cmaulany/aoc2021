

// const state = {
//     W1: {
//         type: 'open',
//         units: [],
//         capacity: 2,
//         neighbors: [
//             'R1',
//             'W2'
//         ]
//     },
//     R1: {
//         type: 'room',
//         units: [
//             {
//                 type: 'A',
//                 distance: 0,
//             },
//             {
//                 type: 'B',
//                 distance: 0
//             }
//         ],
//         capacity: 2,
//         neighbors: [
//             'W1',
//             'W2'
//         ]
//     },
//     W2: {
//         type: 'open',
//         units: [],
//         capacity: 1,
//         neighbors: [
//             'R1',
//             'R2',
//             'W1',
//             'W3'
//         ]
//     },
//     R2: {
//         type: 'room',
//         units: [
//             {
//                 type: 'D',
//                 distance: 0
//             },
//             {
//                 type: 'C',
//                 distance: 0
//             }
//         ],
//         capacity: 2,
//         neighbors: [
//             'W2',
//             'W3'
//         ]
//     },
//     W3: {
//         type: 'open',
//         units: [],
//         capacity: 1,
//         neighbors: [
//             'R2',
//             'R3',
//             'W2',
//             'W4'
//         ]
//     },
//     R3: {
//         type: 'room',
//         units: [
//             {
//                 type: 'C',
//                 distance: 0
//             },
//             {
//                 type: 'B',
//                 distance: 0
//             }
//         ],
//         capacity: 2,
//         neighbors: [
//             'W3',
//             'W4'
//         ]
//     },
//     W4: {
//         type: 'open',
//         units: [],
//         capacity: 1,
//         neighbors: [
//             'R3',
//             'R4',
//             'W5'
//         ]
//     },
//     R4: {
//         type: 'room',
//         units: [
//             {
//                 type: 'A',
//                 distance: 0
//             },
//             {
//                 type: 'D',
//                 distance: 0
//             }
//         ],
//         capacity: 2,
//         neighbors: [
//             'W4',
//             'W5'
//         ]
//     },
//     W5: {
//         type: 'open',
//         units: [],
//         capacity: 2,
//         neighbors: [
//             'R4',
//             'W4',
//         ]
//     }
// };

const state = {
    W1: {
        type: 'open',
        units: [],
        capacity: 2,
        neighbors: [
            'R1',
            'W2'
        ]
    },
    RA: {
        type: 'A',
        units: [
            {
                type: 'A',
                distance: 0
            },
            {
                type: 'A',
                distance: 0
            },
        ],
        capacity: 2,
        neighbors: [
            'W1',
            'W2'
        ]
    },
    W2: {
        type: 'open',
        units: [],
        capacity: 1,
        neighbors: [
            'R1',
            'R2',
            'W1',
            'W3'
        ]
    },
    RB: {
        type: 'B',
        units: [
            {
                type: 'B',
                distance: 0
            },
            {
                type: 'B',
                distance: 0,
            }
        ],
        capacity: 2,
        neighbors: [
            'W2',
            'W3'
        ]
    },
    W3: {
        type: 'open',
        units: [],
        capacity: 1,
        neighbors: [
            'R2',
            'R3',
            'W2',
            'W4'
        ]
    },
    RC: {
        type: 'C',
        units: [
            {
                type: 'C',
                distance: 0
            },
            {
                type: 'D',
                distance: 0
            }
        ],
        capacity: 2,
        neighbors: [
            'W3',
            'W4'
        ]
    },
    W4: {
        type: 'open',
        units: [],
        capacity: 1,
        neighbors: [
            'R3',
            'R4',
            'W5'
        ]
    },
    RD: {
        type: 'D',
        units: [
            {
                type: 'D',
                distance: 0
            },
            {
                type: 'C',
                distance: 0
            }
        ],
        capacity: 2,
        neighbors: [
            'W4',
            'W5'
        ]
    },
    W5: {
        type: 'open',
        units: [],
        capacity: 2,
        neighbors: [
            'R4',
            'W4',
        ]
    }
};

const hash = (state) => JSON.stringify(
    Object.entries(state).reduce(
        (simplified, [name, node]) => ({
            ...simplified,
            [name]: node.units.map(unit => unit.type)
        })
    )
);

const memoize = (callback) => {
    const memo = {};
    return (...args) => {
        const key = hash(...args);
        return memo.hasOwnProperty(key) ?
            memo[key] :
            memo[key] = callback(...args);
    };
};

const isFinished = (state) => Object.keys(state)
    .filter(nodeName => nodeName.match(/R\d/))
    .every(nodeName => {
        const room = state[nodeName];
        const correctUnits = room.units.filter(
            unit => unit.type === room.type
        );
        return correctUnits.length === room.capacity;
    });

const energyUsed = (state) => Object.values(state).reduce(
    (sum, node) => node.units.reduce(
        (sum, unit) => sum + unit.distance * energyCost[unit.type],
        sum
    ),
    0
);

const getPossibleMoves = (state) => {
    const froms = Object.keys(state).filter(roomName => state[roomName].units.length > 0);
    const tos = Object.keys(state).filter(toName =>
        froms.some(fromName => state[fromName].neighbors.includes(toName)) &&
        state[toName].units.length < state[toName].capacity
    );

    const moves = froms.reduce(
        (moves, from) => {
            if (state[from].units.every(unit => unit.type === state[from].type)) {
                return moves;
            }
            return tos.reduce(
                (moves, to) => {
                    if (from.match(/W\d/) && to.match(/W\d/)) {
                        return moves;
                    }
                    const fromUnits = state[from].units;
                    const unit = fromUnits[fromUnits.length - 1];
                    if (
                        state[from].neighbors.includes(to) && (
                            state[to].type === 'open' ||
                            state[to].type === unit.type
                        )
                    ) {
                        moves.push({ from, to });
                    }
                    return moves;
                },
                moves
            );
        },
        []
    );

    return moves;
};

const doMove = (state, { from, to }) => {
    const fromUnits = state[from].units;
    const unit = { ...fromUnits[fromUnits.length - 1] };
    unit.distance += 2;

    return {
        ...state,
        [from]: {
            ...state[from],
            units: state[from].units.slice(0, -1)
        },
        [to]: {
            ...state[to],
            units: [...state[to].units, unit] // TODO: if there already is a unit its distance needs to be increased
        }
    };
};

const findSolution = (state) => {
    // const key = hash(state);
    // if (visitedStates[key]) {
    //     return Infinity;
    // }
    // visitedStates = { ...visitedStates, [key]: true };

    if (isFinished(state)) {
        return energyUsed(state);
    }

    const moves = getPossibleMoves(state);
    if (moves.length === 0) {
        return Infinity;
    }

    // console.log(moves);

    return moves.reduce(
        (min, move) => {
            const energy = findSolution(doMove(state, move));
            console.log("E", energy);
            return Math.min(min, energy);
        },
        Infinity
    );
};



console.log(doMove(state, { from: 'RC', to: 'W3' }));

// console.log(isFinished(state));

// console.log("X", findSolution(state));

// console.log(isFinished(doMove(state, { from: 'W2', to: 'R2' })));