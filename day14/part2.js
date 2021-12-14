const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const [first, _, ...rest] = input.split('\n');
const template = first.trim();
const rules = rest.reduce((rules, rule) => {
    const [from, insert] = rule.trim().split(' -> ');
    rules[from] = insert;
    return rules;
}, {});

const memoize = (callback) => {
    const memo = {};
    return (...args) => {
        const key = JSON.stringify(args);
        if (memo.hasOwnProperty(key)) {
            return memo[key];
        }
        const result = callback(...args);
        memo[key] = result;
        return result;
    };
};

function countChars(str) {
    return str.split('').reduce((count, char) => {
        count[char] = (count[char] ?? 0) + 1;
        return count;
    }, {})
}

const growAndCount = memoize(function (template, steps = 1) {
    if (steps <= 0) {
        return countChars(template);
    }

    if (template.length === 2) {
        const insert = rules[template];
        return insert ?
            growAndCount(template[0] + insert + template[1], steps - 1) :
            countChars(template);
    }

    const middle = Math.ceil(template.length / 2);

    const left = template.slice(0, middle);
    const right = template.slice(middle - 1);

    const leftCount = growAndCount(left, steps)
    const rightCount = growAndCount(right, steps);

    const count = [
        ...Object.entries(leftCount),
        ...Object.entries(rightCount)
    ].reduce(
        (count, [char, n]) => {
            count[char] = (count[char] ?? 0) + n;
            return count;
        },
        {}
    );

    count[right[0]]--;

    return count;
});

const count = growAndCount(template, 40);

const min = Object.values(count).reduce((min, n) => Math.min(min, n));
const max = Object.values(count).reduce((max, n) => Math.max(max, n));

const answer = max - min;
console.log(`Answer: ${answer}`);