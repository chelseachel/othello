/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var board = void 0,
    color = void 0,
    container = void 0,
    message = void 0;
var canMove = void 0,
    turn = void 0;
var eatY = void 0,
    eatX = void 0;
init();

function init() {
  board = [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 2, 1, 0, 0, 0], [0, 0, 0, 1, 2, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]];
  color = 1;
  container = document.getElementById("container");
  message = document.getElementById("message");
  message.innerText = "Black's move";
  render();
}

function render() {
  container.innerHTML = "";

  var _loop = function _loop(_y) {
    var _loop2 = function _loop2(_x) {
      var dir = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]; // 定义八个方向
      var cell = document.createElement("div");
      cell.className = "cell " + (board[_y][_x] === 1 ? "black" : "") + " " + (board[_y][_x] === 2 ? "white" : "");

      container.appendChild(cell);

      //棋盘点击判断
      cell.addEventListener("click", function () {
        reverse();
        render();
      });

      function reverse() {
        turn = false;

        if (board[_y][_x] !== 0) {
          // 如果此格已有棋子，返回
          return;
        }

        // 八个方向判断
        for (var i = 0; i < 8; i++) {
          canMove = false;
          judge(_y, _x, dir, i); // 判断落子
          if (canMove === true) {
            move(eatY, eatX, _y, _x, dir, i); // 执行落子并吃子
          }
        }
        nextTurn(); // 改变落子角色
      }

      // 吃子规则：
      // 对每个方向进行判断：从点击处往回找，如果找出界了那么该方向行不通
      // 如果是对方的棋子，继续往回找
      // 如果是自己的棋子，当hasOpposite = true，判定可落子，停止往回找
      // 如果为空，停止往回找
      function judge(oy, ox, dir, i) {
        var tempY = oy + dir[i][0]; // ox, oy：original落子位置
        var tempX = ox + dir[i][1]; // 准备判断相邻棋子，临时保存棋子位置
        var hasOpposite = false;
        while (tempX >= 0 && tempX < 8 && tempY >= 0 && tempY < 8) {
          if (board[tempY][tempX] === 3 - color) {
            hasOpposite = true;
            tempY += dir[i][0];
            tempX += dir[i][1]; //继续执行后面的代码，需要再次判断tempX、tempY是否在界内
          }
          if (tempX >= 0 && tempX < 8 && tempY >= 0 && tempY < 8) {
            if (board[tempY][tempX] === color) {

              if (hasOpposite) {
                eatY = tempY;
                eatX = tempX;
                canMove = true;
                turn = true;
              }
              break;
            }
            if (board[tempY][tempX] === 0) {
              break;
            }
          }
        }
      }

      // 落子成功，反方向吃子
      function move(tempY, tempX, oy, ox, dir, i) {
        while (tempX != ox || tempY != oy) {
          tempX -= dir[i][1];
          tempY -= dir[i][0];
          board[tempY][tempX] = color;
        }
      }

      // 改变落子角色
      function nextTurn() {
        // 循环八个方向结束后，改变落子角色
        if (turn === true) {
          color = 3 - color;
          message.innerText = (color === 1 ? "Black" : "White") + "'s move";
        }
        turn = false;
        // 遍历棋盘，判断是否有处落子
        var mapMove = new Promise(function (resolve) {
          for (var _y2 = 0; _y2 < 8; _y2++) {
            for (var _x2 = 0; _x2 < 8; _x2++) {
              if (board[_y2][_x2] !== 0) {
                // 如果此格已有棋子，返回
                continue;
              }
              for (var i = 0; i < 8; i++) {
                judge(_y2, _x2, dir, i);
              }
              if (turn === true) {
                // 有处落子，返回
                return;
              }
            }
          }
          resolve();
        }).then(function () {
          return new Promise(function (resolve) {
            if (turn === false) {
              color = 3 - color; // 当一方无处落子，改变落子角色
              message.innerText = "No legal move for " + (color === 1 ? "White" : "Black") + "\n" + (color === 1 ? "Black" : "White") + "'s move";
              resolve();
            }
          });
        }).then(function () {
          return mapMove(); // 再次遍历棋盘，判断是否还可落子
        }).then(function () {
          if (turn === false) {
            judgeResult(); // 当双方都无处落子，判断胜负
          }
        });
      }

      // 判断胜负
      function judgeResult() {
        var blackNum = 0,
            whiteNum = 0;

        for (_y = 0; _y < 8; _y++) {
          for (_x = 0; _x < 8; _x++) {
            if (board[_y][_x] === 1) {
              blackNum += 1;
            } else if (board[_y][_x] === 2) {
              whiteNum += 1;
            }
          }
        }
        if (blackNum === whiteNum) {
          message.innerText = "Black: " + blackNum + " vs White: " + whiteNum + "\nDraw!";
        } else if (blackNum === whiteNum) {
          message.innerText = "Black: " + blackNum + " vs White: " + whiteNum + "\nThe winner is Black!";
        } else {
          message.innerText = "Black: " + blackNum + " vs White: " + whiteNum + "\nThe winner is White!";
        }
      }

      x = _x;
    };

    for (var x = 0; x < 8; x++) {
      _loop2(x);
    }
    y = _y;
  };

  for (var y = 0; y < 8; y++) {
    _loop(y);
  }
}

/***/ })
/******/ ]);