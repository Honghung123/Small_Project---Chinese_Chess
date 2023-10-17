const lengthOfCell = 77.5;
const offsetLeftChess = 8;
const offsetTopChess = 11;
const $chessBoard = $(".chess_board");
const $wrapper = $(".wrapper");
let isRedFirst = $chessBoard.hasClass("redFirst");
let redTurn = isRedFirst;
let blueTurn = !redTurn;
updateTurnGameInfo(false);

var chessArr = [
  [1, "車", 1, 1, 0, 0],
  [2, "車", 1, 1, 8, 0],
  [3, "马", 2, 1, 1, 0],
  [4, "马", 2, 1, 7, 0],
  [5, "相", 3, 1, 2, 0],
  [6, "相", 3, 1, 6, 0],
  [7, "仕", 4, 1, 3, 0],
  [8, "仕", 4, 1, 5, 0],
  [9, "帅", 5, 1, 4, 0],
  [10, "砲", 6, 1, 1, 2],
  [11, "砲", 6, 1, 7, 2],
  [12, "兵", 7, 1, 0, 3],
  [13, "兵", 7, 1, 2, 3],
  [14, "兵", 7, 1, 4, 3],
  [15, "兵", 7, 1, 6, 3],
  [16, "兵", 7, 1, 8, 3],
  [17, "車", 11, -1, 0, 9],
  [18, "車", 11, -1, 8, 9],
  [19, "马", 12, -1, 1, 9],
  [20, "马", 12, -1, 7, 9],
  [21, "象", 13, -1, 2, 9],
  [22, "象", 13, -1, 6, 9],
  [23, "士", 14, -1, 3, 9],
  [24, "士", 14, -1, 5, 9],
  [25, "将", 15, -1, 4, 9],
  [26, "炮", 16, -1, 7, 7],
  [27, "炮", 16, -1, 1, 7],
  [28, "卒", 17, -1, 0, 6],
  [29, "卒", 17, -1, 2, 6],
  [30, "卒", 17, -1, 4, 6],
  [31, "卒", 17, -1, 6, 6],
  [32, "卒", 17, -1, 8, 6],
];
function createNewCoodChess() {
  coodinateChesses = [];
  for (let i = 0; i < 32; i++) {
    let coodChess = [];
    coodChess.push(chessArr[i][0], chessArr[i][4], chessArr[i][5]);
    coodinateChesses.push(coodChess);
  }
  return coodinateChesses;
}
let coodinateChesses = [];

function createNewChessBoard() {
  for (let chess of chessArr) {
    const $chess = $("<div></div>")
      .attr({
        id: `${chess[0]}`,
        idChess: `${chess[2]}`,
      })
      .addClass(chess[3] == 1 ? "chess darkblue" : "chess red")
      .css({
        left: setLocation(chess[4], offsetLeftChess) + "px",
        top: setLocation(chess[5], offsetTopChess) + "px",
      })
      .text(chess[1])
      .click(onClickChess);
    draggableChess($chess);
    $chess.appendTo($chessBoard);
    coodinateChesses = createNewCoodChess();
  }
  updateRule();
  redTurn = isRedFirst;
  blueTurn = !isRedFirst;
  updateTurnGameInfo(false);
}
createNewChessBoard();

function draggableChess($chess) {
  $chess.draggable({
    scroll: false,
    containment: ".chess_board",
    revert: false,
    helper: "clone",
    disable: false,
    start: function (event, ui) {
      if (
        (parseInt($(this).attr("idChess")) < 10 && blueTurn) ||
        (parseInt($(this).attr("idChess")) > 10 && redTurn)
      ) {
        turnOffLastActiveChess();
        clearAllMarker();
        $(this).addClass("active");
        showPositionCanGo(this);
      }
    },
    drag: function (event, ui) {},
    stop: function (event, ui) {
      $(this).removeClass("active");
      clearAllMarker();
    },
  });
}

