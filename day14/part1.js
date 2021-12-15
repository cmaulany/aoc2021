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

function grow (templateArray, rules) {
    for (let i = 0; i < templateArray.length; i++) {
        const pair = templateArray.slice(i, i + 2).join('');
        const insert = rules[pair];
        if (insert) {
            templateArray.splice(i + 1, 0, insert);
            i++;
        }
    }
    return templateArray;
}

let templateArray = template.split('');
for (let i = 0; i < 10; i++) {
    templateArray = grow(templateArray, rules);
}

const count = templateArray.reduce((count, char) => {
    count[char] = (count[char] ?? 0) + 1;
    return count;
}, {})

const min = Object.values(count).reduce((min, n) => Math.min(min, n));
const max = Object.values(count).reduce((max, n) => Math.max(max, n));

const answer = max - min;
console.log(`Answer: ${answer}`);