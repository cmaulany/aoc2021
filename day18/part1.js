const fs = require('fs');
const path = require('path');

// const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const input = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;

const numbers = input.split('\n').map(line => line.trim());

const add = (a, b) => reduce(`[${a},${b}]`);

function reduce(number) {
    const stack = [];
    for (let i = 0; i < number.length; i++) {
        char = number[i];
        if (char === '[') {
            stack.push(char);
        }
        else if (char === ']') {
            stack.pop();
        }
        else if (stack.length === 5) {
            stack.pop();

            console.log("Exploding", i);
            const [match, x, y] = number.slice(i).match(/(\d+),(\d+)/);

            const left = number.slice(0, i - 1);
            const leftMatch = left.match(/(\d+),*\[*$/);
            let newLeft = left;
            if (leftMatch) {
                const newNumber = Number(leftMatch[1]) + Number(x);
                const newValue = newNumber > 9 ?
                    `[${Math.floor(newNumber / 2)},${Math.ceil(newNumber / 2)}]` :
                    newNumber;
                newLeft = leftMatch ?
                    left.slice(0, leftMatch.index) + newValue +
                    left.slice(leftMatch.index + leftMatch[1].length) :
                    left;
            }

            const right = number.slice(i + match.length + 1)
            const rightMatch = right.match(/\d+/);
            let newRight = right;
            if (rightMatch) {
                const newNumber = Number(rightMatch[0]) + Number(y);
                const newValue = newNumber > 9 ?
                    `[${Math.floor(newNumber / 2)},${Math.ceil(newNumber / 2)}]` :
                    newNumber;
                newRight = rightMatch ?
                    right.slice(0, rightMatch.index) + newValue +
                    right.slice(rightMatch.index + rightMatch[0].length) :
                    right;
            }


            number = `${newLeft}0${newRight}`;
            i = newLeft.length;
        }
    }
    return number;
}

const getMagnitude = (number) => {
    if (typeof number === 'string') {
        number = JSON.parse(number);
    }
    if (typeof number === 'number') {
        return number;
    }
    return (
        3 * getMagnitude(number[0]) +
        2 * getMagnitude(number[1])
    );
};

const examples = [
    "[[[[[9,8],1],2],3],4]",
    "[7,[6,[5,[4,[3,2]]]]]",
    "[[6,[5,[4,[3,2]]]],1]",
    "[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]",
    "[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]"
];

examples.forEach(example => {
    const becomes = reduce(example)
    console.log(`${example} becomes ${becomes}`)
});

const a = '[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]'
const b = '[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]';
console.log(add(a, b));

// const sum = numbers.reduce((sum, number) => add(sum, number));
// console.log("Sum", sum);

// console.log(getMagnitude(sum));