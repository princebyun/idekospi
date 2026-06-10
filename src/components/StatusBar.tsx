import { Info, Bell, CheckCheck } from 'lucide-react';

export function StatusBar() {
  return (
    <div className="h-[22px] bg-[#007acc] text-white text-[11px] flex items-center justify-between px-2 select-none flex-shrink-0 cursor-default">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1 hover:bg-[#1f8ad2] px-2 py-0.5 rounded transition-colors">
          <Info size={13} />
          <span>Not for real trading (15min delayed)</span>
        </div>
        <div className="flex items-center space-x-3 bg-[#1f8ad2] px-2 rounded h-full py-0.5">
          <span>KOSPI: 2,750.12 <span className="text-[#ff9d9d]">(-0.5%)</span></span>
          <span>NASDAQ: 16,300.45 <span className="text-[#a6e22e]">(+1.2%)</span></span>
          <span>BTC: 98,000,000 <span className="text-[#a6e22e]">(+3.4%)</span></span>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded flex items-center space-x-1 transition-colors">
          <CheckCheck size={13} />
          <span>Prettier</span>
        </div>
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded transition-colors">UTF-8</div>
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded transition-colors">TypeScript React</div>
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded flex items-center transition-colors">
          <Bell size={13} />
        </div>
      </div>
    </div>
  );
}
