import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Minus, Square, X } from 'lucide-react';
import type { WindowState } from '@/types';
import { useCase } from '@/investigation/CaseProvider';
import clsx from 'clsx';

interface Props {
  win: WindowState;
  children: ReactNode;
}

export function WindowFrame({ win, children }: Props) {
  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    moveWindow,
    resizeWindow,
  } = useCase();
  const active = activeWindowId === win.id;
  const dragRef = useRef<{ ox: number; oy: number; sx: number; sy: number } | null>(null);
  const resizeRef = useRef<{ ox: number; oy: number; sw: number; sh: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const { ox, oy, sx, sy } = dragRef.current;
        moveWindow(win.id, Math.max(0, sx + e.clientX - ox), Math.max(0, sy + e.clientY - oy));
      }
      if (resizeRef.current) {
        const { ox, oy, sw, sh } = resizeRef.current;
        resizeWindow(win.id, sw + e.clientX - ox, sh + e.clientY - oy);
      }
    };
    const onUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
      setDragging(false);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [moveWindow, resizeWindow, win.id]);

  if (win.minimized) return null;

  const style = win.maximized
    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 48px)', zIndex: win.zIndex }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <div
      className={clsx(
        'absolute flex flex-col overflow-hidden rounded-xl bg-[var(--trace-window)] text-[var(--trace-window-text)] shadow-2xl transition-[box-shadow]',
        active ? 'ring-2 ring-[var(--trace-accent)]/40' : 'ring-1 ring-black/10',
        dragging && 'select-none',
      )}
      style={style as React.CSSProperties}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div
        className="flex h-10 shrink-0 cursor-grab items-center justify-between bg-gradient-to-b from-slate-100 to-slate-200/90 px-3 active:cursor-grabbing"
        onMouseDown={(e) => {
          if (win.maximized) return;
          if ((e.target as HTMLElement).closest('button')) return;
          dragRef.current = { ox: e.clientX, oy: e.clientY, sx: win.x, sy: win.y };
          setDragging(true);
          focusWindow(win.id);
        }}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <div className="truncate text-sm font-semibold tracking-tight text-slate-700">
          {win.title}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-300/60"
            onClick={() => minimizeWindow(win.id)}
            title="Minimize"
          >
            <Minus size={14} />
          </button>
          <button
            type="button"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-300/60"
            onClick={() => toggleMaximize(win.id)}
            title="Maximize"
          >
            <Square size={12} />
          </button>
          <button
            type="button"
            className="rounded-md p-1.5 text-slate-500 hover:bg-red-100 hover:text-red-600"
            onClick={() => closeWindow(win.id)}
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      {!win.maximized && (
        <div
          className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            resizeRef.current = {
              ox: e.clientX,
              oy: e.clientY,
              sw: win.width,
              sh: win.height,
            };
          }}
        />
      )}
    </div>
  );
}
