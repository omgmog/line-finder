(function() {
  'use strict';

  var symbol1 = '╱';
  var symbol2 = '╲';
  var symbol3 = '▲';
  var symbol4 = '⋖';
  var symbol5 = '⋗';
  var symbol6 = 'GO';
  var symbol7 = 'SHUFFLE';
  var rows = 9;
  var columns = 9;
  var intervalTime = 200;

  var currentStreak = 0;
  var highScore = 0;
  var currentColumn = 0;
  var touchedCells = [];

  var hlClassPrefix = 'hl-';
  var hlClassCount = 0;
  var hlClass = hlClassPrefix + hlClassCount;
  var endClass = 'end';
  var rowClass = 'row';
  var colClass = 'col';

  var input = document.createElement('input');
  input.setAttribute('disabled', 'disabled');
  var button = document.createElement('button');
  var div = document.createElement('div');

  var init = function() {
    createCells();
    createControls();
    createScoreBoard();
  };

  var createCells = function() {
    var column = div.cloneNode(false);
    column.classList.add(colClass);
    var row = div.cloneNode(false);
    row.classList.add(rowClass);
    var board = div.cloneNode(false);
    board.classList.add('board');

    for (var r = 0; r < rows; r++) {
      var thisRow = row.cloneNode(false);
      for (var c = 0; c < columns; c++) {
        var thisColumn = column.cloneNode(false);
        var thisInput = input.cloneNode(false);
        randomizeCell(thisInput);
        thisColumn.appendChild(thisInput);
        thisRow.appendChild(thisColumn);
      }
      board.appendChild(thisRow);
    }
    document.body.appendChild(board);
  };

  var createControls = function() {
    var controls = div.cloneNode(false);
    controls.classList.add('controls');
    var column = div.cloneNode(false);
    column.classList.add(colClass);

    for (var c = 0; c < columns; c++) {
      var thisColumn = column.cloneNode(false);
      var thisInput = input.cloneNode(false);
      if (c === 0) {
        thisInput.value = symbol3;
      }
      thisColumn.appendChild(thisInput);
      controls.appendChild(thisColumn);
    }

    var buttonWrap = div.cloneNode(false);
    buttonWrap.classList.add('buttonWrap');

    var lButton = button.cloneNode(false);
    lButton.classList.add('left');
    lButton.innerText = symbol4;

    var rButton = button.cloneNode(false);
    rButton.classList.add('right');
    rButton.innerText = symbol5;

    var startButton = button.cloneNode(false);
    startButton.classList.add('start');
    startButton.innerText = symbol6;

    var shuffleButton = button.cloneNode(false);
    shuffleButton.classList.add('shuffle');
    shuffleButton.innerText = symbol7;

    buttonWrap.appendChild(lButton);
    buttonWrap.appendChild(rButton);
    buttonWrap.appendChild(startButton);
    buttonWrap.appendChild(shuffleButton);

    controls.appendChild(buttonWrap);

    document.body.appendChild(controls);

    setupBinds();
  };

  var createScoreBoard = function() {
    var scoreboard = div.cloneNode(false);
    scoreboard.classList.add('scoreboard');

    var streak = input.cloneNode(false);
    streak.classList.add('streak');
    scoreboard.appendChild(streak);

    var highscore = input.cloneNode(false);
    highscore.classList.add('highscore');
    scoreboard.appendChild(highscore);

    document.body.appendChild(scoreboard);
  };

  var randomizeCell = function(cell) {
    var value = ((Math.random(1) * 10.5) % 2) > 1 ? symbol1 : symbol2;
    cell.value = value;
    cell.setAttribute('value', value);
  };

  var randomizeBoard = function() {
    removeHighlightFromCells();
    var cells = $$('.board input');
    for (var c = 0; c < cells.length; c++) {
      randomizeCell(cells[c]);
    }
  };

  var setupBinds = function() {
    $('.left').onclick = function() {
      changeColumn('left');
    };
    $('.right').onclick = function() {
      changeColumn('right');
    };
    $('.start').onclick = function() {
      startMove();
    };
    $('.shuffle').onclick = function() {
      randomizeBoard();
    };
  };

  var removeHighlightFromCells = function() {
    for (var i = 0; i <= 100; i++) {

      var $highlightedCells = $$('.' + hlClassPrefix + i);

      if ($highlightedCells.length > 0) {
        for (var c = 0; c < $highlightedCells.length; c++) {
          $highlightedCells[c].classList.remove(hlClassPrefix + i);
        }
      }
    }

    var $endCells = $$('.' + endClass);

    if ($endCells.length > 0) {
      for (var c = 0; c < $endCells.length; c++) {
        $endCells[c].classList.remove(endClass);
      }
    }
  };

  var changeColumn = function(direction) {
    if (direction === 'right') {
      if (currentColumn < (columns - 1)) {
        currentColumn++;
      } else {
        currentColumn = 0;
      }
    } else {
      if (currentColumn > 0) {
        currentColumn--;
      } else {
        currentColumn = (columns - 1);
      }
    }

    var $columnIndicators = $$('.controls input');
    for (var c = 0; c < columns; c++) {
      $columnIndicators[c].value = '';
    }
    $columnIndicators[currentColumn].value = symbol3;

  };

  var startMove = function() {
    currentStreak = 0;
    removeHighlightFromCells();
    var buttons = $$('.buttonWrap button');
    for (var b = 0; b < buttons.length; b++) {
      buttons[b].setAttribute('disabled', 'disabled');
    }
    $('.' + rowClass + ':nth-child(' + (rows) + ') .' + colClass + ':nth-child(' + (currentColumn + 1) + ') input').classList.add(hlClass);
    setTimeout(function () {
      highlightCell(currentColumn, rows - 2, currentColumn, rows - 1);
    }, intervalTime);
  };

  var highlightCell = function(toX, toY, fromX, fromY) {
    var $cell = $('.' + rowClass + ':nth-child(' + (toY + 1) + ') .' + colClass + ':nth-child(' + (toX + 1) + ') input');

    if ($cell !== null) {
      $cell.classList.add(hlClass);
      var cellValue = $cell.value;
      var newX = toX;
      var newY = toY;
      var touched = touchedCells.indexOf(newX + 'x' + newY);
      if (touched > 0) {
        hlClassCount++;
        hlClass = hlClassPrefix + hlClassCount;
      }
      touchedCells.push(newX + 'x' + newY);

      if (cellValue == symbol1) {
        if (fromY === newY) {
          if (fromX > newX) {
            newY++;
          } else {
            newY--;
          }
        } else if (fromY > newY) {
          newX++;
        } else if (fromY < newY) {
          newX--;
        }
      } else if (cellValue == symbol2) {
        if (fromY === newY) {
          if (fromX > newX) {
            newY--;
          } else {
            newY++;
          }
        } else if (fromY > newY) {
          newX--;
        } else if (fromY < newY) {
          newX++;
        }
      }
      currentStreak++;
      setTimeout(function() {
        highlightCell(newX, newY, toX, toY);
        $cell.value = (cellValue == symbol1 ? symbol2 : symbol1);
      }, intervalTime);

    } else {
      $cell = $('.' + rowClass + ':nth-child(' + (fromY + 1) + ') .' + colClass + ':nth-child(' + (fromX + 1) + ') input');
      $cell.classList.add(endClass);
      endMove();
      presentScore();
    }
  };

  var endMove = function() {
    touchedCells = [];
    hlClassCount = 0;
    hlClass = hlClassPrefix + hlClassCount;
    var buttons = $$('.buttonWrap button');
    for (var b = 0; b < buttons.length; b++) {
      buttons[b].removeAttribute('disabled');
    }
  };

  var presentScore = function() {
    if (currentStreak > highScore) {
      highScore = currentStreak;
    }
    $('.scoreboard .streak').value = currentStreak;
    currentStreak = 0;
    $('.scoreboard .highscore').value = highScore;
  };

  var $ = function(selector) {
    return document.querySelector(selector);
  };
  var $$ = function(selector) {
    return document.querySelectorAll(selector);
  };

  init();

})();
