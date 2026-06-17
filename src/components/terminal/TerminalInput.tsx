import { useState, useRef, useEffect } from 'react';
import { handleTerminalCommand } from '../../services/terminalCommands';
import { useStore } from '../../store/useStore';

export function TerminalInput() {
  const [history, setHistory] = useState<{ type: 'input' | 'output' | 'error' | 'system', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentPortfolio = useStore.getState().portfolio;
      const currentPrices = useStore.getState().prices;

      if (currentPortfolio.length === 0) return;

      const randomItem = currentPortfolio[Math.floor(Math.random() * currentPortfolio.length)];
      const priceData = currentPrices[randomItem.code];

      if (priceData) {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];

        const prefix = priceData.changeRate > 0 ? '+' : '';
        const status = priceData.changeRate > 0 ? 'UPTREND' : priceData.changeRate < 0 ? 'DOWNTREND' : 'STABLE';

        const marketTag = priceData.marketState === 'PRE' ? '[PRE] ' : (priceData.marketState === 'POST' || priceData.marketState === 'CLOSED' ? '[AFT] ' : '');
        const logText = `[INFO] [${timeStr}] SYSTEM_FETCH: ${randomItem.name} (${randomItem.code}) Connection OK. Tick: ${priceData.price.toLocaleString()} (${marketTag}${prefix}${priceData.changeRate.toFixed(2)}%) - ${status}`;

        setHistory(prev => {
          const next = [...prev, { type: 'system' as const, text: logText }];
          if (next.length > 100) return next.slice(next.length - 100);
          return next;
        });
      }
    }, 4500);

    return () => clearInterval(intervalId);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const newHistory = [...history, { type: 'input' as const, text: input }];
    setHistory(newHistory);
    
    setCommandHistory(prev => [cmd, ...prev]);
    setHistoryIndex(-1);
    setInput('');

    if (cmd.toLowerCase() === 'clear') {
      setHistory([]);
      return;
    }

    const outputLines = await handleTerminalCommand(cmd);

    if (outputLines.length > 0) {
      setHistory(prev => {
        const next = [...prev];
        outputLines.forEach(line => {
          next.push({
            type: line.startsWith('Error') ? 'error' : 'output',
            text: line
          });
        });
        return next;
      });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <>
      <div className="sticky top-0 bg-ide-bg z-10 px-4 py-3 border-b border-ide-border shrink-0 shadow-sm">
        <div className="text-ide-text-muted font-bold mb-1">IDE-KOSPI 터미널에 오신 것을 환영합니다.</div>
        <div className="text-ide-text-muted">IDE-KOSPI의 사용법을 보려면 터미널에 help를 입력해보세요.</div>
      </div>

      <div className="p-4 flex-1">
        {history.map((line, i) => (
          <div key={i} className={`mb-1 ${line.type === 'error' ? 'text-[#f48771]' : line.type === 'input' ? 'text-ide-text' : line.type === 'system' ? 'text-code-comment' : 'text-ide-text-muted'}`}>
            {line.type === 'input' && <span className="text-[#519657] mr-2">➜</span>}
            {line.text}
          </div>
        ))}

        <form onSubmit={onSubmit} className="flex items-center mt-2">
          <span className="text-[#519657] mr-2">➜</span>
          <span className="text-[#4fc1ff] mr-2">~</span>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setHistoryIndex(-1);
            }}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent outline-none text-ide-text"
            autoFocus
            spellCheck={false}
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </>
  );
}
