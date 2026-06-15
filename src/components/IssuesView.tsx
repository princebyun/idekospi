import { MessageSquare, GitPullRequest } from 'lucide-react';

export function IssuesView() {
  
  // Mock data for PRs/Issues
  const issues = [
    { id: '1', title: 'Feature: 엔비디아(NVDA) 어닝 서프라이즈 대응', author: 'bull_runner', status: 'Open', comments: 15, tag: 'NVDA' },
    { id: '2', title: 'Bugfix: 코스피 하락장 버그 수정좀', author: 'sad_bear', status: 'Closed', comments: 42, tag: '^KS11' },
    { id: '3', title: 'Refactor: 비트코인 1억 돌파 로직 개선', author: 'crypto_king', status: 'Open', comments: 8, tag: 'KRW-BTC' },
    { id: '4', title: 'Docs: 애플(AAPL) 배당금 지급일 공지', author: 'apple_lover', status: 'Open', comments: 3, tag: 'AAPL' },
    { id: '5', title: 'Feature: 테슬라(TSLA) FSD v12 관련 모멘텀 추가', author: 'elon_fan', status: 'Open', comments: 24, tag: 'TSLA' },
  ];

  return (
    <div className="p-6 h-full flex flex-col max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white flex items-center">
          <GitPullRequest className="mr-3 text-[#4fc1ff]" size={24} />
          Pull Requests (종목토론방)
        </h2>
        <button className="bg-[#519657] hover:bg-[#438249] text-white px-3 py-1.5 rounded text-sm transition-colors font-medium">
          New Pull Request
        </button>
      </div>

      <div className="bg-[#1e1e1e] border border-ide-border rounded-md overflow-hidden flex-1">
        <div className="bg-[#252526] border-b border-ide-border px-4 py-3 flex items-center text-sm font-medium text-[#cccccc]">
          <div className="w-10">Status</div>
          <div className="flex-1">Title</div>
          <div className="w-24">Author</div>
          <div className="w-24 text-center">Tag</div>
          <div className="w-16 text-right"><MessageSquare size={14} className="inline" /></div>
        </div>
        
        <div className="overflow-y-auto">
          {issues.map(issue => (
            <div 
              key={issue.id}
              className="border-b border-ide-border px-4 py-3 flex items-center text-[13px] hover:bg-[#2a2d2e] cursor-pointer transition-colors"
            >
              <div className="w-10">
                {issue.status === 'Open' 
                  ? <GitPullRequest size={16} className="text-[#519657]" /> 
                  : <GitPullRequest size={16} className="text-[#8cb4ff]" />}
              </div>
              <div className="flex-1 font-medium text-[#e7e7e7] pr-4 truncate">
                {issue.title}
              </div>
              <div className="w-24 text-ide-text-muted truncate">
                {issue.author}
              </div>
              <div className="w-24 text-center">
                <span className="bg-[#2d2d2d] border border-[#3d3d3d] rounded px-2 py-0.5 text-[11px] text-[#4fc1ff]">
                  {issue.tag}
                </span>
              </div>
              <div className="w-16 text-right text-ide-text-muted">
                {issue.comments}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-[12px] text-ide-text-muted text-center">
        * IDE-KOSPI의 종목토론방은 Pull Requests 형태로 위장하여 제공됩니다.
      </div>
    </div>
  );
}
