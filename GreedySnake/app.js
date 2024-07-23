//確保文檔準備就緒後再執行JS Code
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("myCanvas");

  // 回傳一個canvas的drawing context, drawing context可以用來在canvas內畫圖
  const ctx = canvas.getContext("2d");

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
  }

  function draw() {
    // 清空畫布重畫
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    console.log("正在執行draw");
    for (let i = 0; i < snake.length; i++) {
      //頭是亮橘色, 身體是亮粉紅色
      if (i == 0) {
        ctx.fillStyle = "lightsalmon";
      } else {
        ctx.fillStyle = "lightpink";
      }
      //外框顏色
      ctx.strokeStyle = "white";

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
    snake.pop();
    snake.unshift(newHead);
  }

  //每0.1秒執行一次draw
  let myGame = setInterval(draw, 100);
});
