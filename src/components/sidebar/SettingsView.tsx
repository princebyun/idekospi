import { useStore } from '../../store/useStore';

export function SettingsView() {
  const { theme, setTheme } = useStore();

  return (
    <div className="flex-1 overflow-y-auto p-4 text-ide-text">
      <div className="mb-6">
        <div className="mb-2 text-[11px] text-ide-text-muted uppercase">Theme</div>
        <select 
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'vscode-dark' | 'intellij' | 'light' | 'outlook')}
          className="w-full bg-ide-border border border-ide-border rounded p-1 text-[12px] outline-none cursor-pointer"
        >
          <option value="vscode-dark">VSCode Dark</option>
          <option value="intellij">IntelliJ Darcula</option>
          <option value="light">Light Theme</option>
          <option value="outlook">Outlook Mail Mode</option>
        </select>
      </div>

      <div className="mb-6">
        <div className="mb-2 text-[11px] text-ide-text-muted uppercase">Legal Notice & Policy</div>
        <div className="text-[11px] text-ide-text-muted leading-relaxed bg-ide-bg p-2 rounded border border-ide-border">
          본 서비스는 정보 제공 목적이며 실제 투자 권유를 의미하지 않습니다.<br/><br/>
          야후 파이낸스 API 특성상 한국 시장(국장) 데이터는 15~20분 지연될 수 있습니다.<br/><br/>
          서버에 개인정보를 평문으로 저장하지 않으며 브라우저 LocalStorage를 활용합니다.
        </div>
      </div>
    </div>
  );
}
