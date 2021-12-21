const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const players = input
    .split('\n')
    .map(line => {
        const startPosition = Number(line.trim().match(/\ (\d+)$/)[1]) - 1;
        return {
            position: startPosition,
            score: 0
        };
    });

const memoize = (callback) => {
    const memo = {};
    return (...args) => {
        const key = JSON.stringify(args);
        return memo.hasOwnProperty(key) ?
            memo[key] :
            memo[key] = callback(...args);
    };
};

const sum = (...args) => args
    .map(Object.entries)
    .flat()
    .reduce(
        (sum, [key, value]) => {
            sum[key] = (sum[key] ?? 0) + value;
            return sum;
        }, {}
    );

const getWins = memoize(function (
    players,
    currentPlayer = 0,
    settings = {
        boardSize: 10,
        maxScore: 21,
        diceOutcomes: [1, 2, 3]
    },
    rolls = []
) {
    const winnerIndex = players.findIndex(player => player.score >= settings.maxScore);
    if (winnerIndex >= 0) {
        return {
            [winnerIndex]: 1
        };
    }

    if (rolls.length === 3) {
        const newPlayers = players.map(
            (player, index) => {
                if (index !== currentPlayer) {
                    return player;
                }

                const sum = rolls.reduce((sum, roll) => sum + roll);
                const position = (player.position + sum) % settings.boardSize;
                const score = player.score + position + 1;

                return {
                    ...player,
                    position,
                    score
                };
            }
        );

        const newCurrentPlayer = (currentPlayer + 1) % players.length;
        return getWins(newPlayers, newCurrentPlayer, settings, []);
    }

    return sum(
        ...settings.diceOutcomes.map(
            roll => getWins(players, currentPlayer, settings, [...rolls, roll])
        )
    );
});

const wins = getWins(players);

const answer = Object.values(wins).reduce((answer, n) => Math.max(answer, n))
console.log(`Answer: ${answer}`);