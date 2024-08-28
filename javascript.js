function createBoardCell() {
    let value = 0;

    const getValue = () => value;

    const setValue = (playerToken) => {
        value = playerToken;
    };

    return { getValue, setValue };
}

function createBoardGame() {
    let board = [];
    const ROWS = 3;
    const COLUMNS = 3;

    // create initial board
    for (let i = 0; i < ROWS; i++) {
        board[i] = [];
        for (let j = 0; j < COLUMNS; j++) {
            board[i].push(createBoardCell());
        }
    }

    const getBoard = () => board;
    const getRows = () => ROWS;
    const getColumns = () => COLUMNS;

    const printBoard = () => {
        const boardWithCellValues = board.map((row) =>
            row.map((cell) => cell.getValue())
        );
        console.log(boardWithCellValues);
    };

    const placeToken = (row, column, playerToken) => {
        const cell = board[row][column];
        if (cell.getValue() === 0) {
            cell.setValue(playerToken);
            totalMoves++;
            return true;
        } else {
            return false;
        }
    };

    const verifyWin = (playerToken) => {
        // check row for win
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                if (board[i][j].getValue() !== playerToken) {
                    break;
                } else if (j === COLUMNS - 1) {
                    return true;
                }
            }
        }
        // check columns for win
        for (let i = 0; i < COLUMNS; i++) {
            for (let j = 0; j < ROWS; j++) {
                if (board[j][i].getValue() !== playerToken) {
                    break;
                } else if (j === ROWS - 1) {
                    return true;
                }
            }
        }
        // check diagonal for win
        for (let i = 0; i < ROWS; i++) {
            if (board[i][i].getValue() !== playerToken) {
                break;
            } else if (i === ROWS - 1) {
                return true;
            }
        }
        // check reverse diagonal
        let reverseDiagonalColumn = 0;
        for (let i = ROWS - 1; i >= 0; i--) {
            if (board[i][reverseDiagonalColumn++].getValue() !== playerToken) {
                break;
            } else if (i === 0) {
                return true;
            }
        }
        return false;
    };

    let totalMoves = 0;
    const verifyTie = () => {
        return totalMoves === ROWS ** 2 ? true : false;
    };

    return {
        getRows,
        getColumns,
        getBoard,
        printBoard,
        placeToken,
        verifyWin,
        verifyTie,
    };
}

const gameStates = Object.freeze({
    ONGOING: Symbol("ongoing"),
    WIN: Symbol("win"),
    TIE: Symbol("tie"),
    INVALID_MOVE: Symbol("invalid move"),
});

