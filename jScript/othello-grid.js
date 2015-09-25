/*
 * Holds info about the current game session
 */
var gameSessionInfo = {
  playerOneName: 'Player One',
  playerTwoName: 'Player Two',
  colorScheme: 'Classic'
}
/* Limit to 5 for simplicity */
var maxHighScores = 5;

/*
 * startGameGrid()
 * replaces the gameDiv section with the actual game grid
 * 
 */
function startGameGrid(rows, cols) {
  'use strict';
  var i, j;
  var newHTML = "";
  var gridClass = "gamegrid";
  var tableID = "othelloTable";

  newHTML += "<table id=\"" + tableID + "\" class=\"" + gridClass + "\">";

  // Loop through all rows and create tr tags
  for (i = 0; i < rows; i++) {

    newHTML += "<tr>";

    // Loop through all columns and create td tags with the appropriate data (currently hard coded)
    for (j = 0; j < cols; j++) {
      /* This is a temporary static set up for the hard coded grid with a pattern.
       * Later on the grid will be green to match the standard
       */
      newHTML += "<td/>";
    }

    newHTML += "</tr>";
  }

  newHTML += "</table>";
  return newHTML;
}

/*
 * populateGameGrid()
 * Update the grid with data from the model to show the appropriate pieces
 */
function populateGameGrid() {
  'use strict';
  var i, j;
  var curCell, gridPosPlayer;
  var gridXMax = othelloGrid.discGrid.length;
  var gridYMax = othelloGrid.discGrid[0].length;
  var discClass = "disc";
  var gridTable = document.getElementById("othelloTable");
  var whiteDisc = "game_assets/white_disc.png";
  var blackDisc = "game_assets/black_disc.png";
  
  for (i = 0; i < gridXMax; i++) {
    for (j = 0; j < gridYMax; j++) {
      curCell = gridTable.rows[j].cells[i];
      gridPosPlayer = othelloGrid.getPlayerAtPos(i, j);
      if (gridPosPlayer == OTHELLO_CONST.playerOne) {
        curCell.innerHTML = "<img src=\"" + blackDisc + "\" class=\"" + discClass + "\"/>";
        removeHandler(curCell, 'click', placePiece);
        removeHandler(curCell, 'mouseenter', showTempPieceIfValidPlay);
        removeHandler(curCell, 'mouseleave', removeTempPiece);
      } else if (gridPosPlayer == OTHELLO_CONST.playerTwo) {
        curCell.innerHTML = "<img src=\"" + whiteDisc + "\" class=\"" + discClass + "\"/>";
        removeHandler(curCell, 'click', placePiece);
        removeHandler(curCell, 'mouseenter', showTempPieceIfValidPlay);
        removeHandler(curCell, 'mouseleave', removeTempPiece);
      }
    }
  }
}

/*
 * generateGameGrid()
 * init function to handle the creation of the game grid by calling the startGameGrid
 */
function generateGameGrid() {
  'use strict';
  // Using book's idea to only run if document exists and getElementById is accessible
  if (document && document.getElementById) {
    var gridStart = document.getElementById("gameDiv");
    gridStart.innerHTML = startGameGrid(OTHELLO_CONST.gridSize, OTHELLO_CONST.gridSize);
    document.getElementById("gameStatus").style.display = "inline";
    document.getElementById("userEntry").innerHTML = "";
    // Hard code one iteration to update board with game state, it will need to be handled by events later
    othelloState.initializeGame();
    populateGameGrid();
    initGridHandlers();
    var controls = document.getElementById("menuControls");
    controls.innerHTML = "<button id=\"newGame\" type=\"button\">New Game</button>";
    controls.innerHTML += "<button id=\"resetGame\" type=\"button\">Reset Game</button>";
    controls.innerHTML += "<button id=\"highScrsBtn\" type=\"button\">High Scores</button>";
    
    var highScoreBtn = document.getElementById("highScrsBtn");
    var resetBtn = document.getElementById("resetGame");
    var newGBtn = document.getElementById("newGame");
    
    addHandler(resetBtn, 'click', generateGameGrid);
    addHandler(newGBtn, 'click', startNewGame);
    addHandler(highScoreBtn, 'click', dispHighScores);
  }
}

