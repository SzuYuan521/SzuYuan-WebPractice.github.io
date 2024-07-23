//確保文檔準備就緒後再執行JS Code
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("myCanvas");

  // 回傳一個canvas的drawing context, drawing context可以用來在canvas內畫圖
  const ctx = canvas.getContext("2d");

  // 分數
  let score = 0;
  document.getElementById("myScore").innerHTML = "遊戲分數: " + score;

  // 最高分數
  let highestScore = 0;
  loadHighestScore();

  // 蛇身體一格長度
  const unit = 20;

  // 320/20=16行
  const row = canvas.height / unit;

  // 320/20=16列
  const column = canvas.width / unit;

  // array中的每個元素都是一個物件, 物件的工作是儲存身體的x,y座標
  let snake = [
    { x: 80, y: 0 },
    { x: 60, y: 0 },
    { x: 40, y: 0 },
    { x: 20, y: 0 },
  ]; // 初始位置

  // 果實:隨機生成位置
  class Fruit {
    constructor() {
      let overlapping;
      do {
        this.x = Math.floor(Math.random() * column) * unit;
        this.y = Math.floor(Math.random() * row) * unit;
        overlapping = this.checkOverlapping();
      } while (overlapping);
    }

    // 畫出果實
    drawFruit() {
      ctx.fillStyle = "yellow";
      ctx.fillRect(this.x, this.y, unit, unit);
    }

    // 檢查是否跟蛇身體有重疊
    checkOverlapping() {
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x == this.x && snake[i].y == this.y) {
          return true;
        }
      }
      return false;
    }

    // 重新選定果實位置
    pickLocation() {
      let overlapping;
      let new_x;
      let new_y;

      do {
        new_x = Math.floor(Math.random() * column) * unit;
        new_y = Math.floor(Math.random() * row) * unit;
        // 指定新果實位置
        this.x = new_x;
        this.y = new_y;

        // 檢查是否重疊
        overlapping = this.checkOverlapping();
      } while (overlapping);
    }
  }

  let myFruit = new Fruit();

  // 添加按鍵監聽
  window.addEventListener("keydown", changeDirection);

  // 貪食蛇行進方向
  let direction = "Right";

  // 按下方向鍵改變方向
  function changeDirection(event) {
    if (event.key == "ArrowRight" && direction != "Left") {
      direction = "Right";
    } else if (event.key == "ArrowLeft" && direction != "Right") {
      direction = "Left";
    } else if (event.key == "ArrowUp" && direction != "Down") {
      direction = "Up";
    } else if (event.key == "ArrowDown" && direction != "Up") {
      direction = "Down";
    }

    // [防呆] 每次按下方向鍵後, 在下一次draw之前, 不接受任何keydown事件, 防止方向衝突
    window.removeEventListener("keydown", changeDirection);
  }

  function draw() {
    // 每次畫圖前, 確認蛇有沒有咬到自己
    for (let i = 1; i < snake.length; i++) {
      if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
        // 結束執行draw()
        clearInterval(myGame);

        alert("遊戲結束");

        // 判斷是否是最高分
        setHighestScore();
        return;
      }
    }

    // 清空畫布重畫
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    myFruit.drawFruit();

    for (let i = 0; i < snake.length; i++) {
      //頭是亮橘色, 身體是亮粉紅色
      if (i == 0) {
        ctx.fillStyle = "lightsalmon";
      } else {
        ctx.fillStyle = "lightpink";
      }
      //外框顏色
      ctx.strokeStyle = "white";

      //判斷是否碰到牆須穿牆
      if (snake[i].x >= canvas.width) {
        snake[i].x = 0;
      }

      if (snake[i].x < 0) {
        snake[i].x = canvas.width - unit;
      }

      if (snake[i].y >= canvas.height) {
        snake[i].y = 0;
      }

      if (snake[i].y < 0) {
        snake[i].y = canvas.height - unit;
      }

      ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
      ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    }

    // 以目前direction變數方向,來決定蛇的下一禎要放在哪個座標
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    switch (direction) {
      case "Right":
        snakeX += unit;
        break;
      case "Left":
        snakeX -= unit;
        break;
      case "Up":
        snakeY -= unit;
        break;
      case "Down":
        snakeY += unit;
        break;
    }

    let newHead = {
      x: snakeX,
      y: snakeY,
    };

    // 確認蛇是否有吃到果實
    if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
      // 重新選定一個新的隨機位置
      myFruit.pickLocation();

      // 更新分數
      score++;
      document.getElementById("myScore").innerHTML = "遊戲分數: " + score;
    } else {
      snake.pop();
    }
    snake.unshift(newHead);

    // 加回按鍵監聽
    window.addEventListener("keydown", changeDirection);
  }

  //每0.1秒執行一次draw
  let myGame = setInterval(draw, 100);

  // 讀入最高分數並顯示
  function loadHighestScore() {
    if (localStorage.getItem("highestScore") == null) {
      highestScore = 0;
    } else {
      highestScore = localStorage.getItem("highestScore");
    }
    document.getElementById("highestScore").innerHTML =
      "最高分數: " + highestScore;
  }

  // 設定最高分數
  function setHighestScore() {
    // 如果分數比原本最高分數大,則儲存新的最高分
    if (score > highestScore) {
      localStorage.setItem("highestScore", score);
    }
    // 更新顯示最高分
    document.getElementById("highestScore").innerHTML = "最高分數: " + score;
  }
});
