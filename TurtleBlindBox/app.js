document.addEventListener("DOMContentLoaded", () => {
  const width = 3;
  const height = 3;

  const gameContainer = document.getElementById("gameContainer");
  const startButton = document.getElementById("startButton");

  // 暫建一個開始遊戲按鈕
  startButton.addEventListener("click", startGame);

  // 烏龜顏色array, 同時也是初始化的排列順序
  const turtleColors = [
    "blue-turtle",
    "pink-turtle",
    "yellow-turtle",
    "green-turtle",
    "darkpink-turtle",
    "purple-turtle",
    "orange-turtle",
    "brown-turtle",
    "turquoise-turtle",
  ];

  function startGame() {
    gameContainer.innerHTML = "";

    // 創建遊戲面版
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < width * height; i++) {
      const cell = createCell(i, turtleColors[i]);
      fragment.appendChild(cell);
    }
    gameContainer.appendChild(fragment);
  }

  // 創建格子, id: index, color: 烏龜顏色
  function createCell(id, color) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-id", id);
    cell.setAttribute("data-color", color);

    // 烏龜圖片初始化, 可以選擇幸運色龜龜
    const imgElement = document.createElement("img");
    imgElement.src = `img/${color}.png`;
    imgElement.alt = `${color} turtle`;
    imgElement.classList.add("turtle-image");
    cell.appendChild(imgElement);

    // 用來顯示格子是第幾格
    const indexElement = document.createElement("p");
    indexElement.classList.add("index");
    indexElement.textContent = id + 1;
    cell.appendChild(indexElement);

    return cell;
  }
});
