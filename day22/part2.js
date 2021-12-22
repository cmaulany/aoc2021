const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const steps = input
    .split('\n')
    .map(line => {
        const [action, ...rangesInput] = line.split(/\ |,/);

        return rangesInput.reduce(
            (step, rangeInput) => {
                const [axis, min, max] = rangeInput.match(/(\w)=(-?\d+)..(-?\d+)/).slice(1);
                step[axis] = {
                    min: Number(min),
                    max: Number(max)
                };
                return step;
            },
            { action }
        );
    });

const slice = (region, axis, offset) => {
    if (!region) {
        return [undefined, undefined];
    }

    if (region[axis].min > offset) {
        return [undefined, region];
    }

    if (region[axis].max < offset) {
        return [region, undefined];
    }

    const before = {
        ...region,
        [axis]: {
            min: region[axis].min,
            max: Math.floor(offset)
        },
    };

    const after = {
        ...region,
        [axis]: {
            min: Math.ceil(offset),
            max: region[axis].max
        },
    };

    return [before, after];
};

const addRegion = (regions, region) => [...removeRegion(regions, region), region];

const removeRegion = (regions, region) => regions.reduce(
    (regions, other) => {
        regions.push(...subtract(other, region));
        return regions;
    },
    []
);

const subtract = (a, b, axes = Object.keys(b)) => {
    const axis = axes[0];

    const [before, overlapAndAfter] = slice(a, axis, b[axis].min - 0.5);
    const [overlap, after] = slice(overlapAndAfter, axis, b[axis].max + 0.5);

    const regions = [];
    if (before) {
        regions.push(before);
    }

    if (after) {
        regions.push(after);
    }

    if (overlap && axes.length > 1) {
        const remainingAxes = axes.filter(other => other !== axis);
        regions.push(...subtract(overlap, b, remainingAxes));
    }

    return merge(regions);
};

const mergePair = (a, b) => {
    const axes = Object.keys(a);
    const unequalDimensions = axes.filter(axis =>
        a[axis].min !== b[axis].min ||
        a[axis].max !== b[axis].max
    );

    const axis = unequalDimensions[0];
    if (
        unequalDimensions.length !== 1 ||
        [
            b[axis].min,
            b[axis].max
        ].every(extreme =>
            extreme < a[axis].min - 1 ||
            extreme > a[axis].max + 1
        )
    ) {
        return [a, b];
    }

    return [{
        ...a,
        [axis]: {
            min: Math.min(a[axis].min, b[axis].min),
            max: Math.max(a[axis].max, b[axis].max)
        }
    }];
};

const merge = (regions) => {
    let previousLength;
    do {
        previousLength = regions.length;

        const newRegions = []
        for (let i = 0; i < regions.length; i++) {
            const region = regions[i];

            let isMerged = false;
            for (let j = i + 1; j < regions.length; j++) {
                const other = regions[j];
                const merged = mergePair(region, other);
                if (merged.length === 1) {
                    newRegions.push(merged[0]);
                    regions.splice(j, 1);
                    isMerged = true;
                    break;
                }
            }

            if (!isMerged) {
                newRegions.push(region);
            }
        }

        regions = newRegions;
    } while (previousLength > regions.length)

    return regions;
}

const toVolume = (region) => Object.values(region)
    .map(({ min, max }) => max - min + 1)
    .reduce((volume, length) => volume * length);

const doStep = (regions, step) => {
    const region = {
        x: step.x,
        y: step.y,
        z: step.z
    };

    return step.action === 'on' ?
        addRegion(regions, region) :
        removeRegion(regions, region);
};

const regions = steps.reduce(doStep, [])
const answer = regions.map(toVolume).reduce((sum, volume) => sum + volume);
console.log(`Answer: ${answer}`);