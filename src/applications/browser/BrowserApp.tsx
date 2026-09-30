import { useMemo, useState } from 'react';
import { useCase } from '@/investigation/CaseProvider';
import { PinButton } from '@/components/PinButton';
import { useDiscover } from '@/hooks/useDiscover';
import { formatDateTime } from '@/utils/case';
import clsx from 'clsx';
import type { BrowserEntry } from '@/types';

export function BrowserApp() {
  const { caseData } = useCase();
  const [tab, setTab] = useState<'history' | 'search' | 'bookmarks'>('history');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const entries = useMemo(() => {
    let list = caseData.browserHistory;
    if (tab === 'history') list = list.filter((e) => e.type === 'history' || e.type === 'search');
    if (tab === 'search') list = list.filter((e) => e.type === 'search');
    if (tab === 'bookmarks') list = list.filter((e) => e.type === 'bookmark');
    return [...list].sort((a, b) => (b.timestamp ?? '').localeCompare(a.timestamp ?? ''));
  }, [caseData.browserHistory, tab]);

  const selected = entries.find((e) => e.id === selectedId) ?? caseData.browserHistory.find((e) => e.id === selectedId);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-100 px-2 py-2">
        <div className="flex flex-1 items-center rounded-full bg-white px-3 py-1.5 text-xs text-slate-400 ring-1 ring-slate-200">
          trace://history
        </div>
      </div>
      <div className="flex gap-1 border-b border-slate-200 px-2 py-1.5">
        {(['history', 'search', 'bookmarks'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t);
              setSelectedId(null);
            }}
            className={clsx(
              'rounded-md px-3 py-1.5 text-xs font-medium capitalize',
              tab === t ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100',
            )}
          >
            {t === 'search' ? 'Search history' : t}
          </button>
        ))}
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="w-1/2 overflow-y-auto border-r border-slate-200">
          {entries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setSelectedId(entry.id)}
              className={clsx(
                'flex w-full flex-col gap-0.5 border-b border-slate-100 px-3 py-2.5 text-left hover:bg-slate-50',
                selectedId === entry.id && 'bg-blue-50',
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-medium text-slate-800">{entry.title}</span>
                {entry.timestamp && (
                  <span className="shrink-0 font-mono text-[10px] text-slate-400">
                    {formatDateTime(entry.timestamp)}
                  </span>
                )}
              </div>
              <span className="truncate text-[11px] text-slate-400">{entry.url}</span>
              {entry.type === 'search' && (
                <span className="w-fit rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-700">
                  Search
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="w-1/2 overflow-y-auto p-4">
          {selected ? (
            <BrowserDetail entry={selected} />
          ) : (
            <p className="text-sm text-slate-400">Select an entry to inspect</p>
          )}
        </div>
      </div>
    </div>
  );
}

function BrowserDetail({ entry }: { entry: BrowserEntry }) {
  useDiscover(entry.evidenceId);
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-800">{entry.title}</h3>
        <PinButton evidenceId={entry.evidenceId} />
      </div>
      <div className="rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-600 break-all">
        {entry.url}
      </div>
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-xs text-slate-400">Type</dt>
          <dd className="capitalize">{entry.type}</dd>
        </div>
        {entry.timestamp && (
          <div>
            <dt className="text-xs text-slate-400">Timestamp</dt>
            <dd className="font-mono">{formatDateTime(entry.timestamp)}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
