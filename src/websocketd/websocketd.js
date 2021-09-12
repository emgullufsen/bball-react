const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const axios = require('axios');

const yankDateString = (d) => {
  let day = (d.getDate()).toString();
  let month = (d.getMonth() + 1).toString();
  let year = d.getFullYear().toString();
  let day_p = (day.length < 2) ? `0${day}` : day;
  let month_p = (month.length < 2) ? `0${month}` : month;
  return `${year}-${month_p}-${day_p}`;
};

const endPointBase = "http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1"

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

function emitScores() {
  let ds = yankDateString(new Date());
  let the_url = `${endPointBase}&startDate=${ds}&endDate=${ds}`;
  axios.get(the_url).then(
    (r) => {
      console.log(r.data);
      io.emit('scoresupdate', r.data);
    }
  );
}

server.listen(4101, () => {
  console.log('listening on *:4101');
});

setInterval(emitScores, 5000);