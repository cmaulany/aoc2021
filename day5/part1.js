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
    })
    .filter(line =>
        line.start.x === line.end.x ||
        line.start.y === line.end.y
    );

const addVent = (grid, { x, y }) => {
    const key = `${x},${y}`;
    grid[key] = (grid[key] ?? 0) + 1;

    return grid;
};

const addLine = (grid, line) => {
    const minX = Math.min(line.start.x, line.end.x);
    const maxX = Math.max(line.start.x, line.end.x);
    const minY = Math.min(line.start.y, line.end.y);
    const maxY = Math.max(line.start.y, line.end.y);

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            grid = addVent(grid, { x, y });
        }
    }
    
    return grid;
};

const grid = lines.reduce(addLine, {});

const answer = Object.values(grid).filter(position => position >= 2).length;
console.log(`Answer: ${answer}`);