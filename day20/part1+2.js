const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const [algorithm, imageInput] = input.split('\n\n').map(part => part.trim());
const image = imageInput.split('\n').reduce(
    (image, line, y) => line.trim().split('').reduce(
        (image, char, x) => {
            if (char === '#') {
                image[`${x},${y}`] = true;
            }
            return image;
        },
        image
    ),
    {}
);

const getBounds = (image) => Object.entries(image).reduce(
    (result, [key, value]) => {
        if (!value) {
            return result;
        }
        const [x, y] = key.split(',').map(Number);

        return {
            minX: Math.min(result.minX, x),
            maxX: Math.max(result.maxX, x),
            minY: Math.min(result.minY, y),
            maxY: Math.max(result.maxY, y),
        };
    },
    {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity
    }
);

function imageToString(image) {
    const {
        minX,
        maxX,
        minY,
        maxY
    } = getBounds(image);

    const lines = [];
    for (let y = minY; y <= maxY; y++) {
        const line = [];
        for (let x = minX; x <= maxX; x++) {
            line.push(
                image[`${x},${y}`] ? '#' : '.'
            );
        }
        lines.push(line.join(''));
    }

    return lines.join('\n');
}

const enhance = (algorithm, image, bounds = getBounds(image)) => {
    const {
        minX,
        maxX,
        minY,
        maxY
    } = bounds;

    const newImage = {};
    for (let y = minY - 1; y <= maxY + 1; y++) {
        for (let x = minX - 1; x <= maxX + 1; x++) {
            const bits = [];
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    bits.push(image[`${x + dx},${y + dy}`] ? 1 : 0);
                }
            }
            const index = parseInt(bits.join(''), 2);
            if (algorithm[index] === "#") {
                newImage[`${x},${y}`] = true;
            }
        }
    }

    return newImage;
};

const repeatEnhance = (algorithm, image, times) => {
    const bounds = getBounds(image);
    for (let i = 0; i < times; i++) {
        const offset = times * 2 - i;
        const adjustedBounds = {
            minX: bounds.minX - offset,
            maxX: bounds.maxX + offset,
            minY: bounds.minY - offset,
            maxY: bounds.maxY + offset
        };
        image = enhance(algorithm, image, adjustedBounds);
    }
    return image;
};

const second = repeatEnhance(algorithm, image, 2);
const fiftieth = repeatEnhance(algorithm, image, 50);

const answerPart1 = Object.keys(second).length;
const answerPart2 = Object.keys(fiftieth).length;
console.log(`Answer Part 1: ${answerPart1}`);
console.log(`Answer Part 2: ${answerPart2}`);
