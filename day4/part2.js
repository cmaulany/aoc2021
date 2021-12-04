const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const [rawNumbers, ...rawBoards] = input.split('\n\n');

const numbers = rawNumbers.split(',').map(Number);

const boards = rawBoards.map(
    rawBoard => rawBoard
        .split('\n')
        .map(
            line => line
                .trim()
                .split(/\ +/)
                .map(Number)
        )
);

const markNumber = (board, number) => board.map(
    row => row.map(
        n => n === number ? 'X' : n
    )
);

const boardHasWon = (board) =>
    board.some(row => row.every(number => number === 'X')) ||
    board[0].some((_, index) => board.every(row => row[index] === 'X'));

const sumBoard = (board) => board.reduce(
    (score, row) => row.reduce(
        (score, number) =>
            number !== 'X' ?
                score + number :
                score,
        score
    ),
    0
);

let currentBoards = boards;

for (const number of numbers) {

    currentBoards = currentBoards.map(board => markNumber(board, number));
    const wonBoards = currentBoards.filter(boardHasWon);

    if (
        currentBoards.length === 1 &&
        wonBoards.length === 1
    ) {
        const lastBoard = currentBoards[0];
        const answer = sumBoard(lastBoard) * number;
        console.log(`Answer: ${answer}`);
        break;
    }

    currentBoards = currentBoards.filter(board => !wonBoards.includes(board));
}