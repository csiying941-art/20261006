// 定義全域變數
let questions = []; // 儲存所有題目資料的陣列
let currentQuestionIndex = 0; // 目前進行到第幾題（從 0 開始）
let score = 0; // 答對的題數
let selectedAnswer = -1; // 玩家選擇的選項索引（-1 表示尚未選擇）
let isAnswered = false; // 紀錄目前這題是否已經作答
let nextButton; // 「下一題」或「看結果」的按鈕物件

function setup() {
  // 建立全螢幕畫布，並開啟動態調整
  createCanvas(windowWidth, windowHeight);
  
  // 初始化五題 p5.js 簡易指令測驗題目
  questions = [
    {
      question: "1. 在 p5.js 中，哪一個函式用來設定畫布的大小？",
      options: ["setup()", "draw()", "createCanvas()", "background()"],
      correct: 2 // 正確答案索引：createCanvas()
    },
    {
      question: "2. 想要畫一個圓形，應該使用哪一個指令？",
      options: ["rect()", "circle()", "line()", "triangle()"],
      correct: 1 // 正確答案索引：circle()
    },
    {
      question: "3. background(0); 會將畫布背景設定為什麼顏色？",
      options: ["白色", "黑色", "紅色", "透明色"],
      correct: 1 // 正確答案索引：黑色
    },
    {
      question: "4. p5.js 中哪一個內建變數可以取得目前滑鼠的 X 座標？",
      options: ["mouseX", "mouseY", "width", "height"],
      correct: 0 // 正確答案索引：mouseX
    },
    {
      question: "5. 若要讓圖形有填色但不想要有外框，應該加入什麼指令？",
      options: ["fill()", "stroke()", "noFill()", "noStroke()"],
      correct: 3 // 正確答案索引：noStroke()
    }
  ];

  // 建立下議題按鈕，預設先隱藏
  nextButton = createButton('下一題');
  nextButton.position(width / 2 - 50, height * 0.85); // 設定按鈕位置
  nextButton.size(100, 40); // 設定按鈕大小
  nextButton.style('font-size', '16px'); // 設定按鈕文字大小
  nextButton.mousePressed(goToNextQuestion); // 綁定點擊事件
  nextButton.hide(); // 初始狀態隱藏，作答後才顯示
}

function draw() {
  background(240); // 每次重繪背景，保持畫面乾淨（淺灰色）

  // 判斷是否已經完成所有題目
  if (currentQuestionIndex < questions.length) {
    displayQuiz(); // 顯示測驗畫面
  } else {
    displayResult(); // 顯示最終結果畫面
  }
}

// 顯示測驗內容的函式
function displayQuiz() {
  let q = questions[currentQuestionIndex]; // 取得當前題目資料

  // 顯示題目文字
  textAlign(CENTER, TOP);
  textSize(24);
  fill(50);
  text(q.question, width / 2, height * 0.15);

  // 設定四個選項的版面配置
  let startY = height * 0.3; // 選項起始 Y 座標
  let buttonWidth = width * 0.6; // 選項按鈕寬度
  let buttonHeight = 60; // 選項按鈕高度
  let spacing = 20; // 選項之間的間距

  // 迴圈繪製四個選項
  for (let i = 0; i < q.options.length; i++) {
    let btnX = width / 2 - buttonWidth / 2; // 選項 X 座標
    let btnY = startY + i * (buttonHeight + spacing); // 計算每個選項的 Y 座標

    // 決定選項的背景顏色
    if (isAnswered) {
      // 已經作答後的顏色邏輯
      if (i === q.correct) {
        // 如果玩家答錯，將正確選項加上 #606c38 背景色
        if (selectedAnswer !== q.correct) {
          fill('#606c38'); 
        } else {
          fill(100, 200, 100); // 答對時正確選項顯示綠色
        }
      } else if (i === selectedAnswer && selectedAnswer !== q.correct) {
        fill(250, 100, 100); // 玩家選錯的選項顯示紅色
      } else {
        fill(255); // 其他未選中的錯誤選項保持白色
      }
    } else {
      // 尚未作答時，偵測滑鼠懸停（Hover）效果
      if (mouseX > btnX && mouseX < btnX + buttonWidth && mouseY > btnY && mouseY < btnY + buttonHeight) {
        fill(220); // 滑鼠移上去變灰色
      } else {
        fill(255); // 預設白色
      }
    }

    // 繪製選項的外框與矩形
    stroke(200);
    strokeWeight(2);
    rect(btnX, btnY, buttonWidth, buttonHeight, 10); // 圓角矩形

    // 繪製選項的文字
    noStroke();
    // 如果背景是 #606c38，文字改成白色以利閱讀
    if (isAnswered && i === q.correct && selectedAnswer !== q.correct) {
      fill(255);
    } else {
      fill(0);
    }
    textSize(18);
    textAlign(CENTER, CENTER);
    text(q.options[i], width / 2, btnY + buttonHeight / 2);
  }
}

// 處理滑鼠點擊選擇答案的事件
function mousePressed() {
  // 如果已經作答，或是已經到結果畫面，點擊選項無效
  if (isAnswered || currentQuestionIndex >= questions.length) return;

  let q = questions[currentQuestionIndex];
  let startY = height * 0.3;
  let buttonWidth = width * 0.6;
  let buttonHeight = 60;
  let spacing = 20;

  // 檢查滑鼠是否點擊在某個選項內
  for (let i = 0; i < q.options.length; i++) {
    let btnX = width / 2 - buttonWidth / 2;
    let btnY = startY + i * (buttonHeight + spacing);

    if (mouseX > btnX && mouseX < btnX + buttonWidth && mouseY > btnY && mouseY < btnY + buttonHeight) {
      selectedAnswer = i; // 紀錄玩家點擊的選項
      isAnswered = true; // 設定為已作答狀態

      // 判斷是否答對
      if (i === q.correct) {
        score++; // 答對則分數加一
      }

      // 根據是否為最後一題，動態更改按鈕文字並顯示按鈕
      if (currentQuestionIndex === questions.length - 1) {
        nextButton.html('看結果');
      } else {
        nextButton.html('下一題');
      }
      nextButton.show(); // 顯示按鈕
      break; // 跳出迴圈
    }
  }
}

// 切換到下一題的函式
function goToNextQuestion() {
  currentQuestionIndex++; // 題號加一
  selectedAnswer = -1; // 重設選擇答案
  isAnswered = false; // 重設作答狀態
  nextButton.hide(); // 隱藏按鈕，直到下一題作答
}

// 顯示最終分數結果的函式
function displayResult() {
  textAlign(CENTER, CENTER);
  
  // 顯示恭喜文字
  textSize(32);
  fill(50);
  text("測驗結束！", width / 2, height * 0.4);
  
  // 顯示答對題數
  textSize(24);
  fill(0, 102, 204);
  text("你的總得分為: " + score + " / " + questions.length + " 題", width / 2, height * 0.5);
}

// 當瀏覽器視窗大小改變時，自動調整畫布與按鈕位置
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  nextButton.position(width / 2 - 50, height * 0.85);
}
