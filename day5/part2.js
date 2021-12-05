const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const lines = input
    .split('\n')
    .map(line => {
        const [start, end] = line.trim().split(' -> ');
        const [x1, y1] = start.split(',').map(Number);
        const [x2, y2] = end.split(',').map(Number);
        return {
            start: { x: x1, y: y1 },
            end: { x: x2, y: y2 }
        };
    });

const addVent = (grid, { x, y }) => {
    const key = `${x},${y}`;
    grid[key] = (grid[key] ?? 0) + 1;

    return grid;
}

const addLine = (grid, line) => {
    const length = Math.max(
        Math.abs(line.end.x - line.start.x),
        Math.abs(line.end.y - line.start.y)
    );

    const deltaX = (line.end.x - line.start.x) / length;
    const deltaY = (line.end.y - line.start.y) / length;

    for (let i = 0; i <= length; i++) {
        const x = line.start.x + deltaX * i;
        const y = line.start.y + deltaY * i;
        grid = addVent(grid, { x, y });
    }

    return grid;
};

const grid = lines.reduce(addLine, {});

const answer = Object.values(grid).filter(position => position >= 2).length;
console.log(`Answer: ${answer}`);