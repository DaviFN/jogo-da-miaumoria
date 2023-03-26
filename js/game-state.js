var nIds = 32;

class CellState
{
    constructor(id) {
        this.id = id;
        this.found = false;
        this.beingPlayed = false;
    }
    shouldBeVisible()
    {
        return this.found || this.beingPlayed;
    }
}

class GameState
{
    constructor()
    {
        this.board = [];
        this.boardSize = 0;
    }
    generateNewBoard(boardSize)
    {
        this.board = [];
        this.boardSize = boardSize;

        var allPossibleIds = [];
        for(var i = 1 ; i <= nIds ; ++i) {
            allPossibleIds.push(i);
        }

        var nDistinctIdsOnBoard = (boardSize * boardSize) / 2;

        var idsThatWillBeUsed = [];
        for(var i = 1 ; i <= nDistinctIdsOnBoard ; ++i) {
            var id = this.popRandomFromArray(allPossibleIds);
            idsThatWillBeUsed.push(id);
        }

        var arrayRepresentingBoard = [];
        for(var i = 0 ; i < idsThatWillBeUsed.length ; ++i) {
            arrayRepresentingBoard.push(idsThatWillBeUsed[i]);
            arrayRepresentingBoard.push(idsThatWillBeUsed[i]);
        }

        this.shuffleArray(arrayRepresentingBoard);

        for(var i = 0 ; i < boardSize ; ++i) {
            this.board.push([]);
            for(var j = 0 ; j < boardSize ; ++j) {
                var id = arrayRepresentingBoard[i + boardSize * j];
                this.board[i].push(new CellState(id));
            }
        }
    }
    isInWinState()
    {
        for(var i = 1 ; i <= this.boardSize ; ++i) {
            for(var j = 1 ; j <= this.boardSize ; ++j) {
                if(!this.getCell(i, j).found) {
                    return false;
                }
            }
        }
        return true;
    }
    getCell(i, j)
    {
        return this.board[i - 1][j - 1];
    }
    getRandomIntBetween(a, b)
    {
        return Math.floor((Math.random() * (b-a)) + a);
    }
    popRandomFromArray(array)
    {
        var index = this.getRandomIntBetween(0, array.length);
        var randomItem = array[index];
        array.splice(index, 1);
        return randomItem;
    }
    shuffleArray(array)
    {
        for(var i = array.length - 1 ; i > 0 ; --i) {
            var indexToSwap = this.getRandomIntBetween(0, i - 1);
            var itemAtIndexToSwap = array[indexToSwap];
            array[indexToSwap] = array[i];
            array[i] = itemAtIndexToSwap;
        }
    }
}