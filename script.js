
let board, color, container, message;
init();

function init () {
  board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  color = 1;
  container = document.getElementById("container");
  message = document.getElementById("message");
  message.innerText = "Black's move";
  render(); 
}

function render () {
  container.innerHTML = "";
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const dir = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]]; // 定义八个方向
      const cell = document.createElement("div");
      cell.className = `cell ${board[y][x]===1?"black":""} ${board[y][x]===2?"white":""}`;
      
      container.appendChild(cell);

      //棋盘点击判断
      cell.addEventListener("click", () => {
        reverse();
        render();
      });
          
      function reverse () {
        this.turn = false;

        if (board[y][x] !== 0) { // 如果此格已有棋子，返回
          return;
        }   

        // 八个方向判断
        for (let i = 0; i < 8; i++) {
          this.canMove = false;
          judge(y, x, dir, i); // 判断落子
          if(this.canMove === true) {
            move(this.tempY, this.tempX, y, x, dir, i); // 执行落子并吃子
          }             
        }
        nextTurn(); // 改变落子角色
      }

      // 吃子规则：
      // 对每个方向进行判断：从点击处往回找，如果找出界了那么该方向行不通
      // 如果是对方的棋子，继续往回找
      // 如果是自己的棋子，当hasOpposite = true，判定可落子，停止往回找
      // 如果为空，停止往回找
      function judge (oy, ox, dir, i) {
        let tempY = oy + dir[i][0]; // ox, oy：original落子位置
        let tempX = ox + dir[i][1]; // 准备判断相邻棋子，临时保存棋子位置
        let hasOpposite = false;
        while (tempX >= 0 && tempX < 8 && tempY >= 0 && tempY <8) {
          if (board[tempY][tempX] === 3 - color) {
            hasOpposite = true;
            tempY += dir[i][0];
            tempX += dir[i][1]; //继续执行后面的代码，需要再次判断tempX、tempY是否在界内
          } 
          if (tempX >= 0 && tempX < 8 && tempY >= 0 && tempY <8) {
            if (board[tempY][tempX] === color) {

              if (hasOpposite) {
                this.tempY = tempY;
                this.tempX = tempX;
                this.canMove = true;
                this.turn = true;

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
        while(tempX != ox || tempY != oy) {
          tempX -= dir[i][1];
          tempY -= dir[i][0];
          board[tempY][tempX] = color;
        }
      } 

      // 改变落子角色
      function nextTurn () {
        // 循环八个方向结束后，改变落子角色
        if(this.turn === true) {
          color = 3 - color; 
          message.innerText = `${color === 1?"Black":"White"}'s move`;
        }
        this.turn = false;
        // 遍历棋盘，判断是否有处落子
        let mapMove = new Promise(resolve => {
          for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
              if (board[y][x] !== 0) { // 如果此格已有棋子，返回
                continue;
              }
              for (let i = 0; i < 8; i++) {
                judge(y, x, dir, i);
              }
              if (this.turn === true) { // 有处落子，返回
                return;
              }
            }
          }
          resolve();
        }).then(() => {
          return new Promise(resolve => {
            if (this.turn === false) {
              color = 3 - color; // 当一方无处落子，改变落子角色
              message.innerText = `No legal move for ${color===1?"White":"Black"}\n${color===1?"Black":"White"}'s move`;
              resolve();
            }
          })
        }).then(() => {
          return mapMove()  // 再次遍历棋盘，判断是否还可落子
        }).then(() => {
          if (this.turn === false) {
            judgeResult(); // 当双方都无处落子，判断胜负
          }
        })     
      }

      // 判断胜负
      function judgeResult () {
        let blackNum = 0, whiteNum = 0;

        for (y = 0; y < 8; y++) {
          for (x = 0; x < 8; x++) {
            if (board[y][x] === 1) {
              blackNum += 1;
            } else if (board[y][x] === 2) {
              whiteNum += 1;
            }
          }
        }
        if (blackNum === whiteNum) {
          message.innerText = `Black: ${blackNum} vs White: ${whiteNum}\nDraw!`;
        } else if (blackNum === whiteNum) {
          message.innerText = `Black: ${blackNum} vs White: ${whiteNum}\nThe winner is Black!`;
        } else {
          message.innerText = `Black: ${blackNum} vs White: ${whiteNum}\nThe winner is White!`;
        }
      } 

    }
  }
}


