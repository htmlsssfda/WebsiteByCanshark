const socket = io();

const chatBox = document.getElementById('chat-box');
const input = document.getElementById('message');
const send = document.getElementById('send');

send.onclick = () => {
  const msg = input.value.trim();
  if (msg !== '') {
    socket.emit('chat message', msg);
    input.value = '';
  }
};

socket.on('chat message', (msg) => {
  const div = document.createElement('div');
  div.textContent = msg;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});