/* Displays the main menu for game flow */
function displayMainMenu() {
  'use strict';
  var menuDiv = document.getElementById("menuControls");
  var mainMenuCntrls = "<button id=\"newGameBtn\" type=\"button\">New Game</button>";
  mainMenuCntrls += "<button id=\"highScrsBtn\" type=\"button\">High Scores</button>";
  //mainMenuCntrls += "<button id=\"howToPlayBtn\" type=\"button\">How To Play</button>";
  
  menuDiv.innerHTML = mainMenuCntrls;
  
  // Add Handlers
  var newGameBtn = document.getElementById("newGameBtn");
  var highScoreBtn = document.getElementById("highScrsBtn");
  //var howToPlayBtn = document.getElementById("howToPlayBtn");
  
  addHandler(newGameBtn, 'click', startNewGame);
  addHandler(highScoreBtn, 'click', dispHighScores);
  //addHandler(howToPlayBtn, 'click', dispInstructions);
}

/*
 * initGridHandlers()
 * Creates the default handlers for all grid cells
 */
function initGridHandlers() {
  'use strict';
  var i, j;
  var curCell;
  var gridXMax = othelloGrid.discGrid.length;
  var gridYMax = othelloGrid.discGrid[0].length;
  var gridTable = document.getElementById("othelloTable");
  
  for (i = 0; i < gridXMax; i++) {
      for (j = 0; j < gridYMax; j++) {
          curCell = gridTable.rows[i].cells[j];
          addHandler(curCell, 'mouseenter', showTempPieceIfValidPlay);
          addHandler(curCell, 'mouseleave', removeTempPiece);
          addHandler(curCell, 'click', placePiece);
          addHandler(curCell, 'click', populateGameGrid());
      }
  }
}

/* 
 * addHandler()
 * Adds the specified function from the obj on the specific event type
 * Inverse of removeHandler()
 */
function addHandler(obj, type, fn) {
  'use strict';
  if (obj && obj.addEventListener) {
      obj.addEventListener(type, fn, false);
  } else if (obj && obj.attachEvent) {
      obj.attachEvent('on' + type, fn);
  }
}

/* 
 * removeHandler()
 * Removes the specified function from the obj on the specific event type
 * Inverse of addHandler()
 */
function removeHandler(obj, type, fn) {
  'use strict';
  if (obj && obj.removeEventListener) {
      obj.removeEventListener(type, fn, false);
  } else if (obj && obj.detachEvent) {
      obj.detachEvent('on' + type, fn);
  }
}

/*
 * placePiece()
 * Event handler for onclick events of the grid to place pieces
 */
function placePiece(evt) {
  'use strict';
  evt = evt || window.event;
  // Had to add .parentNode as the addition of the temp img was causing the target to the be image rather than the td
  var target = evt.target.parentNode || evt.srcElement.parentNode;
  var cellX = target.cellIndex;
  var cellY = target.parentNode.rowIndex;
  if (othelloGrid.validPlay(othelloState.currentPlayer, cellX, cellY)) {
    updateLastPlay(cellX, cellY);
    othelloGrid.executePlay(othelloState.currentPlayer, cellX, cellY);
    updateCurrentPlayer();
    populateGameGrid();
  }
}

/* Event handler for the Reset Game button. Resets the grid but does not prompt for new player names */
function resetGame(evt) {
  'use strict';
  /* Variables for current player & last play to reset */
  var lastPlayDisplay = document.getElementById("lastPlayMade");
  var currentPlayerDisp = document.getElementById('currentPlayer');
  lastPlayDisplay.innerHTML = "";
  currentPlayerDisp.innerHTML = "";
  generateGameGrid();
}

