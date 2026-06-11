import { Files, Search, Settings, MessageSquare, GitBranch } from 'lucide-react';

interface ActivityBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ActivityBar({ activeTab, setActiveTab }: ActivityBarProps) {
  const iconClass = (tab: string) => 
    `p-3 cursor-pointer ${activeTab === tab ? 'text-white border-l-2 border-[#007acc]' : 'text-[#858585] hover:text-white border-l-2 border-transparent'}`;

  return (
    <div className="w-12 bg-[#333333] flex flex-col items-center py-2 flex-shrink-0">
      <div className={iconClass('explorer')} onClick={() => setActiveTab('explorer')} title="Explorer">
        <Files size={24} strokeWidth={1.5} />
      </div>
      <div className={iconClass('search')} onClick={() => setActiveTab('search')} title="Search (Quick Open)">
        <Search size={24} strokeWidth={1.5} />
      </div>
      <div className={iconClass('git')} onClick={() => setActiveTab('git')} title="Source Control">
        <GitBranch size={24} strokeWidth={1.5} />
      </div>
      <div className={iconClass('chat')} onClick={() => setActiveTab('chat')} title="Discussion (Output)">
        <MessageSquare size={24} strokeWidth={1.5} />
      </div>
      <div className="flex-1"></div>
      <div className={iconClass('settings')} onClick={() => setActiveTab('settings')} title="Settings">
        <Settings size={24} strokeWidth={1.5} />
      </div>
    </div>
  );
}
