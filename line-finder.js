(function() {
  'use strict';

  var symbols = {
    right: '╱',
    left: '╲',
    select_up: '▲',
    select_down: '▼',
    select_left: '◀',
    select_right: '▶',
    end: '╳'
  };

  var rows = 11;
  var columns = 11;
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
    var column = $clone(div);
    column.classList.add(colClass);
    var row = $clone(div);
    row.classList.add(rowClass);
    var board = $clone(div);
    board.classList.add('board');

    for (var r = 0; r < rows; r++) {
      var thisRow = $clone(row);
      for (var c = 0; c < columns; c++) {
        var thisColumn = $clone(column);
        var thisInput = $clone(input);
        randomizeCell(thisInput);
        thisColumn.appendChild(thisInput);
        thisRow.appendChild(thisColumn);
      }
      board.appendChild(thisRow);
    }
    document.body.appendChild(board);
  };

  var createControls = function() {
    var controls = $clone(div);
    controls.classList.add('controls');
    var column = $clone(div);
    column.classList.add(colClass);

    for (var c = 0; c < columns; c++) {
      var thisColumn = $clone(column);
      var thisInput = $clone(input);
      if (c === 0) {
        thisInput.value = symbols.select_up;
      }
      thisColumn.appendChild(thisInput);
      controls.appendChild(thisColumn);
    }

    var buttonWrap = $clone(div);
    buttonWrap.classList.add('buttonWrap');

    var lButton = $clone(button);
    lButton.classList.add('left');
    lButton.innerText = symbols.select_left;

    var rButton = $clone(button);
    rButton.classList.add('right');
    rButton.innerText = symbols.select_right;

    var startButton = $clone(button);
    startButton.classList.add('start');
    startButton.innerText = 'GO';

    var shuffleButton = $clone(button);
    shuffleButton.classList.add('shuffle');
    shuffleButton.innerText = 'SHUFFLE';

    buttonWrap.appendChild(lButton);
    buttonWrap.appendChild(rButton);
    buttonWrap.appendChild(startButton);
    buttonWrap.appendChild(shuffleButton);

    controls.appendChild(buttonWrap);

    document.body.appendChild(controls);

    setupBinds();
  };

  var createScoreBoard = function() {
    var scoreboard = $clone(div);
    scoreboard.classList.add('scoreboard');

    var streak = $clone(input);
    streak.classList.add('streak');
    scoreboard.appendChild(streak);

    var highscore = $clone(input);
    highscore.classList.add('highscore');
    scoreboard.appendChild(highscore);

    document.body.appendChild(scoreboard);
  };

  var randomizeCell = function(cell) {
    var value = ((Math.random(1) * 10.5) % 2) > 1 ? symbols.right : symbols.left;
    cell.value = value;
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
        randomizeCell($endCells[c]);
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
    $columnIndicators[currentColumn].value = symbols.select_up;

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

      if (cellValue == symbols.right) {
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
      } else if (cellValue == symbols.left) {
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
        $cell.value = (cellValue == symbols.right ? symbols.left : symbols.right);
      }, intervalTime);

    } else {
      setTimeout(function () {
        $cell = $('.' + rowClass + ':nth-child(' + (fromY + 1) + ') .' + colClass + ':nth-child(' + (fromX + 1) + ') input');
        $cell.classList.add(endClass);
        $cell.value = symbols.end;
        endMove();
        presentScore();
      }, intervalTime);
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

  var $clone = function (node) {
    return node.cloneNode(false);
  };

  init();

})();
