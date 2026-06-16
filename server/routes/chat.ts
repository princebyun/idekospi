import { Router } from 'express';
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

export const chatRouter = Router();

// 채팅 메시지 메모리 저장소 (최대 100개 유지)
export interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
  author: string;
}
export let chatMessages: ChatMessage[] = [];

let clients: WebSocket[] = [];

const BANNED_WORDS = ['바보', '멍청이', '씨발', '개새끼', '병신', '지랄', '존나'];

function filterProfanity(text: string): string {
  let filtered = text;
  BANNED_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  });
  return filtered;
}

chatRouter.get('/api/chat', (req, res) => {
  res.json(chatMessages);
});

chatRouter.post('/api/chat', express.json(), (req, res) => {
  const { text, author } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  
  const newMessage: ChatMessage = {
    id: Math.random().toString(36).substr(2, 9),
    text: filterProfanity(text.substring(0, 500)),
    timestamp: Date.now(),
    author: author || 'Anonymous',
  };
  
  chatMessages.push(newMessage);
  if (chatMessages.length > 100) chatMessages.shift();
  
  // 브로드캐스트
  clients.forEach(c => {
    if (c.readyState === WebSocket.OPEN) {
      c.send(JSON.stringify({ type: 'NEW_MESSAGE', message: newMessage }));
    }
  });
  
  res.json(newMessage);
});

export function setupChatWebSocket(wss: WebSocketServer) {
  const broadcastOnlineUsers = () => {
    const count = clients.length;
    clients.forEach(c => {
      if (c.readyState === WebSocket.OPEN) {
        c.send(JSON.stringify({ type: 'ONLINE_USERS', count }));
      }
    });
  };

  wss.on('connection', (ws) => {
    clients.push(ws);
    broadcastOnlineUsers();
    
    ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.type === 'SEND_MESSAGE') {
          const { text, author } = parsed.payload;
          if (!text) return;
          
          const newMessage: ChatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            text: filterProfanity(text.substring(0, 500)),
            timestamp: Date.now(),
            author: author || 'Anonymous',
          };
          
          chatMessages.push(newMessage);
          if (chatMessages.length > 100) chatMessages.shift();
          
          clients.forEach(c => {
            if (c.readyState === WebSocket.OPEN) {
              c.send(JSON.stringify({ type: 'NEW_MESSAGE', message: newMessage }));
            }
          });
        }
      } catch (e) {
        console.error('Failed to parse WS message', e);
      }
    });
    
    ws.on('close', () => {
      clients = clients.filter(c => c !== ws);
      broadcastOnlineUsers();
    });
  });
}

export const broadcastMessage = (message: any) => {
  clients.forEach(c => {
    if (c.readyState === WebSocket.OPEN) {
      c.send(JSON.stringify(message));
    }
  });
};

