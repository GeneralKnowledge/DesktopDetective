import type { AppId } from '@/types';
import { useCase } from '@/investigation/CaseProvider';
import { WindowFrame } from '@/desktop/WindowFrame';
import { DesktopIcons, Taskbar } from '@/desktop/Taskbar';
import { BootScreen } from '@/desktop/BootScreen';
import { DebugPanel } from '@/investigation/DebugPanel';
import { MailApp } from '@/applications/mail/MailApp';
import { FilesApp } from '@/applications/files/FilesApp';
import { BrowserApp } from '@/applications/browser/BrowserApp';
import { ChatApp } from '@/applications/chat/ChatApp';
import { CalendarApp } from '@/applications/calendar/CalendarApp';
import { NotesApp } from '@/applications/notes/NotesApp';
import { RecycleBinApp } from '@/applications/recycle-bin/RecycleBinApp';
import { SearchApp } from '@/applications/search/SearchApp';
import { InvestigationBoard } from '@/investigation/InvestigationBoard';
import { NotebookApp } from '@/investigation/Notebook';
import { CaseResolution } from '@/investigation/CaseResolution';

function AppContent({ appId }: { appId: AppId }) {
  switch (appId) {
    case 'mail':
      return <MailApp />;
    case 'files':
      return <FilesApp />;
    case 'browser':
      return <BrowserApp />;
    case 'chat':
      return <ChatApp />;
    case 'calendar':
      return <CalendarApp />;
    case 'notes':
      return <NotesApp />;
    case 'recycle':
      return <RecycleBinApp />;
    case 'search':
      return <SearchApp />;
    case 'board':
      return <InvestigationBoard />;
    case 'notebook':
      return <NotebookApp />;
    case 'resolve':
      return <CaseResolution />;
    default:
      return null;
  }
}

export function Desktop() {
  const { bootDone, windows, caseData } = useCase();

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Wallpaper */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(61,139,253,0.18), transparent 50%),
            radial-gradient(ellipse 60% 50% at 80% 70%, rgba(45,90,140,0.25), transparent 45%),
            linear-gradient(165deg, #152033 0%, #1a2a40 40%, #0f1826 100%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {!bootDone && <BootScreen />}

      {bootDone && (
        <>
          <div className="absolute right-6 top-5 text-right text-white/25">
            <div className="text-xs font-semibold uppercase tracking-[0.3em]">TRACE OS</div>
            <div className="mt-1 text-[11px]">{caseData.subject.name}</div>
          </div>
          <DesktopIcons />
          {windows.map((win) => (
            <WindowFrame key={win.id} win={win}>
              <AppContent appId={win.appId} />
            </WindowFrame>
          ))}
          <Taskbar />
          <DebugPanel />
        </>
      )}
    </div>
  );
}
