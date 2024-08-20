/* 規則參考Windows XP, 9*9格有10顆地雷 */

document.addEventListener("DOMContentLoaded", () => {
  // 9*9格子
  const width = 9;
  const height = 9;

  // 10顆地雷
  const mineCount = 10;

  const gameContainer = document.getElementById("gameContainer");
  const startButton = document.getElementById("startButton");
  const toggleButton = document.getElementById("toggleButton");

  startButton.addEventListener("click", startGame);

  // 開始遊戲, 進行基礎設置
  function startGame() {
    gameContainer.innerHTML = "";

    // 創建一個儲存所有地雷和安全格的array
    // 先創建都是地雷的array, 再創建剩下的安全格, 將其合併成一個陣列, 然後打亂(洗牌)
    let mineArray = Array(mineCount)
      .fill("mine")
      .concat(Array(width * height - mineCount).fill("safe"));
    shuffle(mineArray);

    // 創建遊戲面版
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < width * height; i++) {
      const cell = createCell(i, mineArray[i]);
      fragment.appendChild(cell);
    }
    gameContainer.appendChild(fragment);

    // 事件委託, 處理格子點擊事件
    gameContainer.addEventListener("click", clickCell);

    markMode = false;
    toggleButton.textContent = "切換成標記模式";
  }

  // Fisher-Yates洗牌演算法, 時間複雜度O(n), 徹底洗牌
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // 預設為掃雷模式(標記模式關)
  let markMode = false;

  // 工具(掃雷/標記)按鈕切換事件
  toggleButton.addEventListener("click", () => {
    markMode = !markMode;
    toggleButton.textContent = markMode ? "切換成掃雷模式" : "切換成標記模式";
  });

  // 創建格子, id: index, status: mine/safe
  function createCell(id, status) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-id", id);
    cell.setAttribute("data-status", status);
    return cell;
  }

  // 點擊格子後的處理事件
  function clickCell(event) {
    if (!event.target.classList.contains("cell")) return;
    const cell = event.target;
    const cellId = cell.getAttribute("data-id");
    if (markMode) {
      toggleFlag(cell);
    } else {
      revealCell(cellId);
    }
  }

  // 揭露格子
  function revealCell(cellId) {
    const cell = document.querySelector(`[data-id='${cellId}']`);
    if (cell.classList.contains("revealed") || cell.classList.contains("flag"))
      return;

    cell.classList.add("revealed");

    // 踩到地雷
    if (cell.getAttribute("data-status") === "mine") {
      cell.textContent = "💣";
      alert("Game Over! 你踩到地雷了!");
      // 顯示所有地雷位置
      revealAllMines();
      // 遊戲結束後不給繼續點擊
      gameContainer.removeEventListener("click", clickCell);
      return;
    }

    const mineCount = countMinesAround(cellId);
    if (mineCount > 0) {
      cell.textContent = mineCount;
    } else {
      // 若周圍沒有地雷, 則再往其周圍格子找它的鄰居有沒有地雷, 直到有, 顯示數量
      const neighbors = getNeighbors(cellId);
      neighbors.forEach((neighbor) => revealCell(neighbor));
    }

    checkWin();
  }

  // 統計周圍地雷數量
  function countMinesAround(cellId) {
    const neighbors = getNeighbors(cellId);
    return neighbors.filter(
      (neighbor) =>
        document
          .querySelector(`[data-id='${neighbor}']`)
          .getAttribute("data-status") === "mine"
    ).length;
  }

  // 獲取周圍格子
  function getNeighbors(cellId) {
    // string轉成int
    const id = parseInt(cellId);
    const neighbors = [];
    // 獲取當前格子的行列
    const row = Math.floor(id / width);
    const col = id % width;

    // 記錄所有可能的方向
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    // 遍歷所有可能的方向
    for (const [x, y] of directions) {
      // 計算新格子的行列座標
      const newRow = row + x;
      const newCol = col + y;
      // 確認新格子有沒有超框(邊邊的格子會出現的情況, 防止出現第-1或9 index的)
      if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width) {
        neighbors.push(newRow * width + newCol);
      }
    }

    /* 改用上面的方法以增加可讀性和維護性
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) continue;
        const newRow = row + x;
        const newCol = col + y;
        if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width) {
          neighbors.push(newRow * width + newCol);
        }
      }
    }*/

    return neighbors;
  }

  // 切換flag標記
  function toggleFlag(cell) {
    if (cell.classList.contains("revealed")) return;
    cell.classList.toggle("flag");
    cell.textContent = cell.classList.contains("flag") ? "🚩" : "";
  }

  // 揭露所有地雷
  function revealAllMines() {
    document.querySelectorAll(".cell").forEach((c) => {
      if (c.getAttribute("data-status") === "mine") {
        c.textContent = "💣";
        c.classList.add("revealed");
      }
    });
  }

  // 檢查是否勝利
  function checkWin() {
    const revealedCells = document.querySelectorAll(".cell.revealed").length;
    const totalCells = width * height;
    const safeCells = totalCells - mineCount;

    // 已揭露的格子數量跟安全格數量一致
    if (revealedCells === safeCells) {
      alert("恭喜你! 成功避開所有地雷!");
      revealAllMines();
    }
  }

  startGame();
});
