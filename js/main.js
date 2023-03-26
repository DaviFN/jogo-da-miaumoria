var gameState = new GameState();

var maxTimeForEasyModeInSeconds = 120;
var maxTimeForMediumModeInSeconds = 180;
var maxTimeForHardModeInSeconds = 280;

var gameRunning = false;

var meaws = [];
var bell = new Audio('resources/audio/bell.mp3');
var applause = new Audio('resources/audio/applause.mp3');
var failure = new Audio('resources/audio/failure.mp3');
initializeMeaws();
function initializeMeaws()
{
    for(var i = 1 ; i <= 32 ; ++i) {
        meaws.push(new Audio('resources/audio/cats/' + i + '.mp3'));
    }
}
function playMeaw(id)
{
    meaws[id - 1].play();
}
function playBell()
{
    bell.play();
}
function playApplause()
{
    applause.play();
}
function playFailure()
{
    failure.play();
}

var playState = "waiting for first cell";
var firstCell = undefined;
var secondCell = undefined;

var delayInMsAfterShowingCells = 1500;

function getGameDifficulty()
{
    return document.getElementById("difficultyselect").value;
}

function getBoardSize()
{
    var gameDifficulty = getGameDifficulty();
    if(gameDifficulty == 'easy') return 4;
    if(gameDifficulty == 'medium') return 6;
    return 8;
}

function gameDiv()
{
    return document.getElementById("game-div");
}

function mainMenuDiv()
{
    return document.getElementById("main-menu-div");
}

function gameMenuDiv()
{
    return document.getElementById("game-menu-div");
}

function startGame()
{
    generateNewGame();
    mainMenuDiv().hidden = true;
    gameDiv().hidden = false;
    gameMenuDiv().hidden = false;
    gameRunning = true;
    startGameTimer();
}

function getGameTimerHeader()
{
    return document.getElementById("game-timer-header");
}

function updateGameTimer(timeInSeconds)
{
    getGameTimerHeader().innerText = "Tempo restante: " + timeInSeconds + " segundos";
}

function startGameTimer()
{
    var difficulty = getGameDifficulty();
    var secondsRemaining = maxTimeForHardModeInSeconds;
    if(difficulty == "easy") {
        secondsRemaining = maxTimeForEasyModeInSeconds;
    } else if(difficulty == "medium") {
        secondsRemaining = maxTimeForMediumModeInSeconds;
    }

    updateGameTimer(secondsRemaining);

    function timeoutForGameTimer()
    {
        if(!gameRunning) return;
        --secondsRemaining;
        updateGameTimer(secondsRemaining);
        if(secondsRemaining > 0) {
            setTimeout(timeoutForGameTimer, 1000);
        }
        else {
            handleLossCondition();
        }
    }

    setTimeout(timeoutForGameTimer, 1000);
}

function generateNewGame()
{
    gameDiv().innerHTML = "";

    for(var i = 1 ; i <= getBoardSize() ; ++i) {
        gameDiv().innerHTML += "<div id='row-" + i + "'></div>";
    }

    for(var i = 1 ; i <= getBoardSize() ; ++i) {
        var div = document.getElementById("row-" + i);
        for(var j = 1 ; j <= getBoardSize() ; ++j) {
            let closuredI = i;
            let closuredJ = j;
            div.innerHTML += "<img src='" + getQuestionMarkResourcePath() + "' id='cell-" + closuredI + "-" + closuredJ + "' class='board-item' onclick='boardItemClicked(" + closuredI + ", " + closuredJ + ")'>";
        }
    }

    gameState.generateNewBoard(getBoardSize());
}

function updateBoardAcordingToState()
{
    for(var i = 1 ; i <= getBoardSize() ; ++i) {
        for(var j = 1 ; j <= getBoardSize() ; ++j) {
            var img = document.getElementById("cell-" + i + "-" + j);
            var cell = gameState.getCell(i, j);
            if(cell.shouldBeVisible()) {
                img.src = getImageResourcePathByNumber(cell.id);
            }
            else {
                img.src = getQuestionMarkResourcePath();
            }
        }
    }
}

function boardItemClicked(i, j)
{
    var cell = gameState.getCell(i, j);
    if(cell.found) return;
    if(playState == "waiting for delay after showing cells") return;

    if(playState == "waiting for first cell") {
        cell.beingPlayed = true;
        playMeaw(cell.id);
        firstCell = cell;
        playState = "waiting for second cell";
    }
    else if(playState == "waiting for second cell") {
        if(firstCell === cell) return;
        cell.beingPlayed = true;
        secondCell = cell;

        if(cell.id == firstCell.id) {
            firstCell.found = true;
            firstCell = undefined;
            cell.found = true;
            secondCell = undefined;
            cell.beingPlayed = false;
            playState = "waiting for first cell";
            if(gameState.isInWinState()) {
                handleWinCondition();
            }
            else {
                playBell();
            }
        }
        else {
            playMeaw(cell.id);
            playState = "waiting for delay after showing cells";
            window.setTimeout(function() {
                console.log("in timeout")
                firstCell.beingPlayed = false;
                firstCell = undefined;
                cell.beingPlayed = false;
                secondCell = undefined;
                playState = "waiting for first cell";
                updateBoardAcordingToState();
            }, delayInMsAfterShowingCells);
        }
    }

    updateBoardAcordingToState();
}

function handleWinCondition()
{
    gameMenuDiv().hidden = true;
    gameDiv().hidden = true;
    mainMenuDiv().hidden = false;
    playApplause();
    gameRunning = false;
}

function handleLossCondition()
{
    gameMenuDiv().hidden = true;
    gameDiv().hidden = true;
    mainMenuDiv().hidden = false;
    playFailure();
    gameRunning = false;
}

function goBackToMainMenu()
{
    gameMenuDiv().hidden = true;
    gameDiv().hidden = true;
    mainMenuDiv().hidden = false;
    playState = "waiting for first cell";
    firstCell = undefined;
    secondCell = undefined;
    gameRunning = false;
}