const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const steps = input
    .split('\n')
    .map(line => {
        const [action, ...rangesInput] = line.split(/\ |,/);
        const [x, y, z] = rangesInput.map(range => {
            [dimension, min, max] = range.match(/(\w)=(-?\d+)..(-?\d+)/).slice(1);
            return {
                min: Number(min),
                max: Number(max)
            };
        });

        return { action, x, y, z };
    })
    .filter(({ x, y, z }) => {
        const size = 50;
        return (
            x.max >= -size &&
            x.min <= size &&
            y.max >= -size &&
            y.min <= size &&
            z.max >= -size &&
            z.min <= size
        );
    });

const forRegion = (cubes, region, callback) => {
    for (let x = region.x.min; x <= region.x.max; x++) {
        for (let y = region.y.min; y <= region.y.max; y++) {
            for (let z = region.z.min; z <= region.z.max; z++) {
                const key = `${x},${y},${z}`;
                const value = cubes[key] === true;
                callback(value, key, { x, y, z });
            }
        }
    }
}

const doStep = (cubes, step) => {
    cubes = { ...cubes };
    forRegion(cubes, step, (_, key) => {
        if (step.action === 'on') {
            cubes[key] = true;
        } else {
            delete cubes[key];
        }
    });
    return cubes;
};

const countRegion = (cubes, region) => {
    let sum = 0;
    forRegion(cubes, region, (value) => {
        if (value) {
            sum++;
        }
    });
    return sum;
};

const cubes = steps.reduce(doStep, {});

console.log(countRegion(
    cubes,
    {
        x: { min: -50, max: 50 },
        y: { min: -50, max: 50 },
        z: { min: -50, max: 50 },
    }
));

