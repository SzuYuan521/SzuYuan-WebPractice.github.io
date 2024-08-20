document.addEventListener("DOMContentLoaded", () => {
  const width = 3;
  const height = 3;

  const gameContainer = document.getElementById("gameContainer");
  const orderSelection = document.getElementById("order-selection");
  const reportDiv = document.getElementById("report");
  const againButton = document.getElementById("again-button");

  againButton.addEventListener("click", () => {
    location.reload(); // 重整網頁
  });

  // 準備音效
  const clickSound = new Audio("sounds/click-sound.mp3");
  const openSound = new Audio("sounds/open-sound.mp3");

  // 按鈕點擊添加播放音效
  orderSelection.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      clickSound.play();
    });
  });

  // 訂單數量選擇的監聽
  orderSelection.addEventListener("click", orderSelect);

  // 盲盒圖片名稱
  const turtleBlindBox = "turtle-blind-box";

  // (訂單數量)拆幾包盲盒
  let orderNumber = 0;

  // 選擇訂單(數量)
  function orderSelect(event) {
    if (event.target.tagName !== "BUTTON") return;
    orderNumber = event.target.getAttribute("data-number");
    startGame();
  }

  let isReporting = false;

  // 幸運色烏龜
  let luckyTurtle = "";

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

  // 儲存已得烏龜數量
  const turtleCount = {};
  turtleColors.forEach((color) => {
    turtleCount[color] = 0;
  });

  // 儲存格子的array
  const cells = [];

  function startGame() {
    orderSelection.style.display = "none";

    gameContainer.innerHTML = "";
    gameContainer.style.display = "grid";

    const text = document.getElementById("tip-text");
    text.querySelector("p").textContent = "請選擇幸運色";

    // 創建遊戲面版
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < width * height; i++) {
      const cell = createCell(i, turtleColors[i], "none");
      cells.push(cell);
      fragment.appendChild(cell);
    }

    gameContainer.appendChild(fragment);

    gameContainer.addEventListener("click", chooseLuckyTurtle);
  }

  // 創建格子, id: index, color: 烏龜顏色, status:blindBox/turtle/none => 盲盒/烏龜/沒東西
  function createCell(id, color, status) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-id", id);
    cell.setAttribute("data-color", color);
    cell.setAttribute("data-status", status);

    // 烏龜圖片初始化, 可以選擇幸運色烏龜
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

  // 選擇幸運色烏龜後的處理(遊戲正式開始))
  function chooseLuckyTurtle(event) {
    const cell = event.target.closest(".cell");

    if (!cell) return;

    // 幸運色設定
    const color = cell.getAttribute("data-color");
    luckyTurtle = color;

    // 幸運色烏龜圖片路徑設定
    const luckyTurtleImg = document.getElementById("lucky-turtle-img");
    luckyTurtleImg.src = `img/${luckyTurtle}.png`;

    const text = document.getElementById("tip-text");
    text.querySelector("p").textContent = "請打開所有包裝";
    //  text.style.visibility = "hidden";

    // 顯示規則跟幸運色
    const description = document.getElementById("rule-text");
    description.style.visibility = "visible";

    gameContainer.removeEventListener("click", chooseLuckyTurtle);

    // 設定剩餘盲盒數字
    const countText = document.getElementById("count-text").querySelector("p");
    countText.textContent = `還有${orderNumber}包`;

    for (let i = 0; i < width * height; i++) {
      cleanCell(i);
    }

    // 依序發盲盒
    delayFunction(0, dealingBlindBox);
  }

  // 發盲盒
  function dealingBlindBox(cellId) {
    // console.log("orderNumber = " + orderNumber);
    if (orderNumber === 0) return;
    const cell = cells[cellId];

    // 不是空格子不發
    if (cell.getAttribute("data-status") !== "none") return;

    cell.setAttribute("data-status", "blindBox");
    cell.setAttribute("data-color", turtleBlindBox);

    const imgElement = cell.querySelector(".turtle-image");
    imgElement.style.visibility = "visible";
    imgElement.src = `img/${turtleBlindBox}.png`;
    imgElement.alt = turtleBlindBox;

    cell.addEventListener("click", revealBlindBox);
    cell.addEventListener("click", revealBlindBox);
    imgElement.addEventListener("click", zoomImage);

    orderNumber--;

    // 設定剩餘盲盒數字
    const countText = document.getElementById("count-text").querySelector("p");
    countText.textContent = `還有${orderNumber}包`;

    openSound.play();
  }

  // 拆盲盒
  async function revealBlindBox(event) {
    // 正在播報時不給拆
    if (isReporting) {
      return;
    }

    const cell = event.target.closest(".cell");
    if (!cell) return;

    if (cell.getAttribute("data-status") !== "blindBox") return;

    openSound.play();

    cell.setAttribute("data-status", "turtle");

    const color = getRandomTurtle();
    cell.setAttribute("data-color", color);
    // 統計顏色數量
    turtleCount[color]++;

    const imgElement = cell.querySelector(".turtle-image");
    imgElement.src = `img/${color}.png`;
    imgElement.alt = `${color} turtle`;

    cell.removeEventListener("click", revealBlindBox);

    // 幸運色烏龜處理
    if (color == luckyTurtle) {
      orderNumber += reportObj["LUCKY"].bonus;
      report("LUCKY");
    }

    // 檢查是不是9格全拆完, 如果不是則return
    for (let i = 0; i < width * height; i++) {
      if (
        cells[i].getAttribute("data-status") !== "turtle" &&
        cells[i].getAttribute("data-status") !== "none"
      ) {
        return;
      }
    }

    await judgmentScore();

    // 如果9格全拆完, 沒有剩餘盲盒就遊戲結束
    if (orderNumber == 0) {
      gameEnd();
      return;
    }

    // 依序發盲盒
    delayFunction(0, dealingBlindBox);
  }

  // 隨機色烏龜
  function getRandomTurtle() {
    const index = Math.floor(Math.random() * turtleColors.length);
    return turtleColors[index];
  }

  // 清除格子圖片和狀態
  function cleanCell(cellId) {
    const cell = cells[cellId];
    cell.setAttribute("data-status", "none");
    cell.setAttribute("data-color", "none");
    const imgElement = cell.querySelector(".turtle-image");
    imgElement.style.visibility = "hidden";
  }

  // 判斷有沒有特殊牌型, 有的話給盲盒
  /*  幸運色+1包(開盲盒時先加)
      全家福(9個不一樣)+20包
      連線(三個連線)+5包
      對碰(兩個同色)+1包
      清空(9個全消)+10包 */
  async function judgmentScore() {
    await delay(1000); // 等待1秒

    // 先判斷全家福, 如果有全家福會全清空, 則不用判斷接下來的
    const allDifferent = await judgmentAllDifferent();
    if (allDifferent) {
      return;
    }

    // 判斷連線, 預設有連線, 直到判斷沒有連線了才判斷對碰
    let hasLine = true;
    while (hasLine) {
      hasLine = await judgmentLine();
      // 隔1秒後再判斷下一個條件
    }

    // 判斷對子, 預設有對子, 直到判斷沒有對子了才判斷清空
    let hasPair = true;
    while (hasPair) {
      hasPair = await judgmentPair();
    }

    // 判斷有沒有被清空
    await judgmentEmpty();
  }

  // 判斷全家福
  async function judgmentAllDifferent() {
    let allDifferent = true;

    // 因為cell只有9格, 所以用forEach增加程式碼可讀性
    cells.forEach((cell, index) => {
      const color = cell.getAttribute("data-color");
      // 檢查cell中的顏色是否都不一樣
      cells.forEach((otherCell, otherIndex) => {
        if (
          otherIndex !== index &&
          otherCell.getAttribute("data-color") === color
        ) {
          allDifferent = false;
        }
      });
    });

    if (allDifferent) {
      orderNumber += reportObj["ALL_DIFFERENT"].bonus;
      report("ALL_DIFFERENT");
      for (let i = 0; i < cells.length; i++) {
        // 清空該cell
        cleanCell(i);
      }
      await delay(2000); // 等待2秒
      await judgmentEmpty();
    }

    return allDifferent;
  }

  // 判斷是否有三個連成一條線
  async function judgmentLine() {
    let hasLine = false;

    // 獲取每個格子的顏色
    const colors = cells.map((cell) => {
      return cell.getAttribute("data-status") === "turtle"
        ? cell.getAttribute("data-color")
        : "none";
    });

    // 定義所有可能的連線, 傳入checkThreeInARow()判斷
    const lines = [
      [0, 1, 2], // 第一行
      [3, 4, 5], // 第二行
      [6, 7, 8], // 第三行
      [0, 3, 6], // 第一列
      [1, 4, 7], // 第二列
      [2, 5, 8], // 第三列
      [0, 4, 8], // 對角線 (左上到右下)
      [2, 4, 6], // 對角線 (右上到左下)
    ];

    // 使用解構賦值, 檢查是否有三個相同顏色的連線, 並記錄第一個index
    const checkThreeInARow = (index) => {
      const [a, b, c] = index;
      // 如果color abc都存在, 而且顏色一樣
      if (
        colors[a] &&
        colors[b] &&
        colors[c] &&
        colors[a] === colors[b] &&
        colors[b] === colors[c] &&
        colors[a] !== "none"
      ) {
        return index; // 返回這三個index
      }
      return null; // 沒有找到三連線時返回null
    };

    for (let i = 0; i < lines.length; i++) {
      const result = checkThreeInARow(lines[i]);
      if (result !== null) {
        orderNumber += reportObj["LINE"].bonus;
        report("LINE");

        // 清除連線的格子
        cleanCell(lines[i][0]);
        cleanCell(lines[i][1]);
        cleanCell(lines[i][2]);

        hasLine = true;
      }
    }

    if (hasLine) {
      // 隔2秒後再判斷下一個條件
      await delay(2000);
    }

    // 沒檢查到連線了, 回傳false
    return hasLine;
  }

  // 判斷是否對碰
  async function judgmentPair() {
    let hasPair = false;

    for (let index = 0; index < cells.length; index++) {
      const cell = cells[index];
      const color = cell.getAttribute("data-color");

      // 如果是該格子不是烏龜就跳過
      if (cell.getAttribute("data-status") !== "turtle") continue;

      for (let otherIndex = 0; otherIndex < cells.length; otherIndex++) {
        if (index === otherIndex) continue; // 跳過自己

        const otherCell = cells[otherIndex];
        if (otherCell.getAttribute("data-color") === color) {
          orderNumber += 1;
          report("PAIR");
          cleanCell(index);
          cleanCell(otherIndex);

          hasPair = true;
          break; // 找到一對對碰後就跳出迴圈
        }
      }

      if (hasPair) break; // 找到一對對碰後就跳出迴圈
    }

    if (hasPair) {
      // 隔2秒後再判斷下一個條件
      await delay(2000);
    }

    // 判斷沒有一樣顏色了, 回傳false判斷下一個條件
    return hasPair;
  }

  // 判斷是否清空了
  async function judgmentEmpty() {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].getAttribute("data-color") !== turtleBlindBox) {
        return;
      }
    }

    // 全部cell都沒有有顏色的烏龜, 清空了, +5包
    orderNumber += 5;
    report("ALL_CLEAN");

    await delay(2000);
  }

  // bonus:牌型的bonus盲盒數, report_text:文字播報, audio:音效播放
  const reportObj = {
    ALL_DIFFERENT: {
      bonus: 20,
      report_text: `全家福+${this.bonus}包`,
      audio: new Audio("sounds/all-different.mp3"),
    },
    LINE: {
      bonus: 5,
      audio: new Audio("sounds/line.mp3"),
      get report_text() {
        return `連線+${this.bonus}包`;
      },
    },
    PAIR: {
      bonus: 1,
      audio: new Audio("sounds/pair.mp3"),
      get report_text() {
        return `對碰+${this.bonus}包`;
      },
    },
    ALL_CLEAN: {
      bonus: 10,
      audio: new Audio("sounds/all-clean.mp3"),
      get report_text() {
        return `全清+${this.bonus}包`;
      },
    },
    LUCKY: {
      bonus: 1,
      audio: new Audio("sounds/lucky.mp3"),
      get report_text() {
        return `幸運色+${this.bonus}包`;
      },
    },
  };

  // 播報
  function report(reportType) {
    // 更新剩餘盲盒數字
    const countText = document.getElementById("count-text").querySelector("p");
    countText.textContent = `還有${orderNumber}包`;

    const reportData = reportObj[reportType];
    if (reportData) {
      console.log(reportData.report_text);
      reportDiv.textContent = reportData.report_text;
      if (reportData.audio)
        reportData.audio.play().catch((error) => {
          console.error("播放音效失敗: ", error);
        });
      zoomReport();
    } else {
      console.log(reportData);
    }
  }

  function gameEnd() {
    let sum = 0;

    // 統計烏龜數量
    Object.entries(turtleCount).forEach(([color, count]) => {
      console.log(color + " : " + count);

      const resultText = document.getElementById(`${color}-result`);
      resultText.textContent = `${count}隻`;

      sum += count;
    });

    const resultSumText = document.getElementById("result-sum");
    resultSumText.textContent = sum + "隻";

    const resultWindow = document.getElementById("result-window");
    resultWindow.style.display = "flex";
  }

  // 動畫事件處理函數
  function zoomImage(event) {
    const img = event.target;
    img.classList.add("zoom-in-out");

    // 0.1秒後移除zoom class
    setTimeout(() => {
      img.classList.remove("zoom-in-out");
    }, 100); // 0.1秒
  }

  // 處理遊戲播報(顯示動畫)
  function zoomReport() {
    isReporting = true;
    reportDiv.classList.add("zoom-in");

    // 0.1秒後移除zoom class
    setTimeout(() => {
      reportDiv.classList.remove("zoom-in");
      isReporting = false;
    }, 1500);
  }

  // 延時遍歷格子, 用來發盲盒用, 一個個發
  function delayFunction(i, func) {
    setTimeout(() => {
      func(i);
      if (i < width * height - 1) {
        // 遍歷格子
        delayFunction(i + 1, func);
      }
    }, 100); // 延遲100ms
  }

  // 延時函數，返回一個在指定毫秒(ms)後解析的Promise物件
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
});
