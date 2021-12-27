const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const instructions = input.split('\n').map(line => {
    const [op, aInput, bInput] = line.trim().split(' ');
    const a = aInput.match(/-?\d+/) ? Number(aInput) : aInput;
    const b = bInput?.match(/-?\d+/) ? Number(bInput) : bInput;

    return [op, a, b];
});

const partialInstructions = [];
let start = 0;
for (let end = 1; end <= instructions.length; end++) {
    const instruction = instructions[end];
    if (instruction?.[0] === 'inp' || end === instructions.length) {
        partialInstructions.push(instructions.slice(start, end));
        start = end;
    }
}

const createAlu = (instructions) => {
    const memory = {
        w: 0,
        x: 0,
        y: 0,
        z: 0
    };

    const setMemory = (memo) => Object.keys(memo).forEach(
        key => memory[key] = memo[key]
    );

    const run = (...inputs) => {
        let i = 0;
        instructions.forEach(([op, a, b]) => {
            const bValue = typeof b === 'number' ? b : memory[b];
            switch (op) {
                case 'inp':
                    memory[a] = inputs[i++];
                    // console.log("z", i, memory);
                    break;
                case 'add':
                    memory[a] += bValue;
                    break;
                case 'mul':
                    memory[a] *= bValue;
                    break;
                case 'div':
                    memory[a] = Math.trunc(memory[a] / bValue);
                    break;
                case 'mod':
                    memory[a] %= bValue;
                    break;
                case 'eql':
                    memory[a] = memory[a] === bValue ? 1 : 0;
                    break;
            }
        });
        return { ...memory };
    };

    return {
        run,
        setMemory
    };
}

const alus = partialInstructions.map(createAlu);
// some zero..
// const answer = [9, 26, 9, 24, 9, 16, 9, 2, 6, 9, 6, 2, 9, 9];

for (let a = -30; a <= 60; a++) {
    const answer = [
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        2,
        a
    ];
    const memory = alus.slice(0, answer.length).reduce((memory, alu, i) => {
        alu.setMemory(memory);
        return alu.run(answer[i])
    }, { z: 0 });
    console.log(a, memory.z);
}
// const alu = createAlu(instructions);
// const answer = alu.run(...zero);
// console.log(answer);

// console.log(partialInstructions.length);