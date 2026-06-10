import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';

export function Terminal() {
  const { addStock, portfolio } = useStore();
  const [command, setCommand] = useState('');
  const [logs, setLogs] = useState([
    { type: 'info', text: '[IDE-KOSPI] Starting market data stream...' },
    { type: 'success', text: 'Connected to realtime socket (Upbit WS / Mock Stock).' },
    { type: 'info', text: 'Tip: 종목을 추가하려면 터미널에 "buy [종목코드] [평단가] [수량]" 을 입력하세요. (예: buy KRW-BTC 90000000 0.5)' },
    { type: 'info', text: 'Tip: 종목을 삭제하려면 "rm -rf [종목코드]" 을 입력하세요.' }
  ]);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && command.trim() !== '') {
      const args = command.trim().split(' ');
      const newLogs = [...logs, { type: 'cmd', text: `> ${command}` }];
      
      if (args[0] === 'buy' && args.length >= 4) {
        const code = args[1]; // e.g. KRW-BTC
        const averagePrice = parseFloat(args[2].replace(/,/g, ''));
        const quantity = parseFloat(args[3].replace(/,/g, ''));
        
        if (!isNaN(averagePrice) && !isNaN(quantity)) {
          const predefinedNames: Record<string, string> = { '005930': '삼성전자', '000660': 'SK하이닉스', '035420': 'NAVER', 'KRW-BTC': '비트코인', 'KRW-ETH': '이더리움', 'KRW-XRP': '리플' };
          const name = predefinedNames[code] || code;
          addStock({ name, code, averagePrice, quantity }); 
          newLogs.push({ type: 'success', text: `Successfully added ${code} to Portfolio.js` });
        } else {
          newLogs.push({ type: 'error', text: 'Invalid arguments. Usage: buy [code] [price] [quantity]' });
        }
      } else if (args[0] === 'rm' && args.length >= 2) {
        const targetCodeOrName = args.slice(1).join(' ').replace('-rf', '').trim();
        const state = useStore.getState();
        const stock = state.portfolio.find(s => s.code === targetCodeOrName || s.name === targetCodeOrName);
        
        if (stock) {
          state.removeStock(stock.id);
          newLogs.push({ type: 'success', text: `Successfully deleted ${targetCodeOrName} from Portfolio.js` });
        } else {
          newLogs.push({ type: 'error', text: `rm: cannot remove '${targetCodeOrName}': No such file or directory` });
        }
      } else if (args[0] === 'sell' || args[0] === 'npm' || args[0] === 'git') {
         newLogs.push({ type: 'info', text: `Executing mock command: ${command}` });
      } else {
        newLogs.push({ type: 'error', text: `Command not found: ${args[0]}` });
      }
      
      setLogs(newLogs as any);
      setCommand('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Terminal Tabs */}
      <div className="flex text-[11px] border-b border-[#2b2b2b] uppercase tracking-wide flex-shrink-0 select-none">
        <div className="px-4 py-2 text-[#e7e7e7] border-b-[1px] border-[#e7e7e7] cursor-pointer">Terminal</div>
        <div className="px-4 py-2 text-[#858585] hover:text-[#e7e7e7] cursor-pointer">Problems</div>
        <div className="px-4 py-2 text-[#858585] hover:text-[#e7e7e7] cursor-pointer">Output</div>
        <div className="px-4 py-2 text-[#858585] hover:text-[#e7e7e7] cursor-pointer">Debug Console</div>
      </div>
      
      {/* Terminal Output */}
      <div className="flex-1 p-3 font-mono text-[13px] overflow-y-auto text-[#cccccc] flex flex-col">
        <div className="flex-1">
          {logs.map((log: any, i) => (
            <div key={i} className={`flex ${log.type === 'chat' ? 'mt-3' : ''} mb-1 items-start leading-relaxed`}>
               {log.type === 'info' && <><span className="text-[#3b8eea] w-20 shrink-0 text-right pr-2 font-bold">Info</span><span>{log.text}</span></>}
               {log.type === 'success' && <><span className="text-[#4ec9b0] w-20 shrink-0 text-right pr-2 font-bold">Success</span><span>{log.text}</span></>}
               {log.type === 'error' && <><span className="text-[#f48771] w-20 shrink-0 text-right pr-2 font-bold">Error</span><span>{log.text}</span></>}
               {log.type === 'cmd' && <><span className="text-[#dcdcaa] w-20 shrink-0 text-right pr-2 font-bold">Exec</span><span className="text-[#dcdcaa]">{log.text}</span></>}
               {log.type === 'chat' && (
                 <>
                   <span className="text-[#ce9178] mr-2 w-20 shrink-0 text-right">[{log.time}]</span>
                   <span className="text-[#4fc1ff] font-bold">@{log.user}:</span>
                   <span className="ml-2">{log.text}</span>
                 </>
               )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        
        <div className="flex mt-3 items-center">
          <span className="text-[#a6e22e] mr-2">C:\idekospi&gt;</span>
          <input 
            type="text" 
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent outline-none border-none text-[#cccccc] font-mono text-[13px]"
            spellCheck={false}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
