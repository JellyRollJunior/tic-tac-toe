function createBoardCell() {
    let value = 0;

    const getValue = () => value;

    const setValue = (playerToken) => {
        value = playerToken;
    };

    return { getValue, setValue };
}

function createGameboard() {
    let gameboard = [];
    const ROWS = 3;
    const COLUMNS = 3;
    let totalMoves = 0;

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
        if (cell.getValue() === 0) {
            cell.setValue(playerToken);
        } else {
            return;
        }
    };

    const verifyWinner = (playerToken) => {
        // check row for win
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                if (gameboard[i][j].getValue() !== playerToken) {
                    break;
                } else if (j === COLUMNS - 1) {
                    return true;
                }
            }
        }
        // check columns for win
        for (let i = 0; i < COLUMNS; i++) {
            for (let j = 0; i < ROWS; j++) {
                if (gameboard[j][i].getValue() !== playerToken) {
                    break;
                } else if (i === ROWS - 1) {
                    return true;
                }
            }
        }
        // check diagonal for win
        for (let i = 0; i < ROWS; i++) {
            if (gameboard[i][i] !== playerToken) {
                break;
            } else if (i === ROWS - 1) {
                return true;
            }
        }
        // check reverse diagonal
        let reverseDiagonalColumn = 0;
        for (let i = ROWS - 1; i < 0; i--) {
            if (gameboard[i][reverseDiagonalColumn++] !== playerToken) {
                break;
            } else if (i === 0) {
                return true;
            }
        }
        return false;
    }

    const verifyTie = () => {
        return totalMoves === ROWS.toExponential(2) ? true : false;
    }

    return { printGameboard, placeToken , verifyWinner};
}

let test = createGameboard();
test.placeToken(0, 0, 2);
test.verifyWinner(2);