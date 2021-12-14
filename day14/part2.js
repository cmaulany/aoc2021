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

const countChars = (str) => str.split('').reduce(
    (count, char) => {
        count[char] = (count[char] ?? 0) + 1;
        return count;
    },
    {}
);

const addCounts = (...args) => args
    .map(Object.entries)
    .flat()
    .reduce(
        (count, [char, n]) => {
            count[char] = (count[char] ?? 0) + n;
            return count;
        },
        {}
    );

const growAndCount = memoize(function (template, rules, steps = 1) {
    if (steps <= 0) {
        return countChars(template);
    }

    if (template.length <= 2) {
        const insert = rules[template];
        return insert ?
            growAndCount(template[0] + insert + template[1], rules, steps - 1) :
            countChars(template);
    }

    const middleIndex = Math.floor(template.length / 2);

    const left = template.slice(0, middleIndex + 1);
    const right = template.slice(middleIndex);

    const leftCount = growAndCount(left, rules, steps);
    const rightCount = growAndCount(right, rules, steps);

    const count = addCounts(leftCount, rightCount);

    const overlappingChar = right[0];
    count[overlappingChar]--;

    return count;
});

const count = growAndCount(template, rules, 40);

const min = Object.values(count).reduce((min, n) => Math.min(min, n));
const max = Object.values(count).reduce((max, n) => Math.max(max, n));

const answer = max - min;
console.log(`Answer: ${answer}`);