function droppableChess($marker) {
  $marker.droppable({
    accept: ".chess.active",
    drop: function (event, ui) {
      const cellIndexTop = getCellIndexTopOnChessBoard(this);
      const cellIndexLeft = getCellIndexLeftOnChessBoard(this);
      const chess = $(".chess.active").get(0);
      removeElementAtPositionExceptThis(chess.id, cellIndexLeft, cellIndexTop);
      updateChessCoods(chess.id, cellIndexLeft, cellIndexTop);
      updateChessPosition(chess, cellIndexLeft, cellIndexTop);
      updateTurnGameInfo(true);
      clearAllMarker();
      checkTuongChessIsAlive();
    },
  });
}

function onClickChess() {
  clearAllMarker();
  checkTuongChessIsAlive();

  if ($(this).hasClass("active")) {
    $(this).removeClass("active");
  } else if (
    (redTurn && $(this).hasClass("red")) ||
    (blueTurn && $(this).hasClass("darkblue"))
  ) {
    turnOffLastActiveChess();
    $(this).addClass("active");
    showPositionCanGo(this);
  }
}

function turnOffLastActiveChess() {
  $(".chess.active").removeClass("active");
}

function addMarker(left, top) {
  const $marker = $("<div></div>")
    .addClass("marker")
    .css({
      left: setLocation(left, offsetLeftChess) + "px",
      top: setLocation(top, offsetTopChess) + "px",
    });
  droppableChess($marker);
  $marker.appendTo($chessBoard);
}

function addEventMarker() {
  $(".marker").each(function () {
    $(this).on("click", function () {
      const chess = $(".chess.active").get(0);
      const offsetLeftCell = getCellIndexLeftOnChessBoard(this);
      const offsetTopCell = getCellIndexTopOnChessBoard(this);
      removeElementAtPosition(offsetLeftCell, offsetTopCell);
      if (chess) {
        updateChessCoods(chess.id, offsetLeftCell, offsetTopCell);
        updateChessPosition(chess, offsetLeftCell, offsetTopCell);
        updateTurnGameInfo(true);
        chess.classList.remove("active");
        clearAllMarker();
      }
      checkTuongChessIsAlive();
    });
  });
}

function getCellIndexLeftOnChessBoard(chess) {
  return Math.round((chess.offsetLeft - offsetLeftChess) / lengthOfCell);
}
function getCellIndexTopOnChessBoard(chess) {
  return Math.round((chess.offsetTop - offsetTopChess) / lengthOfCell);
}

function canGo(left, top) {
  let flag = true;
  if (left >= 0 && left <= 8 && top >= 0 && top <= 9) {
    flag = true;
  } else {
    flag = false;
  }
  return flag;
}

function showPositionCanGo(chess) {
  const idChess = chess.getAttribute("idChess");
  let step = 1;
  let cellIndexLeft = getCellIndexLeftOnChessBoard(chess);
  let cellIndexTop = getCellIndexTopOnChessBoard(chess);

  if (idChess == "7" || idChess == "17") {
    let color = idChess == "7" ? 1 : -1;

    totChessMovement(cellIndexLeft, cellIndexTop, step, color);
  }

  if (idChess == "6" || idChess == "16") {
    let color = idChess == "6" ? 1 : -1;

    goForwardUntilMeetChess(cellIndexLeft, cellIndexTop, step, color, false);
    goBackwardUntilMeetChess(cellIndexLeft, cellIndexTop, step, color, false);
    goLeftUntilMeetChess(cellIndexLeft, cellIndexTop, step, color, false);
    goRightUntilMeetChess(cellIndexLeft, cellIndexTop, step, color, false);
    addMarkerForCannonChess(cellIndexLeft, cellIndexTop, step, color);
  }

  if (idChess == "1" || idChess == "11") {
    let color = idChess == "1" ? 1 : -1;

    goForwardUntilMeetChess(cellIndexLeft, cellIndexTop, step, color);
    goBackwardUntilMeetChess(cellIndexLeft, cellIndexTop, step, color);
    goLeftUntilMeetChess(cellIndexLeft, cellIndexTop, step, color);
    goRightUntilMeetChess(cellIndexLeft, cellIndexTop, step, color);
  }

  if (idChess == "2" || idChess == "12") {
    let idChessColor = idChess == "2" ? 1 : -1;

    goForwardShapeL(cellIndexLeft, cellIndexTop, idChessColor);
    goBackwardShapeL(cellIndexLeft, cellIndexTop, idChessColor);
    goLeftShapeL(cellIndexLeft, cellIndexTop, idChessColor);
    goRightShapeL(cellIndexLeft, cellIndexTop, idChessColor);
  }

  if (idChess == "3" || idChess == "13") {
    let color = idChess == "3" ? 1 : -1;

    goForwardSkew2X(cellIndexLeft, cellIndexTop, color);
    goBackwardSkew2X(cellIndexLeft, cellIndexTop, color);
  }

  if (idChess == "4" || idChess == "14") {
    let idChessColor = idChess == "4" ? 1 : -1;

    goForwardSkew(cellIndexLeft, cellIndexTop, idChessColor);
    goBackwardSkew(cellIndexLeft, cellIndexTop, idChessColor);
  }

  if (idChess == "5" || idChess == "15") {
    let color = idChess == "5" ? 1 : -1;

    goAroundSpecificSquare(cellIndexLeft, cellIndexTop, color);
  }
  addEventMarker();
}

