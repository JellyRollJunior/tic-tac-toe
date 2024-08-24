function createCell() {

    let value = 0;
}

function createGameboard() {
    
    let gameboard = [];
    const ROWS = 3;
    const COLUMNS = 3;

    for (let i = 0; i < ROWS; i++) {
        gameboard[i] = [];
        for (let j = 0; j < COLUMNS; j++) {
            gameboard[i].push(createCell());
        }
    }
}