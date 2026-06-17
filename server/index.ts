import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import stockRoutes from './routes/stocks';
import gitRoutes from './routes/git';
import newsRoutes from './routes/news';
import { chatRouter, setupChatWebSocket } from './routes/chat';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { startCentralPolling } from './services/centralPoller';
import { config } from './config/env';
import { logger } from './utils/logger';

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', err);
});
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', reason);
});

const app = express();
app.use(cors());
app.use(requestLogger);
app.use(rateLimiter);

// 라우트 등록
app.use(stockRoutes);
app.use(gitRoutes);
app.use(newsRoutes);
app.use(chatRouter);

// 에러 핸들러 (라우트 뒤에 배치)
app.use(errorHandler);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

setupChatWebSocket(wss);

// 폴링 시작
startCentralPolling();

const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`Stock proxy server running on http://localhost:${PORT}`);
  // 강제로 프로세스가 죽지 않도록 방지
  setInterval(() => {}, 1000 * 60 * 60);
});