function hasChessAtPlace(cellIndexLeft, cellIndexTop) {
  let idColorChess = 0;
  $(".chess").each(function () {
    const cellIndexLeftChess = getCellIndexLeftOnChessBoard(this);
    const cellIndexTopChess = getCellIndexTopOnChessBoard(this);
    if (
      cellIndexLeftChess == cellIndexLeft &&
      cellIndexTopChess == cellIndexTop
    ) {
      idColorChess = $(this).hasClass("darkblue") ? 1 : -1;
    }
  });
  return idColorChess;
}

function totChessMovement(cellIndexLeft, cellIndexTop, step, color) {
  if (canGoForward(cellIndexLeft, cellIndexTop, step, color)) {
    if (hasChessAtPlace(cellIndexLeft, cellIndexTop + step * color) != color) {
      addMarker(cellIndexLeft, cellIndexTop + step * color);
    }
  }
  if (goAcrossRiver(color, cellIndexTop)) {
    if (canGoLeft(cellIndexLeft, cellIndexTop, step)) {
      if (hasChessAtPlace(cellIndexLeft - step, cellIndexTop) != color) {
        addMarker(cellIndexLeft - step, cellIndexTop);
      }
    }
    if (canGoRight(cellIndexLeft, cellIndexTop, step)) {
      if (hasChessAtPlace(cellIndexLeft + step, cellIndexTop) != color) {
        addMarker(cellIndexLeft + step, cellIndexTop);
      }
    }
  }
}

function canGoForward(left, top, step, color) {
  let goForward = top + color * step;
  return canGo(left, goForward) ? true : false;
}
function goForwardUntilMeetChess(
  cellIndexLeft,
  cellIndexTop,
  step,
  color,
  include = true
) {
  while (canGoForward(cellIndexLeft, cellIndexTop, step, color)) {
    if (hasChessAtPlace(cellIndexLeft, cellIndexTop + step * color) == 0) {
      addMarker(cellIndexLeft, cellIndexTop + step * color);
    } else if (
      hasChessAtPlace(cellIndexLeft, cellIndexTop + step * color) != color &&
      include
    ) {
      addMarker(cellIndexLeft, cellIndexTop + step * color);
      break;
    } else {
      break;
    }
    cellIndexTop += step * color;
  }
}

function canGoBackward(left, top, step, color) {
  let goBack = top - color * step;
  return canGo(left, goBack) ? true : false;
}
function goBackwardUntilMeetChess(
  cellIndexLeft,
  cellIndexTop,
  step,
  color,
  include = true
) {
  while (canGoBackward(cellIndexLeft, cellIndexTop, step, color)) {
    if (hasChessAtPlace(cellIndexLeft, cellIndexTop - step * color) == 0) {
      addMarker(cellIndexLeft, cellIndexTop - step * color);
    } else if (
      hasChessAtPlace(cellIndexLeft, cellIndexTop - step * color) != color &&
      include
    ) {
      addMarker(cellIndexLeft, cellIndexTop - step * color);
      break;
    } else {
      break;
    }
    cellIndexTop -= step * color;
  }
}

