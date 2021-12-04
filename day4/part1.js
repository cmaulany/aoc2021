const fs = require('fs');
const path = require('path');

// const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
const input = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;

const [rawNumbers, ...rawBoards] = input.split('\n\n');

const numbers = rawNumbers.split(',').map(n => Number(n));

const boards = rawBoards.map(
    rawBoard => rawBoard
        .split('\n')
        .map(
            line => line
                .trim()
                .split(/\ +/)
                .map(n => Number(n))
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
    const victoriousBoard = currentBoards.find(boardHasWon);

    if (victoriousBoard) {
        const answer = sumBoard(victoriousBoard) * number;
        console.log(`Answer: ${answer}`);
        break;
    }
}