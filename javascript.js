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
        const boardWithCellValues = gameboard.map((row) =>
            row.map((cell) => cell.getValue())
        );
        console.log(boardWithCellValues);
    };

    const placeToken = (row, column, playerToken) => {
        const cell = gameboard[row][column];
        if (cell.getValue() === 0) {
            cell.setValue(playerToken);
            totalMoves++;
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
            if (gameboard[i][i].getValue() !== playerToken) {
                break;
            } else if (i === ROWS - 1) {
                return true;
            }
        }
        // check reverse diagonal
        let reverseDiagonalColumn = 0;
        for (let i = ROWS - 1; i < 0; i--) {
            if (gameboard[i][reverseDiagonalColumn++].getValue() !== playerToken) {
                break;
            } else if (i === 0) {
                return true;
            }
        }
        return false;
    };

    const verifyTie = () => {
        return totalMoves === ROWS.toExponential(2) ? true : false;
    };

    return { printGameboard, placeToken, verifyWinner, verifyTie };
}

const gameController = (function (
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const players = [
        {
            name: playerOneName,
            token: 1,
        },
        {
            name: playerTwoName,
            token: 2,
        },
    ];

    let activePlayer = players[0];
    const switchActivePlayer = () => {
        activePlayer =
            activePlayer === players[0]
                ? players[1]
                : players[0];
    };
    const getActivePlayer = () => activePlayer;

    let gameboard;
    const playRound = (row, column) => {
        // instantiate board if first round
        if (gameboard === undefined) {
            gameboard = createGameboard();
        }
        // place token
        gameboard.placeToken(row, column, getActivePlayer().token);
        // verify winner + tie
        console.log(`winner: ${gameboard.verifyWinner(getActivePlayer().token)}`);
        console.log(`tie: ${gameboard.verifyTie(getActivePlayer().token)}`);
        switchActivePlayer();
    };    

    return { getActivePlayer,  playRound };
})();

// debug
let test = createGameboard();
test.printGameboard();
test.verifyWinner(2);
