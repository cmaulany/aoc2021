const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const map = input.split('\n').map(line => line.trim().split('').map(Number));

const getNeighbors = (map, { x, y }) =>
    [
        { x: +1, y: 0 },
        { x: +1, y: +1 },
        { x: 0, y: +1 },
        { x: -1, y: +1 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: +1, y: -1 }
    ]
        .map(delta => ({
            x: delta.x + x,
            y: delta.y + y
        }))
        .filter(({ x, y }) =>
            x >= 0 && x < map[0].length &&
            y >= 0 && y < map.length
        );

const tick = (state) => {
    const {
        map,
        flashCount
    } = state;
    
    let nextMap = map.map(
        row => row.map(
            energyLevel => energyLevel + 1
        )
    );

    const flashPositions = nextMap.reduce(
        (flashPosition, row, y) => row.reduce(
            (flashPositions, _, x) =>
                nextMap[y][x] > 9 ?
                    [...flashPositions, { x, y }] :
                    flashPositions,
            flashPosition
        ),
        []
    );
    nextMap = flashPositions.reduce(flash, nextMap);

    const flashes = nextMap.reduce(
        (flashCount, row, y) => row.reduce(
            (flashCount, _, x) =>
                nextMap[y][x] > 9 ?
                    flashCount + 1 :
                    flashCount,
            flashCount
        ),
        0
    );

    nextMap = nextMap.map(
        row => row.map(
            energyLevel => energyLevel > 9 ? 0 : energyLevel
        )
    );

    return {
        map: nextMap,
        flashCount: flashCount + flashes
    };
};

const flash = (map, position) => {
    const neighbors = getNeighbors(map, position);
    return neighbors.reduce((map, neighbor) => {
        const newEnergyLevel = ++map[neighbor.y][neighbor.x];
        if (newEnergyLevel === 10) {
            map = flash(map, neighbor);
        }
        return map;
    }, map);
};

const initialState = {
    map,
    flashCount: 0
};

let state = initialState;
for (let step = 0; step < 100; step++) {
    state = tick(state);
}

const answer = state.flashCount;
console.log(`Answer: ${answer}`);