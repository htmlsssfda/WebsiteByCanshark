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

  // 顯示第二段區塊
  const second = document.getElementById("second-section");
  second.classList.remove("hidden");

  // 啟動打字效果 + 自動滑動
  typeWriter("你有在玩 Minecraft 嗎？", "question2", 60, () => {
    document.getElementById("second-buttons").classList.remove("hidden");
  });

  // 立刻自動滑動
  setTimeout(() => {
    second.scrollIntoView({ behavior: 'smooth' });
  }, 100); // 小延遲讓內容有時間顯示
}


function answerYes() {
  const response = document.getElementById("response");
  response.textContent = "那歡迎加入我們的伺服器！";
  response.style.display = "block";

  const linkContainer = document.getElementById("link-container");
  linkContainer.classList.remove("hidden");
  linkContainer.scrollIntoView({ behavior: "smooth" });
}

function answerNo() {
  const response = document.getElementById("response");
  response.textContent = "沒關係，我們歡迎新手加入喲！";
  response.style.display = "block";

  const linkContainer = document.getElementById("link-container");
  linkContainer.classList.remove("hidden");
  linkContainer.scrollIntoView({ behavior: "smooth" });
}
