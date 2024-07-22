//確保文檔準備就緒後再執行JS Code
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("myCanvas");

  // 回傳一個canvas的drawing context, drawing context可以用來在canvas內畫圖
  const ctx = canvas.getContext("2d");

  // 蛇身體一格長度
  const unit = 20;

  // 320/20=16
  const row = canvas.height / unit;

  // 320/20=16
  const column = canvas.width / unit;

  // array中的每個元素都是一個物件, 物件的工作是儲存身體的x,y座標
  let snake = [
    { x: 80, y: 0 },
    { x: 60, y: 0 },
    { x: 40, y: 0 },
    { x: 20, y: 0 },
  ]; //初始位置

  for (let i = 0; i < snake.length; i++) {
    //頭是亮橘色, 身體是亮粉紅色
    if (i == 0) {
      ctx.fillStyle = "lightsalmon";
    } else {
      ctx.fillStyle = "lightpink";
    }
    //外框顏色
    ctx.strokeStyle = "white";

    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
});
