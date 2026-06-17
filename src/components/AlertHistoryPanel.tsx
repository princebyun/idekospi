import { useStore } from '../store/useStore';
import { X, Bell, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

export function AlertHistoryPanel() {
  const { isAlertHistoryOpen, toggleAlertHistory, alertHistory, clearAlertHistory } = useStore();

  if (!isAlertHistoryOpen) return null;

  return (
    <div className="absolute bottom-[24px] right-2 w-80 bg-[#252526] border border-[#454545] shadow-2xl z-50 flex flex-col max-h-[400px] text-ide-text rounded-md">
      <div className="flex items-center justify-between p-2 border-b border-[#454545] select-none">
        <div className="flex items-center space-x-2 text-[12px] font-semibold">
          <Bell size={14} className="text-ide-text-muted" />
          <span>Notifications</span>
        </div>
        <div className="flex space-x-1">
          {alertHistory.length > 0 && (
            <button onClick={clearAlertHistory} className="text-[10px] text-ide-text-muted hover:text-white px-2 py-0.5 rounded hover:bg-[#3c3c3c]">
              Clear All
            </button>
          )}
          <button onClick={toggleAlertHistory} className="text-ide-text-muted hover:text-white p-0.5 rounded hover:bg-[#3c3c3c]">
            <X size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        {alertHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-ide-text-muted">
            <Bell size={24} className="mb-2 opacity-50" />
            <span className="text-[11px]">No new notifications.</span>
          </div>
        ) : (
          alertHistory.map((alert) => (
            <div key={alert.id} className="p-2 mb-1 hover:bg-[#2a2d2e] rounded border border-transparent hover:border-[#454545] transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold">
                  {alert.type === 'UP' ? <ArrowUp size={12} className="inline text-[#ff9d9d] mr-1" /> : alert.type === 'DOWN' ? <ArrowDown size={12} className="inline text-[#8cb4ff] mr-1" /> : <AlertTriangle size={12} className="inline text-[#ffcc00] mr-1" />}
                  Price Alert
                </span>
                <span className="text-[10px] text-ide-text-muted">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-[12px] text-[#cccccc] leading-relaxed">
                {alert.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
