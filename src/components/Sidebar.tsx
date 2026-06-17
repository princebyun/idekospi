import { useStore } from '../store/useStore';
import { ExplorerView } from './sidebar/ExplorerView';
import { SearchView } from './sidebar/SearchView';
import { ExtensionsView } from './sidebar/ExtensionsView';
import { SettingsView } from './sidebar/SettingsView';
import { SourceControlPanel } from './sidebar/SourceControlPanel';

export function Sidebar({ activeTab }: { activeTab: string }) {
  const { setSelectedIssueId, openTab } = useStore();

  return (
    <div className="flex flex-col h-full text-sm">
      {/* Main Content Area (Top 45%) */}
      <div className="flex-[45] flex flex-col min-h-0">
        <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ide-text flex-shrink-0">
          {activeTab === 'explorer' ? '탐색기' : activeTab === 'search' ? 'Search' : activeTab === 'issues' ? 'Pull Requests' : activeTab === 'extensions' ? 'Extensions' : 'Settings'}
        </div>
        
        {activeTab === 'explorer' && <ExplorerView />}
        {activeTab === 'extensions' && <ExtensionsView />}
        {activeTab === 'search' && <SearchView />}
        {activeTab === 'settings' && <SettingsView />}

        {activeTab === 'issues' && (
          <div className="flex-1 overflow-y-auto p-4 text-ide-text">
            <div className="mb-2 text-[11px] text-ide-text-muted uppercase">Pull Requests</div>
            <div className="text-[12px] mb-4 leading-relaxed">
              종목토론방을 Pull Request 뷰로 확인하세요. 종목에 대한 최신 이슈와 토론이 등록되어 있습니다.
            </div>
            <button 
              onClick={() => {
                setSelectedIssueId(null);
                openTab({ id: 'issues_view', title: 'PullRequests.md', icon: 'M', color: '#519657', type: 'issues_view' });
              }}
              className="w-full bg-ide-primary hover:bg-[#005f9e] text-white py-1.5 rounded text-[12px] transition-colors mb-4"
            >
              종목토론방 열기
            </button>
          </div>
        )}
      </div>

      {/* Source Control Panel (Bottom 55%) - Always Visible except settings */}
      {activeTab !== 'settings' && activeTab !== 'git' && (
        <SourceControlPanel />
      )}
    </div>
  );
}
