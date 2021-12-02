const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
const commands = input.split('\n').map(line => {
    const [action, value] = line.trim().split(' ');
    return {
        action,
        value: Number(value)
    };
});

function doCommand(position, command) {
    const { action, value } = command;
    switch (action) {
        case 'forward':
            return {
                ...position,
                horizontal: position.horizontal + value
            };
        case 'up':
            return {
                ...position,
                depth: position.depth - value
            }
        case 'down':
            return {
                ...position,
                depth: position.depth + value
            }
        default:
            throw `Unrecognized action: ${action}`;
    }
}

const position = {
    horizontal: 0,
    depth: 0
};

const finalPosition = commands.reduce(doCommand, position);

const answer = finalPosition.horizontal * finalPosition.depth;
console.log(`Answer: ${answer}`);