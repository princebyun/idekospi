import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import stockRoutes from './routes/stocks';
import gitRoutes from './routes/git';
import newsRoutes from './routes/news';
import { chatRouter, setupChatWebSocket } from './routes/chat';

const app = express();
app.use(cors());

// 라우트 등록
app.use(stockRoutes);
app.use(gitRoutes);
app.use(newsRoutes);
app.use(chatRouter);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

setupChatWebSocket(wss);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Stock proxy server running on http://localhost:${PORT}`);
  // 강제로 프로세스가 죽지 않도록 방지
  setInterval(() => {}, 1000 * 60 * 60);
});
