import { Terminal as TerminalIcon, AlertCircle } from 'lucide-react';

export function FakeTerminal() {
  return (
    <div className="h-full flex flex-col bg-ide-bg font-mono text-[13px] border-t border-ide-border">
      <div className="flex items-center px-4 h-8 text-[#e7e7e7] uppercase tracking-wider text-xs font-semibold select-none bg-ide-sidebar">
        <TerminalIcon size={14} className="mr-2" />
        Terminal
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="text-ide-text-muted mb-2">➜  IDE-KOSPI-CORE git:(main) ✗ ./gradlew build</div>
        <div className="text-ide-text mb-1">Starting a Gradle Daemon (subsequent builds will be faster)</div>
        <div className="text-ide-text mb-1">&gt; Task :compileJava</div>
        <div className="text-ide-text mb-1">&gt; Task :processResources</div>
        <div className="text-ide-text mb-1">&gt; Task :classes</div>
        <div className="text-ide-text mb-1">&gt; Task :bootJar</div>
        <div className="text-ide-text mb-1">&gt; Task :jar</div>
        <div className="text-ide-text mb-1">&gt; Task :assemble</div>
        <div className="text-ide-text mb-1">&gt; Task :compileTestJava</div>
        <div className="text-ide-text mb-1">&gt; Task :processTestResources</div>
        <div className="text-ide-text mb-1">&gt; Task :testClasses</div>
        <div className="text-[#ff9d9d] mb-1">
          <AlertCircle size={12} className="inline mr-1" />
          Note: Some input files use or override a deprecated API.
        </div>
        <div className="text-[#ff9d9d] mb-2">
          <AlertCircle size={12} className="inline mr-1" />
          Note: Recompile with -Xlint:deprecation for details.
        </div>
        <div className="text-[#519657] mb-2 font-bold">BUILD SUCCESSFUL in 14s</div>
        <div className="text-ide-text-muted mb-1">8 actionable tasks: 8 executed</div>
        <div className="flex items-center mt-2">
          <span className="text-[#519657] mr-2">➜</span>
          <span className="text-[#4fc1ff] mr-2">IDE-KOSPI-CORE</span>
          <span className="text-ide-text-muted animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
}
