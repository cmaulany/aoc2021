const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const [rawNumbers, ...rawBoards] = input.split('\n\n');

const numbers = rawNumbers.split(',').map(n => Number(n));

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

console.log(boards);
return;

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
for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];

    currentBoards = currentBoards.map(board => markNumber(board, number));
    const wonBoard = currentBoards.find(boardHasWon);

    if (wonBoard) {
        const answer = sumBoard(wonBoard) * number;
        console.log(`Answer: ${answer}`);
        break;
    }
}