import {
  Mail,
  FolderOpen,
  Globe,
  MessageSquare,
  Calendar,
  StickyNote,
  Trash2,
  Search,
  ClipboardList,
  BookOpen,
  Send,
} from 'lucide-react';
import type { AppId } from '@/types';
import { useCase } from '@/investigation/CaseProvider';
import clsx from 'clsx';

const ICONS: { id: AppId; label: string; icon: typeof Mail; desktop?: boolean }[] = [
  { id: 'mail', label: 'Mail', icon: Mail, desktop: true },
  { id: 'files', label: 'Files', icon: FolderOpen, desktop: true },
  { id: 'browser', label: 'Browser', icon: Globe, desktop: true },
  { id: 'chat', label: 'Messages', icon: MessageSquare, desktop: true },
  { id: 'calendar', label: 'Calendar', icon: Calendar, desktop: true },
  { id: 'notes', label: 'Notes', icon: StickyNote, desktop: true },
  { id: 'recycle', label: 'Recycle Bin', icon: Trash2, desktop: true },
  { id: 'search', label: 'Search', icon: Search, desktop: true },
  { id: 'board', label: 'Case Board', icon: ClipboardList, desktop: true },
  { id: 'notebook', label: 'Notebook', icon: BookOpen, desktop: true },
  { id: 'resolve', label: 'Submit Case', icon: Send, desktop: true },
];

export function DesktopIcons() {
  const { openApp } = useCase();

  return (
    <div className="absolute left-4 top-4 flex max-h-[calc(100%-64px)] flex-col flex-wrap gap-3">
      {ICONS.filter((i) => i.desktop).map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onDoubleClick={() => openApp(item.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') openApp(item.id);
            }}
            className="group flex w-[76px] flex-col items-center gap-1.5 rounded-lg p-2 text-center text-white/90 transition hover:bg-white/10 focus:bg-white/15 focus:outline-none"
            title={`Open ${item.label}`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/12 shadow-lg backdrop-blur-sm ring-1 ring-white/20 transition group-hover:bg-white/20">
              <Icon size={22} strokeWidth={1.75} />
            </div>
            <span className="text-[11px] font-medium leading-tight drop-shadow-md">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Taskbar() {
  const { windows, openApp, focusWindow, clock, activeWindowId } = useCase();

  const time = clock.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const date = clock.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[9999] flex h-12 items-center gap-2 border-t border-white/10 bg-[#121a27]/95 px-3 backdrop-blur-md">
      <button
        type="button"
        className="mr-1 flex h-8 items-center gap-2 rounded-lg bg-[var(--trace-accent)] px-3 text-xs font-bold tracking-wide text-white shadow"
        onClick={() => openApp('search')}
        title="Search (Ctrl+K)"
      >
        TRACE
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
        {ICONS.slice(0, 8).map((item) => {
          const Icon = item.icon;
          const open = windows.some((w) => w.appId === item.id);
          const focused = windows.some((w) => w.appId === item.id && w.id === activeWindowId && !w.minimized);
          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              onClick={() => {
                const win = windows.find((w) => w.appId === item.id);
                if (win) focusWindow(win.id);
                else openApp(item.id);
              }}
              className={clsx(
                'relative flex h-9 w-9 items-center justify-center rounded-lg transition',
                focused ? 'bg-white/20 text-white' : open ? 'bg-white/10 text-white/90' : 'text-white/60 hover:bg-white/10 hover:text-white',
              )}
            >
              <Icon size={18} />
              {open && (
                <span className="absolute bottom-0.5 h-0.5 w-3 rounded-full bg-[var(--trace-accent)]" />
              )}
            </button>
          );
        })}
        <div className="mx-1 h-6 w-px bg-white/15" />
        {ICONS.slice(8).map((item) => {
          const Icon = item.icon;
          const open = windows.some((w) => w.appId === item.id);
          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              onClick={() => {
                const win = windows.find((w) => w.appId === item.id);
                if (win) focusWindow(win.id);
                else openApp(item.id);
              }}
              className={clsx(
                'flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs transition',
                open ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
                item.id === 'resolve' && 'bg-emerald-600/80 text-white hover:bg-emerald-500',
              )}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="ml-auto flex flex-col items-end px-2 text-right leading-tight text-white/90">
        <span className="font-mono text-sm font-medium">{time}</span>
        <span className="text-[10px] text-white/55">{date}</span>
      </div>
    </div>
  );
}
