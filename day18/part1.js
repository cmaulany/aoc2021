const fs = require('fs');
const path = require('path');

// const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const input = `[[[[[9,8],1],2],3],4]`;
const number = JSON.parse(input);
console.log(number);

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

            const [match, x, y] = number.slice(i).match(/(\d+),(\d+)/);

            const left = number.slice(0, i - 1);
            const leftMatch = left.match(/(\d+),*\[*$/);
            const newLeft = leftMatch ?
                left.slice(0, leftMatch.index) + (Number(leftMatch[1]) + Number(x)) +
                left.slice(leftMatch.index + leftMatch[1].length) :
                left;

            const right = number.slice(i + match.length + 1)
            const rightMatch = right.match(/\d+/);
            const newRight = rightMatch ?
                right.slice(0, rightMatch.index) + (Number(rightMatch[0]) + Number(y)) +
                right.slice(rightMatch.index + rightMatch[0].length) :
                right;

            number = `${newLeft}0${newRight}`;
            return number;
            // console.log("N", number);
        }
    }
    return number;
}

reduce(input);


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