/* Handles name changes before starting game */
function playerNameChange(evt) {
  'use strict';
  evt = evt || window.event;
  var target = evt.target || evt.srcElement;
  var player = target.id;
  var nameValue = target.value;
  if (player == 'plyrOneName') {
      gameSessionInfo.playerOneName = nameValue;
  } else if (player == 'plyrTwoName') {
      gameSessionInfo.playerTwoName = nameValue;
  }
  updateCurrentPlayer();
}

/* Function to show a piece if a valid play can be made at the current location for the current player */
function showTempPieceIfValidPlay(evt) {
  'use strict';
  evt = evt || window.event;
  var target = evt.target || evt.srcElement;
  var cellX = target.cellIndex;
  var cellY = target.parentNode.rowIndex;
  var discClass = "disc";
  var whiteDisc = "game_assets/white_disc.png";
  var blackDisc = "game_assets/black_disc.png";
  
  
  if (othelloGrid.validPlay(othelloState.currentPlayer, cellX, cellY)) {
    if (othelloState.currentPlayer == OTHELLO_CONST.playerOne) {
      target.innerHTML = "<img src=\"" + blackDisc + "\" class=\"" + discClass + "\"/>";
    } else if (othelloState.currentPlayer == OTHELLO_CONST.playerTwo) {
      target.innerHTML = "<img src=\"" + whiteDisc + "\" class=\"" + discClass + "\"/>";
    }
  }
}

/* Cleans up after showTempPieceIfValidPlay */
function removeTempPiece(evt) {
  'use strict';
  evt = evt || window.event;
  var target = evt.target || evt.srcElement;
  
  target.innerHTML = "";
}

/* Starts a new game, which displays player name information fields and start game button which renders the board */
function startNewGame(evt) {
  'use strict';
  document.getElementById("gameDiv").innerHTML = "";
  var menuDiv = document.getElementById("menuControls");
  
  /* Variables for current player & last play to reset */
  var lastPlayDisplay = document.getElementById("lastPlayMade");
  var currentPlayerDisp = document.getElementById('currentPlayer');
  lastPlayDisplay.innerHTML = "";
  currentPlayerDisp.innerHTML = "";
  
  menuDiv.innerHTML = "<button id=\"startGameBtn\" type=\"button\">Start Game</button>";
  document.getElementById("gameStatus").style.display = "none";
  
  var newGameEntry = document.getElementById("userEntry");
  newGameEntry.innerHTML = "Player One Designation: <input id=\"plyrOneName\" type=\"text\" name=\"playerOneName\" value=\"Player One\"/><br/>";
  newGameEntry.innerHTML += "Player Two Designation: <input id=\"plyrTwoName\" type=\"text\" name=\"playerTwoName\" value=\"Player Two\"/><br/>";
  
  var plyrOneName = document.getElementById("plyrOneName");
  var plyrTwoName = document.getElementById("plyrTwoName");
  addHandler(plyrOneName, 'input', playerNameChange);
  addHandler(plyrTwoName, 'input', playerNameChange);
  
  var startGameBtn = document.getElementById("startGameBtn");
  addHandler(startGameBtn, 'click', generateGameGrid);
}

/* Function to display high scores from localStorage */
function dispHighScores(evt) {
  'use strict';
  
  if (supports_html5_storage()) {
    var highScoreDiv = document.getElementById("gameDiv");
    var highScoreList = "<table id=\"highScoresList\" class=\"highScores\">";
    var i;
    highScoreList += "<tr class=\"scoreHead\"><th class=\"posit\">Position</th><th class=\"name\">Name</th><th class=\"points\">Points</th></tr>";
    if (localStorage["othello.highscore.0.position"] == undefined) loadDefaultHighScores();
    
    for (i = 0; i < maxHighScores; i++) {
      highScoreList += "<tr>";
      highScoreList += "<td class=\"posit\">" + localStorage["othello.highscore." + i + ".position"] + "</td>";
      highScoreList += "<td class=\"name\">" + localStorage["othello.highscore." + i + ".name"] + "</td>";
      highScoreList += "<td class=\"points\">" + localStorage["othello.highscore." + i + ".points"] + "</td>";
      highScoreList += "</tr>";
    }
    
    highScoreList += "</table>";
    highScoreDiv.innerHTML = highScoreList;
  }
}

