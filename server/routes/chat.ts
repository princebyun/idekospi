import { Router } from 'express';
import express from 'express';

const router = Router();

// 채팅 메시지 메모리 저장소 (최대 100개 유지)
interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
  author: string;
}
let chatMessages: ChatMessage[] = [];

router.get('/api/chat', (req, res) => {
  res.json(chatMessages);
});

router.post('/api/chat', express.json(), (req, res) => {
  const { text, author } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  
  const newMessage: ChatMessage = {
    id: Math.random().toString(36).substr(2, 9),
    text: text.substring(0, 500), // 길이 제한
    timestamp: Date.now(),
    author: author || 'Anonymous',
  };
  
  chatMessages.push(newMessage);
  if (chatMessages.length > 100) {
    chatMessages.shift(); // 오래된 메시지 삭제
  }
  
  res.json(newMessage);
});

export default router;
