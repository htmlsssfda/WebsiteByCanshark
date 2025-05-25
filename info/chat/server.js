const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

let messages = [];
let idCounter = 1;

app.use(express.static('.')); // 提供 chat.html 和 admin.html
app.use(express.json());

// 取得所有訊息
app.get('/messages', (req, res) => {
  res.json(messages);
});

// 新增訊息
app.post('/messages', (req, res) => {
  const msg = { id: idCounter++, text: req.body.text };
  messages.push(msg);
  res.status(201).json(msg);
});

// 修改訊息
app.put('/messages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const msg = messages.find(m => m.id === id);
  if (msg) {
    msg.text = req.body.text;
    res.json(msg);
  } else {
    res.status(404).json({ error: 'Message not found' });
  }
});

// 刪除訊息
app.delete('/messages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  messages = messages.filter(m => m.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`聊天室伺服器啟動於 http://localhost:${PORT}`);
});
