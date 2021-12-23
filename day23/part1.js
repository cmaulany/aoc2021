const input = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`

const fs = require('fs');
const path = require('path');

// const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const energyCost = {
    A: 1,
    B: 10,
    C: 100,
    D: 1000
};

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
    R1: {
        type: 'room',
        units: [
            {
                type: 'A',
                distance: 0,
            },
            {
                type: 'B',
                distance: 0
            }
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
    R2: {
        type: 'room',
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
    R3: {
        type: 'room',
        units: [
            {
                type: 'C',
                distance: 0
            },
            {
                type: 'B',
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
    R4: {
        type: 'room',
        units: [
            {
                type: 'A',
                distance: 0
            },
            {
                type: 'D',
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

const setDestinationFors = (state, unitTypeToRoomName) => (
    {
        ...state,
        ...Object.entries(unitTypeToRoomName).reduce(
            (rooms, [unitType, roomName]) => ({
                ...rooms,
                [roomName]: {
                    ...state[roomName],
                    destinationFor: unitType
                }
            }), {}
        )
    }
);

const isFinished = (state) => Object.keys(state)
    .filter(nodeName => nodeName.match(/R\d/))
    .every(nodeName => {
        const room = state[nodeName];
        const correctUnits = room.units.filter(
            unit => unit.type === room.destinationFor
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
        (moves, from) => tos.reduce(
            (moves, to) => [
                ...moves,
                { from, to }
            ],
            moves
        ),
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
    if (isFinished(state)) {
        return state;
    }

    const moves = getPossibleMoves(state);

    return doMove(state, moves[0]);
    // recursively move randomly to rooms. 
    // probably add some memo
    // hopefuly done.
};

console.log(setDestinationFors(state, {
    A: 'R1',
    B: 'R2',
    C: 'R3',
    D: 'R4'
}));

console.log("X", findSolution(state));