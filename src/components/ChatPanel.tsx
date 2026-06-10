import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
  author: string;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [author, setAuthor] = useState(() => localStorage.getItem('chat_author') || `User_${Math.floor(Math.random() * 10000)}`);
  const bottomRef = useRef<HTMLDivElement>(null);

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
    <div className="w-full h-full bg-[#252526] flex flex-col text-[#cccccc] font-sans">
      <div className="flex items-center px-4 py-2 border-b border-[#3c3c3c] bg-[#2d2d2d] uppercase text-[11px] tracking-wider font-semibold flex-shrink-0">
        <MessageSquare size={14} className="mr-2" />
        DISCUSSION (OUTPUT)
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-[#858585] text-sm text-center mt-10">
            실시간 종목 토론방에 오신 것을 환영합니다.<br/>
            자유롭게 의견을 나누세요.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              <div className="flex items-baseline space-x-2 mb-1">
                <span className={`text-[12px] font-bold ${msg.author === author ? 'text-[#4fc1ff]' : 'text-[#c586c0]'}`}>
                  {msg.author}
                </span>
                <span className="text-[10px] text-[#858585]">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-[13px] leading-relaxed break-words text-[#d4d4d4] bg-[#2d2d2d] p-2 rounded-r-md rounded-bl-md border border-[#3c3c3c]">
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-[#3c3c3c] bg-[#252526]">
        <form onSubmit={sendMessage} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder="메시지를 입력하세요 (Enter로 전송)"
            className="w-full bg-[#3c3c3c] border border-[#3c3c3c] rounded focus:border-[#007acc] focus:outline-none p-2 pr-10 text-[13px] resize-none custom-scrollbar"
            rows={3}
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 bottom-2 p-1.5 text-[#cccccc] hover:text-white disabled:opacity-50 disabled:hover:text-[#cccccc] bg-[#007acc] rounded"
          >
            <Send size={14} />
          </button>
        </form>
        <div className="mt-2 flex items-center justify-between text-[11px] text-[#858585]">
          <span>익명 닉네임:</span>
          <input 
            type="text" 
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="bg-transparent border-b border-[#3c3c3c] focus:border-[#007acc] focus:outline-none text-right w-24 text-[#cccccc]"
          />
        </div>
      </div>
    </div>
  );
}
