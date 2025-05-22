document.addEventListener('DOMContentLoaded', () => {
  const apiKey = 'AIzaSyDvFDjXLUuy7m4GsZABDehLB_4hVcyKw4s';
  const channelId = 'UCTV2JFS__3qhIgCCgC8myoQ';
  const countElement = document.getElementById('subscriber-count');

  async function fetchSubscribers() {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
      );
      const data = await response.json();
      const count = data.items[0].statistics.subscriberCount;
      countElement.textContent = `🎥 訂閱人數：${Number(count).toLocaleString()} 人`;
    } catch (error) {
      countElement.textContent = '⚠️ 訂閱數讀取失敗';
      console.error('讀取訂閱數時發生錯誤：', error);
    }
  }

  fetchSubscribers();
  setInterval(fetchSubscribers, 10000);
});
