const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

function* deterministicDice() {
    for (let i = 0; true; i++) {
        yield i % 100 + 1;
    }
}

const players = input.split('\n').map(line => {
    const startPosition = Number(line.trim().match(/\ (\d+)$/)[1]) - 1;
    return {
        position: startPosition,
        score: 0
    };
});

const dice = deterministicDice();
const boardSize = 10;

let nextPlayer = 0;
let rollCount = 0;
while (players.every(player => player.score < 1000)) {
    const player = players[nextPlayer];
    const rolls = [dice.next().value, dice.next().value, dice.next().value];
    rollCount += 3;

    const sum = rolls.reduce((sum, roll) => sum + roll);
    const position = (player.position + sum) % boardSize;

    player.position = position;
    player.score += position + 1;

    nextPlayer = (nextPlayer + 1) % players.length;
}

const loser = players.find(player => player.score < 1000);
const answer = loser.score * rollCount;
console.log(`Answer: ${answer}`);