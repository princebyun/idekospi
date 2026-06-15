import { useState, useEffect } from 'react';
import { MessageSquare, GitPullRequest, ArrowLeft, Send } from 'lucide-react';
import { useStore } from '../store/useStore';

export function IssuesView() {
  const { selectedIssueId, setSelectedIssueId } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  
  // Mock data for PRs/Issues
  const [issues, setIssues] = useState([
    { id: '1', title: 'Feature: 엔비디아(NVDA) 어닝 서프라이즈 대응', author: 'bull_runner', status: 'Open', comments: 15, tag: 'NVDA' },
    { id: '2', title: 'Bugfix: 코스피 하락장 버그 수정좀', author: 'sad_bear', status: 'Closed', comments: 42, tag: '^KS11' },
    { id: '3', title: 'Refactor: 비트코인 1억 돌파 로직 개선', author: 'crypto_king', status: 'Open', comments: 8, tag: 'KRW-BTC' },
    { id: '4', title: 'Docs: 애플(AAPL) 배당금 지급일 공지', author: 'apple_lover', status: 'Open', comments: 3, tag: 'AAPL' },
    { id: '5', title: 'Feature: 테슬라(TSLA) FSD v12 관련 모멘텀 추가', author: 'elon_fan', status: 'Open', comments: 24, tag: 'TSLA' },
  ]);

  const mockComments: Record<string, {author: string, content: string, time: string}[]> = {
    '1': [
      { author: 'bull_runner', content: '이번 어닝 서프라이즈로 $1,200 돌파할 것 같습니다. 롱 포지션 유지합니다.', time: '2 hours ago' },
      { author: 'bear_killer', content: '동의합니다. 가이던스도 미쳤네요.', time: '1 hour ago' },
    ],
    '2': [
      { author: 'sad_bear', content: '코스피 또 하락이네요... 언제 오르나요', time: '1 day ago' },
      { author: 'samsung_holder', content: '외인 매도세가 멈추질 않네요. 관망 추천합니다.', time: '12 hours ago' },
    ]
  };

  const [currentComments, setCurrentComments] = useState<{author: string, content: string, time: string}[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueTag, setNewIssueTag] = useState('');

  // store에서 selectedIssueId가 변경될 때마다 코멘트를 동기화
  useEffect(() => {
    if (selectedIssueId) {
      setCurrentComments(mockComments[selectedIssueId] || []);
    }
  }, [selectedIssueId]);

  const handleIssueClick = (id: string) => {
    setSelectedIssueId(id);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCurrentComments([...currentComments, { author: 'me (Developer)', content: newComment, time: 'Just now' }]);
    setNewComment('');
  };

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssueTitle.trim()) return;
    const newId = (issues.length + 1).toString();
    setIssues([
      { id: newId, title: newIssueTitle, author: 'me (Developer)', status: 'Open', comments: 0, tag: newIssueTag || 'General' },
      ...issues
    ]);
    setIsCreating(false);
    setNewIssueTitle('');
    setNewIssueTag('');
  };

  if (isCreating) {
    return (
      <div className="p-6 h-full flex flex-col max-w-4xl mx-auto text-ide-text">
        <div className="flex items-center mb-6">
          <button onClick={() => setIsCreating(false)} className="mr-4 hover:bg-[#2d2d2d] p-1 rounded transition-colors text-ide-text-muted hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-white flex items-center">
            <GitPullRequest className="mr-3 text-[#519657]" size={20} />
            Open a Pull Request
          </h2>
        </div>
        <form onSubmit={handleCreateIssue} className="flex-1">
          <div className="mb-4">
            <label className="block text-[12px] font-bold text-ide-text-muted mb-2 uppercase">Title</label>
            <input 
              type="text" 
              value={newIssueTitle}
              onChange={(e) => setNewIssueTitle(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-ide-border rounded px-3 py-2 text-white focus:border-[#4fc1ff] outline-none transition-colors"
              placeholder="e.g., Feature: 삼성전자 배당락일 대응 전략"
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label className="block text-[12px] font-bold text-ide-text-muted mb-2 uppercase">Tag (Ticker)</label>
            <input 
              type="text" 
              value={newIssueTag}
              onChange={(e) => setNewIssueTag(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-ide-border rounded px-3 py-2 text-white focus:border-[#4fc1ff] outline-none transition-colors"
              placeholder="e.g., 005930.KS"
            />
          </div>
          <button type="submit" className="bg-[#519657] hover:bg-[#438249] text-white px-4 py-2 rounded text-sm font-medium transition-colors">
            Create Pull Request
          </button>
        </form>
      </div>
    );
  }

  if (selectedIssueId) {
    const issue = issues.find(i => i.id === selectedIssueId);
    return (
      <div className="p-6 h-full flex flex-col max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={() => setSelectedIssueId(null)} className="mr-4 hover:bg-[#2d2d2d] p-1 rounded transition-colors text-ide-text-muted hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white flex items-center">
              {issue?.title}
              <span className="ml-3 text-ide-text-muted font-normal text-lg">#{issue?.id}</span>
            </h2>
            <div className="flex items-center mt-2 text-[13px] text-ide-text-muted">
              <span className={`px-2 py-0.5 rounded-full text-white text-[11px] font-medium mr-3 ${issue?.status === 'Open' ? 'bg-[#238636]' : 'bg-[#8957e5]'}`}>
                <GitPullRequest size={12} className="inline mr-1" />
                {issue?.status}
              </span>
              <span className="font-medium text-ide-text">{issue?.author}</span>
              <span className="mx-1">wants to merge this</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {currentComments.map((comment, idx) => (
            <div key={idx} className="bg-[#1e1e1e] border border-ide-border rounded-md overflow-hidden">
              <div className="bg-[#2d2d2d] px-4 py-2 text-[12px] flex items-center justify-between border-b border-ide-border">
                <div className="font-medium text-[#e7e7e7]">{comment.author}</div>
                <div className="text-ide-text-muted">{comment.time}</div>
              </div>
              <div className="p-4 text-[13px] text-ide-text leading-relaxed">
                {comment.content}
              </div>
            </div>
          ))}
          {currentComments.length === 0 && (
            <div className="text-center text-ide-text-muted py-8 text-[13px]">
              아직 등록된 토론(리뷰 코멘트)이 없습니다.
            </div>
          )}
        </div>

        <form onSubmit={handleAddComment} className="mt-4 pt-4 border-t border-ide-border flex items-end space-x-2">
          <div className="flex-1 bg-[#1e1e1e] border border-ide-border rounded-md overflow-hidden focus-within:border-[#4fc1ff] transition-colors">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a comment (토론 남기기)..."
              className="w-full bg-transparent text-ide-text px-3 py-2 text-[13px] outline-none min-h-[60px] resize-y"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment(e);
                }
              }}
            />
          </div>
          <button type="submit" disabled={!newComment.trim()} className="bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-md transition-colors h-[60px] w-[60px] flex items-center justify-center">
            <Send size={18} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white flex items-center select-none">
          <GitPullRequest className="mr-3 text-[#4fc1ff]" size={24} />
          Pull Requests (종목토론방)
        </h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-[#519657] hover:bg-[#438249] text-white px-3 py-1.5 rounded text-sm transition-colors font-medium select-none"
        >
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
              onClick={() => handleIssueClick(issue.id)}
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