/*
 * updateLastPlay()
 * Updates the view to show the last cell clicked
 */
function updateLastPlay(x, y) {
  'use strict';
  var lastPlayDisplay = document.getElementById("lastPlayMade");
  lastPlayDisplay.innerHTML = 'X(' + x + ')' + ' ,Y(' + y + ')';
}

/*
 * updateCurrentPlayer()
 * Updates the view to show the current player which dictates the moves available and the piece placed
 */
function updateCurrentPlayer() {
  'use strict';
  var currentPlayerDisp = document.getElementById('currentPlayer');
  othelloState.currentPlayer == OTHELLO_CONST.playerOne ? currentPlayerDisp.innerHTML = gameSessionInfo.playerOneName : currentPlayerDisp.innerHTML = gameSessionInfo.playerTwoName;
}

/* Loads default high scores via XMLHttpRequest from local file MAY NOT WORK IN ALL BROWSERS */
function loadDefaultHighScores() {
  'use strict';
  var data = "";
  var localReq = new XMLHttpRequest();
  
  if (supports_html5_storage()) {
    localReq.open("POST", "data/defaultScores.json", false);
    localReq.send(data);
    var i;
    var responseJSON = JSON.parse(localReq.responseText);
    var scores = responseJSON["scores"];
    var scoresCnt = scores.length;
    
    for (i = 0; i < scoresCnt && i < maxHighScores; i++) {
      localStorage["othello.highscore." + i + ".position"] = scores[i]["position"];
      localStorage["othello.highscore." + i + ".name"] = scores[i]["name"];
      localStorage["othello.highscore." + i + ".points"] = scores[i]["points"];
    }
    
  }
}

/* Check if HTML5 localStorage is available */
function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

/* Checks if the game is done */
function gameFinished() {
  'use strict';
  return othelloGrid.countDiscs(OTHELLO_CONST.empty) != 0 ? false : true;
}

/* Ends the game and shows the final scores */
function endGame() {
  'use strict';
  var gameSect = document.getElementById("gameDiv");
  var plyrOneHighScore = othelloGrid.countDiscs(OTHELLO_CONST.playerOne);
  var plyrTwoHighScore = othelloGrid.countDiscs(OTHELLO_CONST.playerTwo);
  var finalScores = "<br><span id=\"plyrOneScore\" class=\"finalScore\">" + gameSessionInfo.playerOneName
    + " score: " + plyrOneHighScore + "</span>";
  finalScores += "<span id=\"plyrTwoScore\" class=\"finalScore\">" + gameSessionInfo.playerTwoName
    + " score: " + plyrTwoHighScore + "</span>";
    
  gameSect.innerHTML = finalScores;
  plyrOneHighScore >= plyrTwoHighScore ? updateHighScores(gameSessionInfo.playerOneName, plyrOneHighScore*15)
    : updateHighScores(gameSessionInfo.playerTwoName, plyrTwoHighScore*15);
}

/* Updates the High Score local storage with the provided name and points IF it beats another score */
function updateHighScores(name, points) {
  if (supports_html5_storage()) {
    var i;
    for (i = 0; i < maxHighScores; i++) {
      if (localStorage["othello.highscore." + i + ".position"] == undefined
        || parseInt(points) > parseInt(localStorage["othello.highscore." + i + ".points"])) {
        var oldName = localStorage["othello.highscore." + i + ".name"];
        var oldPoints = localStorage["othello.highscore." + i + ".points"];
        
        localStorage["othello.highscore." + i + ".position"] = (i + 1);
        localStorage["othello.highscore." + i + ".name"] = name;
        localStorage["othello.highscore." + i + ".points"] = points;
        
        updateHighScores(oldName, oldPoints);
        break;
      }
    }
  }
}

// Wait until the window is fully loaded before running this js to be sure document is fully loaded
window.onload = displayMainMenu;