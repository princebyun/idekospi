import { useStore } from '../../store/useStore';

export function SettingsView() {
  const { theme, setTheme } = useStore();

  const themes = [
    { id: 'vscode-dark', name: 'VSCode Dark', bg: '#1e1e1e', primary: '#007acc' },
    { id: 'intellij', name: 'IntelliJ Darcula', bg: '#2b2b2b', primary: '#214283' },
    { id: 'light', name: 'Light Theme', bg: '#ffffff', primary: '#007acc', text: '#333333' },
    { id: 'outlook', name: 'Outlook Mode', bg: '#ffffff', primary: '#0078d4', text: '#333333' },
    { id: 'monokai', name: 'Monokai', bg: '#272822', primary: '#a6e22e' },
    { id: 'github-dark', name: 'GitHub Dark', bg: '#0d1117', primary: '#58a6ff' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 text-ide-text custom-scrollbar">
      <div className="mb-6">
        <div className="mb-3 text-[11px] text-ide-text-muted uppercase tracking-wider font-semibold">Theme</div>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((t) => (
            <div 
              key={t.id}
              onClick={() => setTheme(t.id as any)}
              className={`flex flex-col p-2 rounded cursor-pointer border transition-colors ${theme === t.id ? 'border-ide-primary bg-ide-primary/10' : 'border-ide-border hover:border-ide-text-muted'}`}
            >
              <div 
                className="h-10 rounded border border-[#333] mb-2 flex flex-col overflow-hidden"
                style={{ backgroundColor: t.bg }}
              >
                <div className="h-2 w-full" style={{ backgroundColor: t.primary }}></div>
                <div className="flex-1 p-1">
                  <div className="h-1 w-1/2 rounded mb-1" style={{ backgroundColor: t.text || '#fff', opacity: 0.3 }}></div>
                  <div className="h-1 w-3/4 rounded" style={{ backgroundColor: t.text || '#fff', opacity: 0.3 }}></div>
                </div>
              </div>
              <span className="text-[11px] text-center">{t.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 text-[11px] text-ide-text-muted uppercase tracking-wider font-semibold">Legal Notice & Policy</div>
        <div className="text-[11px] text-ide-text-muted leading-relaxed bg-ide-bg p-3 rounded border border-ide-border">
          본 서비스는 정보 제공 목적이며 실제 투자 권유를 의미하지 않습니다.<br/><br/>
          야후 파이낸스 API 특성상 한국 시장(국장) 데이터는 15~20분 지연될 수 있습니다.<br/><br/>
          서버에 개인정보를 평문으로 저장하지 않으며 브라우저 LocalStorage를 활용합니다.
        </div>
      </div>
    </div>
  );
}
