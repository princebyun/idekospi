import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { DOMESTIC_LIST, GLOBAL_LIST, CRYPTO_LIST } from '../services/marketData';

export function Terminal() {
  const [history, setHistory] = useState<{ type: 'input' | 'output' | 'error', text: string }[]>([
    { type: 'output', text: 'Welcome to IDE-KOSPI Terminal.' },
    { type: 'output', text: 'Type "help" to see available commands.' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const { addStock, removeStock, portfolio } = useStore();

  const MAPPING: Record<string, string> = {
    '비트코인': 'KRW-BTC',
    '이더리움': 'KRW-ETH',
    '리플': 'KRW-XRP',
    '솔라나': 'KRW-SOL',
    '도지코인': 'KRW-DOGE',
    '도지': 'KRW-DOGE',
    '애플': 'AAPL',
    'Apple': 'AAPL',
    '테슬라': 'TSLA',
    'Tesla': 'TSLA',
    '엔비디아': 'NVDA',
    'NVIDIA': 'NVDA',
    '나스닥': '^IXIC',
    '코스피': '^KS11',
    '코스닥': '^KQ11'
  };
  [...DOMESTIC_LIST, ...GLOBAL_LIST, ...CRYPTO_LIST].forEach(item => {
    MAPPING[item.name] = item.code;
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(/\s+/);
    const command = args[0].toLowerCase();

    if (command === 'help') {
      return [
        'Available commands:',
        '  add <name>  : Add stock to portfolio (e.g. add 삼성전자)',
        '  rm <name>   : Remove stock from portfolio (e.g. rm 삼성전자)',
        '  clear       : Clear terminal',
      ];
    }

    if (command === 'clear') {
      setHistory([]);
      return [];
    }

    if (command === 'buy' || command === 'add') {
      if (args.length < 2) return ['Error: Usage: add <name>'];
      const name = args.slice(1).join(' ');
      
      const code = MAPPING[name] || MAPPING[name.toUpperCase()];
      
      if (!code) {
        return [`Error: "${name}" 은(는) 지원되지 않는 종목입니다. 사전에 정의된 종목(예: 테슬라, QQQ 등)만 추가 가능합니다.`];
      }
      
      addStock({ name: name, code });
      return [`Successfully added ${name} (${code}) to portfolio.`];
    }

    if (command === 'rm' || command === 'rm-rf' || command === 'rm -rf') {
      const name = args.slice(1).join(' ');
      if (!name) return ['Error: Usage: rm <name>'];
      
      const target = portfolio.find(s => s.name === name || s.code === name);
      if (target) {
        removeStock(target.id);
        return [`Successfully removed ${target.name} from portfolio.`];
      }
      return [`Error: Could not find ${name} in portfolio.`];
    }

    return [`Command not found: ${command}`];
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newHistory = [...history, { type: 'input' as const, text: input }];
    const outputLines = handleCommand(input);
    
    if (outputLines.length > 0) {
      outputLines.forEach(line => {
        newHistory.push({
          type: line.startsWith('Error') ? 'error' : 'output',
          text: line
        });
      });
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] font-mono text-[13px] border-t border-[#404040]">
      <div className="flex items-center px-4 h-8 text-[#e7e7e7] uppercase tracking-wider text-xs font-semibold select-none bg-[#252526]">
        <TerminalIcon size={14} className="mr-2" />
        Terminal
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className={`mb-1 ${line.type === 'error' ? 'text-[#f48771]' : line.type === 'input' ? 'text-[#cccccc]' : 'text-[#858585]'}`}>
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
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[#cccccc]"
            autoFocus
            spellCheck={false}
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
