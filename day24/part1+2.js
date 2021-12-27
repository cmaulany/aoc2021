const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const instructions = input.split('\n').map(line => {
    const [op, aInput, bInput] = line.trim().split(' ');
    const a = aInput.match(/-?\d+/) ? Number(aInput) : aInput;
    const b = bInput?.match(/-?\d+/) ? Number(bInput) : bInput;

    return [op, a, b];
});

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
};

const generateSerial = (n0, n1, n2, n3, n4, n6, n9) => {
    const n5 = n4 + 8 - 1;
    const n7 = n6 + 9 - 16;
    const n8 = n3 + 6 - 8;
    const n10 = n9 + 13 - 16;
    const n11 = n2 + 5 - 13;
    const n12 = n1 + 11 - 6;
    const n13 = n0 + 6 - 6;

    return [
        n0, n1, n2, n3, n4, n5, n6,
        n7, n8, n9, n10, n11, n12, n13
    ].join('');
}

const isValidSerial = (serial) => {
    const asArray = serial.split('').map(Number);
    return (
        asArray.every(n => n >= 1 && n <= 9) &&
        createAlu(instructions).run(...asArray).z === 0
    );
}

for (let n = 9999999; n >= 1111111; n--) {
    const asString = n.toString();
    if (asString.includes('0')) {
        continue;
    }
    const asArray = asString.split('').map(Number);
    const serial = generateSerial(...asArray);

    if (isValidSerial(serial)) {
        console.log(`Answer Part 1: ${serial}`);
        break;
    }
}

for (let n = 1111111; n <= 9999999; n++) {
    const asString = n.toString();
    if (asString.includes('0')) {
        continue;
    }
    const asArray = asString.split('').map(Number);
    const serial = generateSerial(...asArray);

    if (isValidSerial(serial)) {
        console.log(`Answer Part 2: ${serial}`);
        break;
    }
}