const GameController = (function() {
    let players = [
        {
            name: "Player One",
            token: "X",
        },
        {
            name: "Player Two",
            token: "O",
        },
    ];

    let activePlayer = players[0];
    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const setPlayerNames = (playerOneName = "Player One", playerTwoName = "Player Two") => {
        players[0].name = playerOneName;
        players[1].name = playerTwoName;
    }

    let currentGameState = gameStates.ONGOING;
    const getCurrentGameState = () => currentGameState;

    let boardGame = createBoardGame();
    const getBoardGame = () => boardGame;

    const playRound = (row, column) => {
        if (
            currentGameState === gameStates.WIN ||
            currentGameState === gameStates.TIE
        ) {
            console.log("Game has ended! Please restart to play again");
            return;
        }
        const playerToken = getActivePlayer().token;
        if (boardGame.placeToken(row, column, playerToken)) {
            console.log(
                `Dropping ${
                    getActivePlayer().name
                }'s token in Row: ${row} Column: ${column}`
            );
            if (boardGame.verifyWin(playerToken)) {
                console.log(`win: true`);
                currentGameState = gameStates.WIN;
                return;
            } else if (boardGame.verifyTie(playerToken)) {
                console.log(`tie: true`);
                currentGameState = gameStates.TIE;
                return;
            }
            switchActivePlayer();
            printNewRoundMessage();
            currentGameState = gameStates.ONGOING;
        } else {
            console.log(`Please select an unoccupied cell!`);
            currentGameState = gameStates.INVALID_MOVE;
        }
    };

    const printNewRoundMessage = () => {
        boardGame.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    const restartGame = () => {
        boardGame = createBoardGame();
        currentGameState = gameStates.ONGOING;
        if (getActivePlayer() !== players[0]) switchActivePlayer();
    };

    // initial game start message
    printNewRoundMessage();

    return {
        getCurrentGameState,
        getBoardGame,
        getActivePlayer,
        setPlayerNames,
        playRound,
        restartGame,
    };
})();

const DisplayController = (function () {
    const grid = document.querySelector(".grid");
    const activePlayer = document.querySelector(".active-player-name");
    const alert = document.querySelector(".alerts");
    const startButton = document.querySelector(".start");

    const displayGameGrid = () => {
        grid.textContent = "";
        const boardGame = GameController.getBoardGame();
        const board = boardGame.getBoard();
        for (let row = 0; row < boardGame.getRows(); row++) {
            for (let col = 0; col < boardGame.getColumns(); col++) {
                const cellButton = document.createElement("button");
                cellButton.setAttribute("data-row", row);
                cellButton.setAttribute("data-column", col);
                cellButton.textContent =
                    board[row][col].getValue() === 0
                        ? ""
                        : board[row][col].getValue();
                grid.appendChild(cellButton);
            }
        }
    };

    const clickHandlerBoard = (event) => {
        const currentGameState = GameController.getCurrentGameState();
        if (currentGameState === gameStates.WIN || currentGameState == gameStates.TIE) {
            alert.textContent = "Game over! Please restart to play again";
            return;
        }
        const target = event.target;
        GameController.playRound(target.dataset.row, target.dataset.column);
        const roundResult = GameController.getCurrentGameState();
        switch (roundResult) {
            case gameStates.WIN:
                updateScreen();
                alert.textContent = `${
                    GameController.getActivePlayer().name
                } Wins!`;
                break;
            case gameStates.TIE:
                updateScreen();
                alert.textContent = `Both players tie!`;
                break;
            case gameStates.ONGOING:
                updateScreen();
                break;
            case gameStates.INVALID_MOVE:
                alert.textContent = "Please select an unoccupied cell!";
                break;
            default:
                alert.textContent = "Unknown error. Please do not cry";
        }
    };

    const clickHandlerStartButton = () => {
        GameController.restartGame();
        grid.addEventListener("click", clickHandlerBoard);
        updateScreen();
        startButton.textContent = "Restart game";
    };
    startButton.addEventListener("click", clickHandlerStartButton);

    const displayActivePlayer = () => {
        activePlayer.textContent = GameController.getActivePlayer().name;
    };

    const updateScreen = () => {
        displayGameGrid();
        displayActivePlayer();
        alert.textContent = "";
    };

    const diaglog = document.querySelector("dialog")
    const clickHandlerSetPlayerNamesButton = () => {
        diaglog.showModal();
    }
    const setPlayerNameButton = document.querySelector(".set-name");
    setPlayerNameButton.addEventListener("click", clickHandlerSetPlayerNamesButton);

    const confirmButton = document.querySelector("button[type=\"submit\"]");
    const form = document.querySelector("form");
    const playerOneNameInput = document.querySelector("#player-one-name-input");
    const playerTwoNameInput = document.querySelector("#player-two-name-input");
    const clickHandlerConfirmButton = (event) => {
        event.preventDefault();
        const playerOneName = playerOneNameInput.value === "" ? undefined : playerOneNameInput.value;
        const playerTwoName = playerTwoNameInput.value === "" ? undefined : playerTwoNameInput.value;
        GameController.setPlayerNames(playerOneName, playerTwoName);
        form.reset();
        updateScreen();
        diaglog.close();
    }
    confirmButton.addEventListener("click", clickHandlerConfirmButton);

    const cancelButton = document.querySelector(".cancel");
    const clickHandlerCancelButton = (event) => {
        event.preventDefault();
        form.reset();
        diaglog.close();
    }
    cancelButton.addEventListener("click", clickHandlerCancelButton);

    // initial render
    updateScreen();

    return { updateScreen };
})();