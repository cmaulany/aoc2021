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
};

const doStep = (cubes, step) => {
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

const regionSize = 50;
const region = {
    x: { min: -regionSize, max: regionSize },
    y: { min: -regionSize, max: regionSize },
    z: { min: -regionSize, max: regionSize },
};

const relevantSteps = steps.filter(({ x, y, z }) => {
    return (
        x.max >= region.x.min &&
        x.min <= region.x.max &&
        y.max >= region.y.min &&
        y.min <= region.y.max &&
        z.max >= region.z.min &&
        z.min <= region.z.max
    );
});

const cubes = relevantSteps.reduce(doStep, {});

const answer = countRegion(cubes, region);
console.log(`Answer: ${answer}`);