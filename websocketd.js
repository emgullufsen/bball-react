import { yankDateString, schemePlusDomain, endPointBase } from './src/yank.js';

import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io';
const io = new Server(server, {path: "/scoresws"});
import axios from 'axios'

const port = process.env.PORT || 4101

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
});

app.use('/static', (req, res) => {
  res.sendFile(__dirname + '/build/static' + req.path);
});

app.use('/images', (req, res) => {
  res.sendFile(__dirname + '/build/images' + req.path);
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

function emitScores() {
  let dat = new Date();
  dat.setHours(dat.getHours() - 8);
  let ds = yankDateString(dat);
  let the_url = `${endPointBase}&startDate=${ds}&endDate=${ds}`;
  axios.get(the_url).then(
    (r) => {
      console.log(r.data);
      io.emit('scoresupdate', r.data);
    }
  );
}

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

setInterval(emitScores, 5000);