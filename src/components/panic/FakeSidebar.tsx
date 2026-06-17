import { FolderOpen, FileCode } from 'lucide-react';

export function FakeSidebar() {
  return (
    <div className="h-full flex flex-col bg-ide-sidebar border-r border-ide-border">
      <div className="flex items-center px-4 h-8 text-[#e7e7e7] uppercase tracking-wider text-xs font-semibold select-none">
        EXPLORER
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 select-none text-[#cccccc] text-[13px]">
        <div className="flex items-center mb-1 cursor-pointer">
          <FolderOpen size={14} className="mr-2 text-ide-text-muted" />
          <span className="font-semibold text-ide-text">IDE-KOSPI-CORE</span>
        </div>
        <div className="pl-4">
          <div className="flex items-center mb-1 text-ide-text-muted hover:text-ide-text cursor-pointer">
            <FolderOpen size={14} className="mr-2" />
            <span>.github</span>
          </div>
          <div className="flex items-center mb-1 text-ide-text-muted hover:text-ide-text cursor-pointer">
            <FolderOpen size={14} className="mr-2" />
            <span>node_modules</span>
          </div>
          <div className="flex items-center mb-1 cursor-pointer">
            <FolderOpen size={14} className="mr-2 text-[#4fc1ff]" />
            <span className="text-[#e7e7e7]">src</span>
          </div>
          <div className="pl-4">
            <div className="flex items-center mb-1 cursor-pointer hover:bg-ide-bg rounded px-1">
              <FileCode size={14} className="mr-2 text-[#ffca28]" />
              <span className="text-ide-text">App.tsx</span>
            </div>
            <div className="flex items-center mb-1 cursor-pointer hover:bg-ide-bg rounded px-1">
              <FileCode size={14} className="mr-2 text-[#4fc1ff]" />
              <span className="text-ide-text">SecurityConfig.java</span>
            </div>
            <div className="flex items-center mb-1 cursor-pointer hover:bg-ide-bg rounded px-1">
              <FileCode size={14} className="mr-2 text-[#4fc1ff]" />
              <span className="text-ide-text">UserService.java</span>
            </div>
          </div>
          <div className="flex items-center mb-1 text-ide-text-muted hover:text-ide-text cursor-pointer">
            <FileCode size={14} className="mr-2 text-[#cc3e44]" />
            <span>package.json</span>
          </div>
          <div className="flex items-center mb-1 text-ide-text-muted hover:text-ide-text cursor-pointer">
            <FileCode size={14} className="mr-2 text-[#cc3e44]" />
            <span>build.gradle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
