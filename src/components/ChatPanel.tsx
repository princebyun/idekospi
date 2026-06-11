import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, User, TerminalSquare } from 'lucide-react';
import { useStore } from '../store/useStore';

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
  const { setIsRightPanelOpen } = useStore();

  useEffect(() => {
    localStorage.setItem('chat_author', author);
  }, [author]);

  const fetchMessages = async () => {
    try {
      const backendUrl = `http://${window.location.hostname}:3001`;
      const res = await fetch(`${backendUrl}/api/chat`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error('Failed to fetch chat', e);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // 2초마다 갱신
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const backendUrl = `http://${window.location.hostname}:3001`;
      await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, author }),
      });
      setInput('');
      fetchMessages(); // 즉시 갱신
    } catch (e) {
      console.error('Failed to send message', e);
    }
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

                {/* 메시지 본문 */}
                <div 
                  className={`text-[13px] leading-relaxed break-words px-3 py-2 ${
                    isMe 
                      ? 'bg-[#2b2d31] text-ide-text rounded-2xl rounded-tr-sm max-w-[85%] border border-ide-border' 
                      : 'bg-transparent text-ide-text w-full'
                  }`}
                >
                  {msg.text}
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
