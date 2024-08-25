function createBoardCell() {
    let value = 0;

    const getValue = () => value;

    const addToken = (playerToken) => {
        value = playerToken;
    };

    return { getValue, addToken };
}

function createGameboard() {
    let gameboard = [];
    const ROWS = 3;
    const COLUMNS = 3;

    // create initial board
    for (let i = 0; i < ROWS; i++) {
        gameboard[i] = [];
        for (let j = 0; j < COLUMNS; j++) {
            gameboard[i].push(createBoardCell());
        }
    }

    const printGameboard = () => {
        const boardWithCellValues = gameboard.map((row) => row.map(cell => cell.getValue()));
        console.log(boardWithCellValues);
    };

    const placeToken = (row, column, playerToken) => {
        const cell = gameboard[row][column];
        // check if cell is occupied
        if (cell.getValue() === 0) {
            cell.addToken(playerToken);
        } else {
            return;
        }
    };

    return { gameboard, printGameboard, placeToken };
}

let testBoard = createGameboard();