function canGoLeft(left, top, step) {
  let goLeft = left - step;
  return canGo(goLeft, top) ? true : false;
}
function goLeftUntilMeetChess(
  cellIndexLeft,
  cellIndexTop,
  step,
  color,
  include = true
) {
  while (canGoLeft(cellIndexLeft, cellIndexTop, step)) {
    if (hasChessAtPlace(cellIndexLeft - step, cellIndexTop) == 0) {
      addMarker(cellIndexLeft - step, cellIndexTop);
    } else if (
      hasChessAtPlace(cellIndexLeft - step, cellIndexTop) != color &&
      include
    ) {
      addMarker(cellIndexLeft - step, cellIndexTop);
      break;
    } else {
      break;
    }
    cellIndexLeft -= step;
  }
}

function canGoRight(left, top, step) {
  let goRight = left + step;
  return canGo(goRight, top) ? true : false;
}
function goRightUntilMeetChess(
  cellIndexLeft,
  cellIndexTop,
  step,
  color,
  include = true
) {
  while (canGoRight(cellIndexLeft, cellIndexTop, step)) {
    if (hasChessAtPlace(cellIndexLeft + step, cellIndexTop) == 0) {
      addMarker(cellIndexLeft + step, cellIndexTop);
    } else if (
      hasChessAtPlace(cellIndexLeft + step, cellIndexTop) != color &&
      include
    ) {
      addMarker(cellIndexLeft + step, cellIndexTop);
      break;
    } else {
      break;
    }
    cellIndexLeft += step;
  }
}
function addMarkerForCannonChess(cellIndexLeft, cellIndexTop, step, color) {
  let top = cellIndexTop;
  let bot = cellIndexTop;
  let left = cellIndexLeft;
  let right = cellIndexLeft;
  while (canGoForward(cellIndexLeft, top, step, color)) {
    if (hasChessAtPlace(cellIndexLeft, top + step * color, step, color) != 0) {
      top += step * color;
      while (canGoForward(cellIndexLeft, top, step, color)) {
        if (hasChessAtPlace(cellIndexLeft, top + step * color) == -color) {
          addMarker(cellIndexLeft, top + step * color);
          break;
        } else {
          top += step * color;
        }
      }
      break;
    } else {
      top += step * color;
    }
  }
  while (canGoBackward(cellIndexLeft, bot, step, color)) {
    if (hasChessAtPlace(cellIndexLeft, bot - step * color, step, color) != 0) {
      bot -= step * color;
      while (canGoBackward(cellIndexLeft, bot, step, color)) {
        if (hasChessAtPlace(cellIndexLeft, bot - step * color) == -color) {
          addMarker(cellIndexLeft, bot - step * color);
          break;
        } else {
          bot -= step * color;
        }
      }
      break;
    } else {
      bot -= step * color;
    }
  }
  while (canGoLeft(left, cellIndexTop, step, color)) {
    if (hasChessAtPlace(left - step, cellIndexTop, step, color) != 0) {
      left -= step;
      while (canGoLeft(left, cellIndexTop, step, color)) {
        if (hasChessAtPlace(left - step, cellIndexTop) == -color) {
          addMarker(left - step, cellIndexTop);
          break;
        } else {
          left -= step;
        }
      }
      break;
    } else {
      left -= step;
    }
  }
  while (canGoRight(right, cellIndexTop, step, color)) {
    if (hasChessAtPlace(right + step, cellIndexTop, step, color) != 0) {
      right += step;
      while (canGoRight(right, cellIndexTop, step, color)) {
        if (hasChessAtPlace(right + step, cellIndexTop) == -color) {
          addMarker(right + step, cellIndexTop);
          break;
        } else {
          right += step;
        }
      }
      break;
    } else {
      right += step;
    }
  }
}
function goAcrossRiver(idColorChess, celltop) {
  if (idColorChess == 1 && celltop >= 5 && celltop <= 9) {
    return true;
  } else if (idColorChess == -1 && celltop >= 0 && celltop <= 4) {
    return true;
  }
  return false;
}

