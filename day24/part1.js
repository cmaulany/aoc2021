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
for (let end = 1; end < instructions.length; end++) {
    const instruction = instructions[end];
    if (instruction[0] === 'inp' || end === instructions.length) {
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

let i = 0;
const solve = (alus, sequence = [], memory = {}) => {
    if (i++ % 1000000 === 0) {
        console.log(sequence.join(''));
    }

    if (alus.length === 0) {
        return memory.z === 0 ?
            sequence : null;
    }

    const alu = alus[0];

    for (let n = 9; n > 0; n--) {
        alu.setMemory(memory);
        const result = alu.run(n);
        const seq = solve(alus.slice(1), [...sequence, n], result);

        if (seq) {
            return seq;
        }
    }
};

const sequence = solve(alus);
console.log(sequence.join(''));


// // last number is irrelevant
// let prevMin = 0;
// let prevMax = 0;
// for (let a = 0; a < alus.length; a++) {
//     const min = prevMin;
//     const max = prevMax;

//     prevMin = Infinity;
//     prevMax = -Infinity;
//     console.log({ prevMin, prevMax });

//     let hasMatch = false;
//     const alu = alus[a];
//     for (let n = 9; n > 0; n--) {
//         for (let z = 0; z < 100000; z++) {
//             alu.reset({ z });
//             const result = alu.run(n);
//             if (result.z >= min && result.z <= max) {
//                 hasMatch = true;
//                 console.log(`Alu ${a}`, n, z);
//                 prevMin = Math.min(prevMin, z);
//                 prevMax = Math.max(prevMax, z);
//             }
//         }
//     }
//     if (!hasMatch) {
//         console.log("Could not find match for " + a);
//         break;
//     }
// }


// console.log("Test");

// const getPreviousZs = (alu, z, range = { min: 0, max: 100000 }) => {
//     for (let n = 9; n > 0; n--) {
//         for (let z = 0; z < 100000; z++) {
//             alu.reset({ z });
//             const result = alu.run(n);
//             if (result.z >= min && result.z <= max) {
//                 hasMatch = true;
//                 console.log(`Alu ${a}`, n, z);
//                 prevMin = Math.min(prevMin, z);
//                 prevMax = Math.max(prevMax, z);
//             }
//         }
//     }
// }


// // 2nd to last number is irrelevant
// alu = alus[1];
// for (let n = 9; n > 0; n--) {
//     for (let z = 0; z < 100000; z++) {
//         alu.reset({ z });
//         const result = alu.run(n);
//         if (result.z === 15) {
//             console.log(n, z);
//         }
//     }
// }

// // irrelevant, should be 10737
// alu = alus[2];
// for (let n = 9; n > 0; n--) {
//     for (let z = 0; z < 100000; z++) {
//         alu.reset({ z });
//         const result = alu.run(n);
//         if (result.z === 412) {
//             console.log(n, z);
//         }
//     }
// }

// alu = alus[3];
// for (let n = 9; n > 0; n--) {
//     for (let z = 0; z < 100000; z++) {
//         alu.reset({ z });
//         const result = alu.run(n);
//         if (result.z >= 10729 && result.z <= 10737) {
//             console.log(n, z);
//         }
//     }
// }

// alu = alus[4];
// for (let n = 9; n > 0; n--) {
//     for (let z = 0; z < 100000; z++) {
//         alu.reset({ z });
//         const result = alu.run(n);
//         if (result.z >= 412 && result.z <= 412) {
//             console.log(n, z);
//         }
//     }
// }

// alu = alus[5];
// for (let n = 9; n > 0; n--) {
//     for (let z = 0; z < 100000; z++) {
//         alu.reset({ z });
//         const result = alu.run(n);
//         if (result.z >= 10721 && result.z <= 10729) {
//             console.log(5, n, z);
//         }
//     }
// }
// console.log("none");

// let lastStates = [{ z: 0 }];
// for (let i = 0; i < alus.length; i++) {
//     for (let j = 0; j < lastStates.length; j++) {
//         const states = findSourceStates(alus[i], lastStates[j].z);
//         if (states.length > 0) {
//             lastStates = states;
//             console.log("===", lastStates[j].n);
//             break;
//         }
//     }
//     console.log("Couldn't find for ", i);
// }


// for (let n = 99999999999999; n >= 11111111111111; n--) {
//     // if (n % 100000 === 0) {
//     //     console.log("C:", n);
//     // }
//     if (n.toString().includes('0')) {
//         continue;
//     }
//     const args = n.toString().split('').map(Number);

//     // console.log(args);
//     // console.log(result);
//     const result = createAlu(instructions).run(...args);
//     if (result.z === 0) {
//         console.log(args.join(''));
//     }
// }