const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const scanners = input.split('\n\n').map(
    scannerInput => scannerInput
        .trim()
        .split('\n')
        .slice(1)
        .map(
            beaconInput => beaconInput.trim().split(',').map(Number)
        )
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

const subtract = (a, b) => a.map((_, index) => a[index] - b[index]);
const equals = (a, b) => a.every((_, index) => a[index] === b[index]);
const turn = (matrix) => matrix.map(([x, y, z]) => [-y, x, z]);
const roll = (matrix) => matrix.map(([x, y, z]) => [x, z, -y]);

const rotationSequence = [
    roll, turn, turn, turn,
    roll, turn, turn, turn,
    roll, turn, turn, turn,
    (matrix) => roll(turn(roll(matrix))),
    roll, turn, turn, turn,
    roll, turn, turn, turn,
    roll, turn, turn,
];

const overlay = (a, b) => [
    ...a,
    ...b.filter(
        beaconB => a.every(beaconA => !equals(beaconA, beaconB))
    )
];

const alignTo = memoize((to, scanner) => {

    const rotations = rotationSequence.reduce(
        (matrixes, action) => [
            ...matrixes,
            action(matrixes[matrixes.length - 1])
        ],
        [scanner]
    );

    const transformations = rotations.reduce(
        (transformations, rotation) => to.reduce(
            (transformations, toBeacon) =>
                rotation.reduce(
                    (translations, fromBeacon) => {
                        const delta = subtract(fromBeacon, toBeacon);
                        const translation = rotation.reduce(
                            (translation, beacon) => {
                                const position = subtract(beacon, delta);
                                translation.map.push(position);
                                return translation;
                            },
                            { delta, map: [] }
                        );
                        translations.push(translation);
                        return translations
                    },
                    transformations
                ),
            transformations
        ),
        []
    );

    const sparseTo = to.reduce((quickTo, position) => {
        quickTo[JSON.stringify(position)] = true;
        return quickTo;
    }, {});

    const transformation = transformations.find(transformation => {
        let count = 0;
        for (let i = 0; i < transformation.map.length; i++) {
            const position = transformation.map[i];
            if (sparseTo[JSON.stringify(position)]) {
                count++;
            }
            if (count >= 12) {
                return true;
            }
        }
        return false;
    });

    return transformation;
});

const aligned = scanners.slice(0, 1);
const toAlign = scanners.slice(1);
const positions = [[0, 0, 0]];
for (let i = 0; i < toAlign.length; i++) {
    const scanner = toAlign[i];
    const match = aligned.reduce(
        (match, other) => match ?? alignTo(other, scanner),
        null
    );
    if (match) {
        toAlign.splice(i, 1);
        aligned.push(match.map);
        positions.push(match.delta);
        i = -1;
    }
}

const overlayed = aligned.reduce(overlay);

const answerPart1 = overlayed.length;
const answerPart2 = positions.reduce(
    (max, a) => positions.reduce(
        (max, b) => Math.max(
            max,
            a[0] + a[1] + a[2] - b[0] - b[1] - b[2]
        ),
        max
    ),
    -Infinity
);

console.log(`Answer Part 1: ${answerPart1}`);
console.log(`Answer Part 2: ${answerPart2}`);