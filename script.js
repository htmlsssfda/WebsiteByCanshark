function typeWriter(text, elementId, speed = 70, callback) {
  let i = 0;
  const element = document.getElementById(elementId);
  element.innerHTML = '';
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback(); // 打字完成後觸發
    }
  }
  type();
}

window.onload = () => {
  typeWriter("歡迎來到休憩島", "welcomeText", 100, () => {
    typeWriter("你在看我嗎？", "question1", 70, () => {
      document.getElementById("first-buttons").classList.remove("hidden");
    });
  });
};

function goToSecond() {
  // 隱藏第一段按鈕
  document.getElementById("first-buttons").classList.add("hidden");

  // 顯示第二段
  const second = document.getElementById("second-section");
  second.classList.remove("hidden");

  // 啟動第二段打字 + 滑動
  typeWriter("你有在玩 Minecraft 嗎？", "question2", 60, () => {
    document.getElementById("second-buttons").classList.remove("hidden");
    
    // 自動滑動到第二段
    setTimeout(() => {
      second.scrollIntoView({ behavior: 'smooth' });
    }, 100); // 稍微延遲一點點，讓 UI 有時間更新
  });
}

function answerYes() {
  document.getElementById("second-buttons").classList.add("hidden");
  const response = document.getElementById("response");
  response.classList.remove("hidden");
  response.innerText = "那歡迎加入我們的伺服器！";

  setTimeout(() => {
    response.scrollIntoView({ behavior: 'smooth' });
  }, 200);
}

function answerNo() {
  document.getElementById("second-buttons").classList.add("hidden");
  const response = document.getElementById("response");
  response.classList.remove("hidden");
  response.innerText = "沒關係，我們歡迎新手加入喲！";

  setTimeout(() => {
    response.scrollIntoView({ behavior: 'smooth' });
  }, 200);
}
