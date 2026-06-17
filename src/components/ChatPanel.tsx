import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, User, TerminalSquare } from 'lucide-react';
import { useStore } from '../store/useStore';
import { API_BASE_URL } from '../config/api';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
  author: string;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [author, setAuthor] = useState(() => localStorage.getItem('chat_author') || `월급루팡개발자_${Math.floor(Math.random() * 10000)}`);
  const bottomRef = useRef<HTMLDivElement>(null);
  const setIsRightPanelOpen = useStore(state => state.setIsRightPanelOpen);
  const setOnlineUsers = useStore(state => state.setOnlineUsers);
  const setWsStatus = useStore(state => state.setWsStatus);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    localStorage.setItem('chat_author', author);
  }, [author]);

  useEffect(() => {
    // 1. HTTP로 초기 메시지 히스토리 가져오기
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/chat`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (e) {
        console.error('Failed to fetch chat history', e);
      }
    };
    fetchHistory();

    // 2. WebSocket 연결
    const connectWs = () => {
      setWsStatus('connecting');
      const wsUrl = API_BASE_URL.replace(/^http/, 'ws');
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        setWsStatus('connected');
        retryCountRef.current = 0;
      };
      
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NEW_MESSAGE') {
            setMessages(prev => {
              const next = [...prev, data.message];
              if (next.length > 100) next.shift();
              return next;
            });
          } else if (data.type === 'ONLINE_USERS') {
            setOnlineUsers(data.count);
          } else if (data.type === 'STOCK_UPDATE') {
            data.data.forEach((stock: any) => {
              useStore.getState().updatePrice(
                stock.symbol, 
                stock.price, 
                stock.changeRate, 
                stock.marketState, 
                stock.changeRate15m, 
                stock.changeRate30m
              );
            });
          }
        } catch (e) {
          console.error('Failed to parse WS message', e);
        }
      };

      ws.current.onclose = () => {
        setWsStatus('disconnected');
        const timeout = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);
        retryCountRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(connectWs, timeout);
      };

      ws.current.onerror = () => {
        ws.current?.close();
      };
    };

    connectWs();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (ws.current) {
        ws.current.onclose = null; // disable auto-reconnect on unmount
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    ws.current.send(JSON.stringify({
      type: 'SEND_MESSAGE',
      payload: { text: input, author }
    }));
    
    setInput('');
  };

  // 종목 멘션 하이라이팅 유틸 함수
  const renderMessageContent = (text: string) => {
    // @종목명 매칭 정규식
    const regex = /@([가-힣a-zA-Z0-9]+)/g;
    const parts = text.split(regex);
    
    if (parts.length === 1) return text;
    
    return parts.map((part, i) => {
      // split(regex) 결과는 [일반텍스트, 매칭된그룹, 일반텍스트, 매칭된그룹...] 형태
      if (i % 2 === 1) {
        return (
          <span key={i} className="bg-[#2d2d2d] text-[#4fc1ff] px-1 rounded cursor-pointer hover:underline transition-colors font-semibold" title={`${part} 관련 정보 보기`}>
            @{part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="w-full h-full bg-ide-bg flex flex-col text-ide-text font-sans">
      <div className="flex items-center justify-between px-4 py-2 border-b border-ide-border flex-shrink-0 select-none">
        <div className="flex items-center text-[12px] font-semibold text-ide-text">
          DISCUSSION CHAT
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsRightPanelOpen(false)}
            className="p-1 hover:bg-ide-tab-inactive rounded-md transition-colors text-ide-text-muted hover:text-ide-text"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.707L8 8.707z"></path></svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-ide-text-muted select-none space-y-4">
            <Sparkles size={32} className="text-ide-primary opacity-50" />
            <div className="text-[13px]">
              Hi! I'm ready to discuss the market with you.<br/>
              What do you want to talk about?
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.author === author;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {/* AI 응답 위장 (타인의 메시지) */}
                {!isMe && (
                  <div className="flex items-center space-x-2 mb-1">
                    <Sparkles size={14} className="text-ide-primary" />
                    <span className="text-[12px] font-semibold text-ide-text">
                      {msg.author}
                    </span>
                    <span className="text-[10px] text-ide-text-muted">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                
                {/* 나의 메시지 위장 (사용자 프롬프트) */}
                {isMe && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] text-ide-text-muted">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[12px] font-semibold text-ide-text-muted">You</span>
                  </div>
                )}

                <div className={`mt-1 text-[13px] px-3 py-2 rounded-md ${isMe ? 'bg-[#3b3b3b] text-ide-text border border-[#4d4d4d]' : 'bg-[#1e1e1e] border border-ide-border'}`}>
                  <span className={`leading-relaxed break-words ${msg.author === 'System' ? 'text-code-comment italic' : 'text-ide-text'}`}>
                    {renderMessageContent(msg.text)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-ide-bg">
        <form onSubmit={sendMessage} className="relative group">
          <div className="flex items-center bg-ide-bg border border-ide-border rounded-md focus-within:border-ide-primary focus-within:ring-1 focus-within:ring-ide-primary transition-all px-2 py-1.5 shadow-sm">
            <button type="button" className="p-1 text-ide-text-muted hover:text-ide-text transition-colors rounded-sm hover:bg-ide-tab-inactive ml-0.5 mr-2 flex-shrink-0">
              <span className="text-[16px] leading-none block font-mono">+</span>
            </button>
            <textarea
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Ask anything, @ to mention, / for workflows"
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-[13px] text-ide-text resize-none custom-scrollbar py-1"
              rows={1}
              spellCheck={false}
              style={{ minHeight: '22px', maxHeight: '150px' }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className={`p-1.5 ml-2 mr-0.5 rounded-sm transition-colors flex-shrink-0 ${
                input.trim() 
                  ? 'bg-transparent text-ide-text hover:bg-ide-tab-inactive' 
                  : 'bg-transparent text-ide-text-muted'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M8 1.5l7 7-7 7-1.06-1.06L12.88 8.5H1v-1h11.88L6.94 2.56 8 1.5z"></path></svg>
            </button>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-[10px] text-ide-text-muted select-none">
            <div className="flex items-center space-x-2">
              <User size={12} className="text-ide-text-muted" />
              <input 
                type="text" 
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your nickname"
                title="채팅방에서 사용할 닉네임"
                className="bg-transparent border-b border-transparent hover:border-ide-border focus:border-ide-primary focus:outline-none text-[10px] text-ide-text-muted focus:text-ide-text w-32 pb-0.5 transition-colors placeholder-[#555555]"
              />
            </div>
            <div className="flex items-center space-x-1">
              <TerminalSquare size={12} />
              <span>Use <kbd className="bg-ide-tab-inactive px-1 rounded border border-ide-border">Ctrl+L</kbd> to toggle</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
