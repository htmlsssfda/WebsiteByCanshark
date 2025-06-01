const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const USERS_FILE = path.join(__dirname, 'users.json');

// 解析表單資料
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 提供靜態檔案
app.use(express.static(path.join(__dirname, 'public')));

// 根路由導向登入頁
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 註冊邏輯
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    const raw = fs.readFileSync(USERS_FILE);
    users = JSON.parse(raw);
  }

  if (users.find(user => user.username === username)) {
    return res.send(`<script>alert("使用者已存在"); window.location.href="/register.html";</script>`);
  }

  users.push({ username, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  return res.send(`<script>alert("註冊成功，請登入"); window.location.href="/login.html";</script>`);
});

// 登入邏輯
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!fs.existsSync(USERS_FILE)) {
    return res.send(`<script>alert("帳號不存在"); window.location.href="/login.html";</script>`);
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.send(`<script>alert("帳號或密碼錯誤"); window.location.href="/login.html";</script>`);
  }

  // 登入成功，導向聊天室
  return res.redirect(`/chat.html?user=${encodeURIComponent(username)}`);
});

// 儲存聊天訊息
function saveLog(msg) {
  const timestamp = new Date().toISOString();

  const logLine = `[${timestamp}] ${msg}\n`;
  fs.appendFile(path.join(__dirname, 'logs.txt'), logLine, (err) => {
    if (err) console.error('寫入 logs.txt 失敗:', err);
  });

  const jsonPath = path.join(__dirname, 'logs.json');
  let logs = [];

  if (fs.existsSync(jsonPath)) {
    try {
      const raw = fs.readFileSync(jsonPath);
      logs = JSON.parse(raw);
    } catch (err) {
      console.error('解析 logs.json 失敗:', err);
    }
  }

  logs.push({ message: msg, time: timestamp });
  fs.writeFileSync(jsonPath, JSON.stringify(logs, null, 2));
}

// Socket.io 聊天邏輯
io.on('connection', (socket) => {
  console.log('使用者已連線');

  socket.on('chat message', (msg) => {
  if (msg.endsWith('/clear')) {
    // 清除 logs
    fs.writeFileSync(path.join(__dirname, 'logs.json'), '[]');
    fs.writeFileSync(path.join(__dirname, 'logs.txt'), '');
    io.emit('chat message', '--- 所有訊息已被清除 ---');
  } else {
    saveLog(msg);
    io.emit('chat message', msg);
  }
});


  socket.on('disconnect', () => {
    console.log('使用者離線');
  });
});

function syncTxtFromJson() {
  const jsonPath = path.join(__dirname, 'logs.json');
  const txtPath = path.join(__dirname, 'logs.txt');

  if (!fs.existsSync(jsonPath)) return;

  try {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const logs = JSON.parse(raw);

    const lines = logs.map(entry => `[${entry.time}] ${entry.message}`).join('\n');
    fs.writeFileSync(txtPath, lines, 'utf-8');
    console.log('已從 logs.json 同步生成 logs.txt');
  } catch (err) {
    console.error('同步 txt 時失敗：', err);
  }
}

app.get('/history', (req, res) => {
  const jsonPath = path.join(__dirname, 'logs.json');
  if (!fs.existsSync(jsonPath)) return res.json([]);

  try {
    const logs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    res.json(logs);
  } catch (err) {
    console.error('讀取聊天歷史失敗：', err);
    res.json([]);
  }
});


// 程式一開始就同步
syncTxtFromJson();


// 啟動伺服器
server.listen(3000, () => {
  console.log('伺服器運行中：http://localhost:3000');
});