function goForwardShapeL(cellIndexLeft, cellIndexTop, color) {
  if (hasChessAtPlace(cellIndexLeft, cellIndexTop + color) == 0) {
    if (canGo(cellIndexLeft + 1, cellIndexTop + 2 * color)) {
      if (
        hasChessAtPlace(cellIndexLeft + 1, cellIndexTop + 2 * color) != color
      ) {
        addMarker(cellIndexLeft + 1, cellIndexTop + 2 * color);
      }
    }
    if (canGo(cellIndexLeft - 1, cellIndexTop + 2 * color)) {
      if (
        hasChessAtPlace(cellIndexLeft - 1, cellIndexTop + 2 * color) != color
      ) {
        addMarker(cellIndexLeft - 1, cellIndexTop + 2 * color);
      }
    }
  }
}
function goBackwardShapeL(cellIndexLeft, cellIndexTop, color) {
  if (hasChessAtPlace(cellIndexLeft, cellIndexTop - color) == 0) {
    if (canGo(cellIndexLeft + 1, cellIndexTop - 2 * color)) {
      if (
        hasChessAtPlace(cellIndexLeft + 1, cellIndexTop - 2 * color) != color
      ) {
        addMarker(cellIndexLeft + 1, cellIndexTop - 2 * color);
      }
    }
    if (canGo(cellIndexLeft - 1, cellIndexTop - 2 * color)) {
      if (
        hasChessAtPlace(cellIndexLeft - 1, cellIndexTop - 2 * color) != color
      ) {
        addMarker(cellIndexLeft - 1, cellIndexTop - 2 * color);
      }
    }
  }
}
function goLeftShapeL(cellIndexLeft, cellIndexTop, color) {
  if (hasChessAtPlace(cellIndexLeft - 1, cellIndexTop) == 0) {
    if (canGo(cellIndexLeft - 2, cellIndexTop + 1)) {
      if (hasChessAtPlace(cellIndexLeft - 2, cellIndexTop + 1) != color) {
        addMarker(cellIndexLeft - 2, cellIndexTop + 1);
      }
    }
    if (canGo(cellIndexLeft - 2, cellIndexTop - 1)) {
      if (hasChessAtPlace(cellIndexLeft - 2, cellIndexTop - 1) != color) {
        addMarker(cellIndexLeft - 2, cellIndexTop - 1);
      }
    }
  }
}
function goRightShapeL(cellIndexLeft, cellIndexTop, color) {
  if (hasChessAtPlace(cellIndexLeft + 1, cellIndexTop) == 0) {
    if (canGo(cellIndexLeft + 2, cellIndexTop + 1)) {
      if (hasChessAtPlace(cellIndexLeft + 2, cellIndexTop + 1) != color) {
        addMarker(cellIndexLeft + 2, cellIndexTop + 1);
      }
    }
    if (canGo(cellIndexLeft + 2, cellIndexTop - 1)) {
      if (hasChessAtPlace(cellIndexLeft + 2, cellIndexTop - 1) != color) {
        addMarker(cellIndexLeft + 2, cellIndexTop - 1);
      }
    }
  }
}

function goForwardSkew2X(cellIndexLeft, cellIndexTop, color) {
  if (hasChessAtPlace(cellIndexLeft + 1, cellIndexTop + color) == 0) {
    if (
      canGo(cellIndexLeft + 2, cellIndexTop + 2 * color) &&
      IsNotGoCrossRiver(color, cellIndexTop + 2 * color)
    ) {
      if (
        hasChessAtPlace(cellIndexLeft + 2, cellIndexTop + 2 * color) != color
      ) {
        addMarker(cellIndexLeft + 2, cellIndexTop + 2 * color);
      }
    }
  }
  if (hasChessAtPlace(cellIndexLeft - 1, cellIndexTop + color) == 0) {
    if (
      canGo(cellIndexLeft - 2, cellIndexTop + 2 * color) &&
      IsNotGoCrossRiver(color, cellIndexTop + 2 * color)
    ) {
      if (
        hasChessAtPlace(cellIndexLeft - 2, cellIndexTop + 2 * color) != color
      ) {
        addMarker(cellIndexLeft - 2, cellIndexTop + 2 * color);
      }
    }
  }
}
function goBackwardSkew2X(cellIndexLeft, cellIndexTop, color) {
  if (hasChessAtPlace(cellIndexLeft - 1, cellIndexTop - color) == 0) {
    if (
      canGo(cellIndexLeft + 2, cellIndexTop - 2 * color) &&
      IsNotGoCrossRiver(color, cellIndexTop - 2 * color)
    ) {
      if (
        hasChessAtPlace(cellIndexLeft + 2, cellIndexTop - 2 * color) != color
      ) {
        addMarker(cellIndexLeft + 2, cellIndexTop - 2 * color);
      }
    }
  }
  if (hasChessAtPlace(cellIndexLeft - 1, cellIndexTop - color) == 0) {
    if (
      canGo(cellIndexLeft - 2, cellIndexTop - 2 * color) &&
      IsNotGoCrossRiver(color, cellIndexTop - 2 * color)
    ) {
      if (
        hasChessAtPlace(cellIndexLeft - 2, cellIndexTop - 2 * color) != color
      ) {
        addMarker(cellIndexLeft - 2, cellIndexTop - 2 * color);
      }
    }
  }
}
function IsNotGoCrossRiver(idChessColor, cellTop) {
  if (idChessColor == 1 && cellTop <= 4 && cellTop >= 0) {
    return true;
  }
  if (idChessColor == -1 && cellTop <= 9 && cellTop >= 5) {
    return true;
  }
  return false;
}

