function createBoardCell() {
    let value = 0;

    const getValue = () => value;

    const addToken = (player) => {
        value = player;
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
        const boardWithCellValues = gameboard.map((row) => {
            row.map((cell) => {
                return cell.getValue();
            });
        });
        console.log(boardWithCellValues);
    };

    return { printGameboard };
}