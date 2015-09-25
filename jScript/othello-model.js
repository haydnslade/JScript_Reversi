/* Constants */
var OTHELLO_CONST = {
  gridSize: 8,
  maxDiscs: (this.gridSize * this.gridSize),
  numPlayers: 2,
  empty: 0,
  playerOne: 1,
  playerTwo: 2,
  playerOneStartPos: [[3, 3], [4, 4]],
  playerTwoStartPos: [[4, 3], [3, 4]]
};

/* State of the game */
var othelloState = {
  discsRemaining: OTHELLO_CONST.maxDiscs,
  currentPlayer: OTHELLO_CONST.playerOne,
  initializeGame: function() {
    'use strict';
    othelloGrid.initGrid();
    this.currentPlayer = OTHELLO_CONST.playerOne;
  },
  nextTurn: function() {
    'use strict';
    this.currentPlayer == OTHELLO_CONST.playerOne ? this.currentPlayer = OTHELLO_CONST.playerTwo : this.currentPlayer = OTHELLO_CONST.playerOne;
  }
};

/* The game grid and all functions related */
var othelloGrid = {
  discGrid: new Array(),
  initGrid: function() {
    'use strict';
    var i, j;
    var pOneStart1 = OTHELLO_CONST.playerOneStartPos[0];
    var pOneStart2 = OTHELLO_CONST.playerOneStartPos[1];
    var pTwoStart1 = OTHELLO_CONST.playerTwoStartPos[0];
    var pTwoStart2 = OTHELLO_CONST.playerTwoStartPos[1];
    
    for (i = 0; i < OTHELLO_CONST.gridSize; i++) {
      this.discGrid[i] = new Array();
      for (j = 0; j < OTHELLO_CONST.gridSize; j++) {
        // Fill player one & two starts, and the rest empty
        if ((i == pOneStart1[0] && j == pOneStart1[1])
          || (i == pOneStart2[0] && j == pOneStart2[1])) {
          this.discGrid[i][j] = OTHELLO_CONST.playerOne;
        } else if ((i == pTwoStart1[0] && j == pTwoStart1[1])
          || (i == pTwoStart2[0] && j == pTwoStart2[1])) {
          this.discGrid[i][j] = OTHELLO_CONST.playerTwo;
        } else {
          this.discGrid[i][j] = OTHELLO_CONST.empty;
        }
      }
    }
  },
  executePlay: function(player, x, y) {
    'use strict';
    if (this.discGrid[x][y] != OTHELLO_CONST.empty || !this.validPlay(player, x, y)) {
        return false;
    } else {
        this.discGrid[x][y] = player;
        this.convertDiscs(player, x, y);
        othelloState.nextTurn();
        return true;
    }
  },
  getPlayerAtPos: function(x, y) {
    'use strict';
    return this.discGrid[x][y];
  },
  validPlay: function(player, x, y) {
    'use strict';
    if (this.discGrid[x][y] != OTHELLO_CONST.empty) return false;
    
    /*console.log(this.checkHorizRight(player, x, y) + " " + this.checkHorizLeft(player, x, y)
      + " " + this.checkVertUp(player, x, y) + " " + this.checkVertDown(player, x, y) + " " + this.checkDiagTL(player, x, y) 
      + " " + this.checkDiagTR(player, x, y) + " " + this.checkDiagBL(player, x, y) + " " + this.checkDiagBR(player, x, y));
    */
    
    return this.checkHorizRight(player, x, y) || this.checkHorizLeft(player, x, y)
      || this.checkVertUp(player, x, y) || this.checkVertDown(player, x, y) || this.checkDiagTL(player, x, y) 
      || this.checkDiagTR(player, x, y) || this.checkDiagBL(player, x, y) || this.checkDiagBR(player, x, y);
  },
  convertDiscs: function(player, x, y) {
    'use strict';
    var i, j;
    var currentPiece, lastPiece;
    var width = this.discGrid.length;
    var height = this.discGrid[x].length;
    
    if (this.checkHorizLeft(player, x, y)) {
      for (i = x - 1; i >= 0; i--) {
        currentPiece = this.discGrid[i][y];
        
        if (currentPiece == player || currentPiece == OTHELLO_CONST.empty) {
          break;
        } else {
          this.discGrid[i][y] = player;
        }
      }
    }
    if (this.checkHorizRight(player, x, y)) {
      for (i = x + 1; i < width; i++) {
        currentPiece = this.discGrid[i][y];
        
        if (currentPiece == player || currentPiece == OTHELLO_CONST.empty) {
          break;
        } else {
          this.discGrid[i][y] = player;
        }
      }
    }
    if (this.checkVertDown(player, x, y)) {
      for (j = y + 1; j < height; j++) {
        currentPiece = this.discGrid[x][j];
        
        if (currentPiece == player || currentPiece == OTHELLO_CONST.empty) {
          break;
        } else {
          this.discGrid[x][j] = player;
        }
      }
    }
    if (this.checkVertUp(player, x, y)) {
      for (j = y - 1; j >= 0; j--) {
        currentPiece = this.discGrid[x][j];
        
        if (currentPiece == player || currentPiece == OTHELLO_CONST.empty) {
          break;
        } else {
          this.discGrid[x][j] = player;
        }
      }
    }
    if (this.checkDiagTL(player, x, y)) {
      for (i = x - 1, j = y - 1; i >= 0 && j>= 0; i--, j--) {
        currentPiece = this.discGrid[i][j];
        
        if (currentPiece == player || currentPiece == OTHELLO_CONST.empty) {
          break;
        } else {
          this.discGrid[i][j] = player;
        }
      }
    }
    if (this.checkDiagTR(player, x, y)) {
      for (i = x + 1, j = y - 1; i < width && j >= 0; i++, j--) {
        currentPiece = this.discGrid[i][j];
        
        if (currentPiece == player || currentPiece == OTHELLO_CONST.empty) {
          break;
        } else {
          this.discGrid[i][j] = player;
        }
      }
    }
    if (this.checkDiagBL(player, x, y)) {
      for (i = x - 1, j = y + 1; i >= 0 && j < height; i--, j++) {
        currentPiece = this.discGrid[i][j];
        
        if (currentPiece == player || currentPiece == OTHELLO_CONST.empty) {
          break;
        } else {
          this.discGrid[i][j] = player;
        }
      }
    }
    if (this.checkDiagBR(player, x, y)) {
      for (i = x + 1, j = y + 1; i < width && j < height; i++, j++) {
        currentPiece = this.discGrid[i][j];
        
        if (currentPiece == player || currentPiece == OTHELLO_CONST.empty) {
          break;
        } else {
          this.discGrid[i][j] = player;
        }
      }
    }
  },
  countDiscs: function(player) {
    'use strict';
    var i, j;
    var playerDiscCnt = 0;
    var width = this.discGrid.length;
    var height = this.discGrid[0].length;
    
    for (i = 0; i < width; i++) {
      for (j = 0; j < height; j++) {
        if (this.discGrid[i][j] == player) playerDiscCnt++;
      }
    }
    
    return playerDiscCnt;
  },
  checkHorizLeft: function(player, x, y) {
    'use strict';
    var i;
    var currentPiece, lastPiece = player;
    
    for (i = x - 1; i >= 0; i--) {
      currentPiece = this.discGrid[i][y];
      
      if (currentPiece == player && lastPiece !== player) return true;
      if (currentPiece == OTHELLO_CONST.empty || currentPiece == player) return false;
      lastPiece = currentPiece;
    }
    
    return false;
  },
  checkHorizRight: function(player, x, y) {
    'use strict';
    var i;
    var width = this.discGrid.length;
    var currentPiece, lastPiece = player;
    
    for (i = x + 1; i < width; i++) {
      currentPiece = this.discGrid[i][y];
      
      if (currentPiece == player && lastPiece !== player) return true;
      if (currentPiece == OTHELLO_CONST.empty || currentPiece == player) return false;
      lastPiece = currentPiece;
    }
    
    return false;
  },
  checkVertUp: function(player, x, y) {
    'use strict';
    var j;
    var currentPiece, lastPiece = player;
    
    for (j = y - 1; j >= 0; j--) {
      currentPiece = this.discGrid[x][j];
      
      if (currentPiece == player && lastPiece !== player) return true;
      if (currentPiece == OTHELLO_CONST.empty || currentPiece == player) return false;
      lastPiece = currentPiece;
    }
    
    return false;
  },
  checkVertDown: function(player, x, y) {
    'use strict';
    var j;
    var height = this.discGrid[x].length;
    var currentPiece, lastPiece = player;
    
    for (j = y + 1; j < height; j++) {
      currentPiece = this.discGrid[x][j];
      
      if (currentPiece == player && lastPiece !== player) return true;
      if (currentPiece == OTHELLO_CONST.empty || currentPiece == player) return false;
      lastPiece = currentPiece;
    }
    
    return false;
  },
  checkDiagTL: function(player, x, y) {
    'use strict';
    var i, j;
    var currentPiece, lastPiece = player;
    
    for (i = x - 1, j = y - 1; i >= 0 && j>= 0; i--, j--) {
      currentPiece = this.discGrid[i][j];
      
      if (currentPiece == player && lastPiece !== player) return true;
      if (currentPiece == OTHELLO_CONST.empty || currentPiece == player) return false;
      lastPiece = currentPiece;
    }
    
    return false;
  },
  checkDiagTR: function(player, x, y) {
    'use strict';
    var i, j;
    var currentPiece, lastPiece = player;
    var width = this.discGrid.length;
    
    for (i = x + 1, j = y - 1; i < width && j >= 0; i++, j--) {
      currentPiece = this.discGrid[i][j];

      if (currentPiece == player && lastPiece !== player) return true;
      if (currentPiece == OTHELLO_CONST.empty || currentPiece == player) return false;
      lastPiece = currentPiece;
    }
    
    return false;
  },
  checkDiagBL: function(player, x, y) {
    'use strict';
    var i, j;
    var currentPiece, lastPiece = player;
    var height = this.discGrid[x].length;
    
    for (i = x - 1, j = y + 1; i >= 0 && j < height; i--, j++) {
      currentPiece = this.discGrid[i][j];
      
      if (currentPiece == player && lastPiece !== player) return true;
      if (currentPiece == OTHELLO_CONST.empty || currentPiece == player) return false;
      lastPiece = currentPiece;
    }
    
    return false;
  },
  checkDiagBR: function(player, x, y) {
    'use strict';
    var i, j;
    var currentPiece, lastPiece = player;
    var width = this.discGrid.length;
    var height = this.discGrid[x].length;
    
    for (i = x + 1, j = y + 1; i < width && j < height; i++, j++) {
      currentPiece = this.discGrid[i][j];
      
      if (currentPiece == player && lastPiece !== player) return true;
      if (currentPiece == OTHELLO_CONST.empty || currentPiece == player) return false;
      lastPiece = currentPiece;
    }
    
    return false;
  }
};