function goForwardSkew(cellIndexLeft, cellIndexTop, color) {
  if (
    canGo(cellIndexLeft + 1, cellIndexTop + color) &&
    allowInSquareArea(color, cellIndexLeft + 1, cellIndexTop + color)
  ) {
    if (hasChessAtPlace(cellIndexLeft + 1, cellIndexTop + color) != color) {
      addMarker(cellIndexLeft + 1, cellIndexTop + color);
    }
  }
  if (
    canGo(cellIndexLeft - 1, cellIndexTop + color) &&
    allowInSquareArea(color, cellIndexLeft - 1, cellIndexTop + color)
  ) {
    if (hasChessAtPlace(cellIndexLeft - 1, cellIndexTop + color) != color) {
      addMarker(cellIndexLeft - 1, cellIndexTop + color);
    }
  }
}
function goBackwardSkew(cellIndexLeft, cellIndexTop, color) {
  if (
    canGo(cellIndexLeft + 1, cellIndexTop - color) &&
    allowInSquareArea(color, cellIndexLeft + 1, cellIndexTop - color)
  ) {
    if (hasChessAtPlace(cellIndexLeft + 1, cellIndexTop - color) != color) {
      addMarker(cellIndexLeft + 1, cellIndexTop - color);
    }
  }
  if (
    canGo(cellIndexLeft - 1, cellIndexTop - color) &&
    allowInSquareArea(color, cellIndexLeft - 1, cellIndexTop - color)
  ) {
    if (hasChessAtPlace(cellIndexLeft - 1, cellIndexTop - color) != color) {
      addMarker(cellIndexLeft - 1, cellIndexTop - color);
    }
  }
}

function goAroundSpecificSquare(cellIndexLeft, cellIndexTop, color) {
  if (
    canGo(cellIndexLeft, cellIndexTop + 1) &&
    allowInSquareArea(color, cellIndexLeft, cellIndexTop + 1)
  ) {
    if (hasChessAtPlace(cellIndexLeft, cellIndexTop + 1) != color) {
      addMarker(cellIndexLeft, cellIndexTop + 1);
    }
  }
  if (
    canGo(cellIndexLeft, cellIndexTop - 1) &&
    allowInSquareArea(color, cellIndexLeft, cellIndexTop - 1)
  ) {
    if (hasChessAtPlace(cellIndexLeft, cellIndexTop - 1) != color) {
      addMarker(cellIndexLeft, cellIndexTop - 1);
    }
  }
  if (
    canGo(cellIndexLeft + 1, cellIndexTop) &&
    allowInSquareArea(color, cellIndexLeft + 1, cellIndexTop)
  ) {
    if (hasChessAtPlace(cellIndexLeft + 1, cellIndexTop) != color) {
      addMarker(cellIndexLeft + 1, cellIndexTop);
    }
  }
  if (
    canGo(cellIndexLeft - 1, cellIndexTop) &&
    allowInSquareArea(color, cellIndexLeft - 1, cellIndexTop)
  ) {
    if (hasChessAtPlace(cellIndexLeft - 1, cellIndexTop) != color) {
      addMarker(cellIndexLeft - 1, cellIndexTop);
    }
  }
}

