const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

// 球的x, y座標
let circleX = 160;
let circleY = 60;

// 球的半徑
let radius = 20;

// 每次移動x,y距離
let xSpeed = 20;
let ySpeed = 20;

// 彈力底盤位置
let groundX = 400;
let groundY = 500;

// 彈力底盤寬高
let groundHeight = 5;
let groundWidth = 200;

let score = 0;

let pointArray = [];

// 小點
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.height = 5;
    this.width = 5;
    this.visible = true; // 是否可見
    pointArray.push(this);
  }

  // 畫小點
  drawPoint() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  // 判斷是否碰到小點
  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }
}

// 生成50個小點
for (let i = 0; i < 50; i++) {
  new Point(getRandomInt(0, 950), getRandomInt(0, 550));
}

// 取min~max間的隨機整數
function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

// 滑鼠移動監聽
canvas.addEventListener("mousemove", (e) => {
  groundX = e.clientX;
});

function drawCircle() {
  // 確認球是否打到小點, 如果小點是可見的(沒被碰過)且碰到了, 則加分, 隱藏該小點
  pointArray.forEach((point) => {
    if (point.visible && point.touchingBall(circleX, circleY)) {
      point.visible = false;
      score++;
      console.log(score);
    }
  });

  // 如果沒有小點了則結束遊戲
  if (score == 50) {
    clearInterval(myGame);
    alert("遊戲結束");
  }

  // 球撞到彈力底盤後方向改變
  // 因為高度很小所以彈力底盤可以視為一個直線, 不考慮撞到側邊的情況
  if (
    circleX >= groundX - radius &&
    circleX <= groundX + groundWidth + radius &&
    circleY >= groundY - radius &&
    circleY <= groundY + radius
  ) {
    // 製作彈力盤"彈力"效果
    if (ySpeed > 0) {
      circleY -= 40;
    } else {
      circleY += 40;
    }
    ySpeed *= -1;
  }
  if (circleX >= canvasWidth - radius || circleX <= radius) {
    // 確認球有沒有碰到邊界
    // 反彈, x方向speed改變
    xSpeed *= -1;
  }
  if (circleY >= canvasHeight - radius || circleY <= radius) {
    // 反彈, y方向speed改變
    ySpeed *= -1;
  }

  // 更動圓的位置
  circleX += xSpeed;
  circleY += ySpeed;

  // 畫出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 畫出所有小點
  pointArray.forEach((point) => {
    if (point.visible) {
      point.drawPoint();
    }
  });

  // 畫出彈力圓球
  ctx.beginPath();
  ctx.arc(circleX, circleY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();

  // 畫出彈力底盤
  ctx.fillStyle = "orange";
  ctx.fillRect(groundX, groundY, 200, 5);
}

let myGame = setInterval(drawCircle, 25);
