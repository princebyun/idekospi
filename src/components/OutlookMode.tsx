import { useStore } from '../store/useStore';
import { useMemo } from 'react';

export function OutlookMode() {
  const { portfolio, prices, setTheme } = useStore();

  const formattedMails = useMemo(() => {
    return portfolio.map((item, i) => {
      const priceData = prices[item.code] || { price: 0, changeRate: 0 };
      
      const priceStr = priceData.price ? priceData.price.toLocaleString() : 'Loading...';
      const changeStr = priceData.changeRate ? (priceData.changeRate > 0 ? `+${priceData.changeRate.toFixed(2)}%` : `${priceData.changeRate.toFixed(2)}%`) : '';
      
      const isUp = priceData.changeRate > 0;
      
      return {
        id: item.id,
        sender: 'Service Desk',
        subject: `[Alert] System Status Update: ${item.name} node performance`,
        preview: `The current metric is ${priceStr} (${changeStr}). Please review the attached logs.`,
        time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} AM`,
        isUp,
        isUnread: i < 3
      };
    });
  }, [portfolio, prices]);

  return (
    <div className="flex flex-col h-screen w-full bg-white text-[#252423] font-['Segoe_UI',_system-ui,_-apple-system,_sans-serif]">
      {/* Outlook Header */}
      <div className="h-12 bg-[#0078d4] flex items-center px-4 justify-between text-white select-none">
        <div className="flex items-center">
          <div 
            className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center cursor-pointer mr-2 transition-colors"
            title="App Launcher"
          >
            <svg viewBox="0 0 2048 2048" className="w-5 h-5 fill-current"><path d="M102 102h512v512H102V102zm717 0h512v512H819V102zm717 0h512v512h-512V102zM102 819h512v512H102V819zm717 0h512v512H819V819zm717 0h512v512h-512V819zM102 1536h512v512H102v-512zm717 0h512v512H819v-512zm717 0h512v512h-512v-512z"></path></svg>
          </div>
          <span 
            className="font-semibold text-[16px] cursor-pointer"
            onClick={() => setTheme('vscode-dark')}
            title="Switch back to Developer Mode"
          >
            Outlook
          </span>
        </div>
        <div className="flex-1 max-w-xl mx-4">
          <div className="bg-white/20 hover:bg-white/30 rounded flex items-center px-3 h-8 text-sm transition-colors cursor-text">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="text-white/80">Search</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#005a9e] border border-white/20 flex items-center justify-center text-xs font-bold cursor-pointer">
            ME
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation */}
        <div className="w-[200px] border-r border-[#edebe9] bg-[#f3f2f1] py-2 select-none hidden md:block">
          <div className="px-4 py-2 hover:bg-[#edebe9] cursor-pointer flex items-center">
            <span className="text-[#0078d4] font-semibold text-sm">Inbox</span>
            <span className="ml-auto text-xs font-semibold text-[#0078d4]">{formattedMails.length}</span>
          </div>
          <div className="px-4 py-2 hover:bg-[#edebe9] cursor-pointer flex items-center text-[#605e5c]">
            <span className="text-sm">Sent Items</span>
          </div>
          <div className="px-4 py-2 hover:bg-[#edebe9] cursor-pointer flex items-center text-[#605e5c]">
            <span className="text-sm">Deleted Items</span>
          </div>
          <div className="px-4 py-2 hover:bg-[#edebe9] cursor-pointer flex items-center text-[#605e5c]">
            <span className="text-sm">Junk Email</span>
          </div>
        </div>

        {/* Mail List */}
        <div className="w-[300px] lg:w-[350px] border-r border-[#edebe9] bg-white flex flex-col">
          <div className="h-12 border-b border-[#edebe9] flex items-center px-4 flex-shrink-0">
            <h2 className="text-xl font-light text-[#252423]">Inbox</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {formattedMails.map((mail) => (
              <div 
                key={mail.id}
                className={`border-b border-[#edebe9] p-3 cursor-pointer hover:bg-[#f3f2f1] transition-colors ${mail.isUnread ? 'bg-white' : 'bg-white'}`}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className={`text-sm ${mail.isUnread ? 'font-bold' : 'font-semibold'}`}>{mail.sender}</span>
                  <span className="text-xs text-[#605e5c]">{mail.time}</span>
                </div>
                <div className={`text-sm mb-1 truncate ${mail.isUnread ? 'font-semibold text-[#0078d4]' : 'text-[#252423]'}`}>
                  {mail.subject}
                </div>
                <div className="text-xs text-[#605e5c] truncate">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${mail.isUp ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {mail.preview}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reading Pane */}
        <div className="flex-1 bg-white hidden sm:flex flex-col">
          {formattedMails.length > 0 ? (
            <div className="p-8">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-semibold mb-4 text-[#252423]">{formattedMails[0].subject}</h1>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#0078d4] text-white flex items-center justify-center font-bold text-lg mr-3">
                      SD
                    </div>
                    <div>
                      <div className="font-semibold text-[15px]">{formattedMails[0].sender}</div>
                      <div className="text-xs text-[#605e5c]">To: You</div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-[#605e5c]">{formattedMails[0].time}</div>
              </div>
              <div className="mt-8 text-[15px] text-[#252423] leading-relaxed">
                <p className="mb-4">Hello,</p>
                <p className="mb-4">This is an automated system notification regarding the tracked nodes.</p>
                <div className="bg-[#f3f2f1] p-4 rounded-md border border-[#edebe9] mb-4">
                  <code className="text-sm text-[#605e5c]">
                    {formattedMails[0].preview}
                  </code>
                </div>
                <p>Please take necessary actions if the metrics exceed acceptable thresholds.</p>
                <p className="mt-8 text-[#605e5c]">
                  Best regards,<br/>
                  IT Operations Team
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col text-[#605e5c]">
              <svg className="w-24 h-24 mb-4 text-[#edebe9]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z" clipRule="evenodd" /></svg>
              <h3 className="text-lg font-semibold">Select an item to read</h3>
              <p className="text-sm">Click here to always select the first item in the list</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