function allowInSquareArea(chessColor, cellIndexLeft, cellIndexTop) {
  if (cellIndexLeft >= 3 && cellIndexLeft <= 5) {
    if (chessColor == 1 && cellIndexTop >= 0 && cellIndexTop <= 2) {
      return true;
    }
    if (chessColor == -1 && cellIndexTop >= 7 && cellIndexTop <= 9) {
      return true;
    }
  }
  return false;
}

// ===============================   Change or clear item on Board ============================

function changeTurnGame() {
  redTurn = blueTurn;
  blueTurn = !redTurn;
}

function updateTurnGameInfo(changeTurn) {
  if (changeTurn) {
    changeTurnGame();
  }
  $(".current_turn").html(redTurn ? "<b>ĐỎ</b>" : "<b>XANH</b>");
}
function updateRule() {
  $(".chess_rule").html(
    isRedFirst ? "Quy tắc: Đỏ đi trước" : "Quy tắc: Xanh đi trước"
  );
}

function clearAllMarker() {
  $(".marker").each(function () {
    $(this).remove();
  });
}

function setLocation(cellIndexFromStart, offsetLeftOrTopChess) {
  return offsetLeftOrTopChess + cellIndexFromStart * lengthOfCell;
}

function updateChessPosition(chess, left, top) {
  chess.style.left = setLocation(left, offsetLeftChess) + "px";
  chess.style.top = setLocation(top, offsetTopChess) + "px";
}

function updateChessCoods(idHTMLChess, cellIndexLeft, cellIndexTop) {
  for (let idx = 0; idx < coodinateChesses.length; idx++) {
    if (idHTMLChess == coodinateChesses[idx][0]) {
      coodinateChesses[idx][1] = cellIndexLeft;
      coodinateChesses[idx][2] = cellIndexTop;
    }
  }
}

function removeElementAtPosition(offsetLeftCell, offsetTopCell) {
  let idDesChess = -1;
  for (let idx = 0; idx < coodinateChesses.length; idx++) {
    if (
      coodinateChesses[idx][1] == offsetLeftCell &&
      coodinateChesses[idx][2] == offsetTopCell
    ) {
      idDesChess = coodinateChesses[idx][0];
      coodinateChesses[idx][1] = coodinateChesses[idx][2] = -1;
    }
  }
  if (idDesChess != -1) {
    $(`#${idDesChess}`).remove();
  }
}

function removeElementAtPositionExceptThis(id, offsetLeftCell, offsetTopCell) {
  let idDesChess = -1;
  for (let idx = 0; idx < coodinateChesses.length; idx++) {
    if (
      coodinateChesses[idx][0] != id &&
      coodinateChesses[idx][1] == offsetLeftCell &&
      coodinateChesses[idx][2] == offsetTopCell
    ) {
      idDesChess = coodinateChesses[idx][0];
      coodinateChesses[idx][1] = coodinateChesses[idx][2] = -1;
    }
  }
  if (idDesChess != -1) {
    $(`#${idDesChess}`).remove();
  }
}

function checkTuongChessIsAlive() {
  if ($("#9").get(0) == null) {
    setTimeout(() => {
      $(".chess").each(function () {
        $(this).off();
      });
      alert("Chúc mừng, bạn đã thắng");
    }, 200);
  }
  if ($("#25").get(0) == null) {
    setTimeout(() => {
      $(".chess").each(function () {
        $(this).off();
      });
      alert("Tiếc quá, bạn đã thua");
    }, 200);
  }
}

$(".change_rule").on("click", function () {
  const result = confirm(
    "Bạn muốn thay đổi luật không? Đỏ hoặc Xanh sẽ đi trước \nVán chơi cũng sẽ bị reset. Bạn chắc chắn không?"
  );
  if (result) {
    isRedFirst = !isRedFirst;
    removeAllAndResetGame();
  }
});

$(".resetBoard").on("click", function () {
  const result = confirm("Bạn muốn reset lại không? Ván hiện tại sẽ bị hủy");
  if (result) {
    removeAllAndResetGame();
  }
});

function removeAllAndResetGame() {
  $(".chess").each(function () {
    $(this).remove();
  });
  clearAllMarker();
  redTurn = isRedFirst;
  blueTurn = !redTurn;
  updateTurnGameInfo(false);
  createNewChessBoard();
}
