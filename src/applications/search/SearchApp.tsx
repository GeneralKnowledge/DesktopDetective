import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useCase } from '@/investigation/CaseProvider';
import { PinButton } from '@/components/PinButton';
import { globalSearch, formatDateTime } from '@/utils/case';
import type { AppId } from '@/types';

export function SearchApp() {
  const { caseData, openApp, discoverEvidence } = useCase();
  const [query, setQuery] = useState('');

  const hits = useMemo(() => globalSearch(caseData, query), [caseData, query]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-blue-400">
          <Search size={18} className="text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files, mail, chats, browser, notes…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Tip: try “report”, “Helix”, “deleted”, or “review”
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {!query.trim() && (
          <div className="p-8 text-center text-sm text-slate-400">
            Start typing to search across the workstation
          </div>
        )}
        {query.trim() && hits.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-400">No results for “{query}”</div>
        )}
        {hits.map((hit) => (
          <div
            key={hit.id}
            className="flex items-start gap-3 border-b border-slate-100 px-4 py-3 hover:bg-slate-50"
          >
            <button
              type="button"
              className="min-w-0 flex-1 text-left"
              onClick={() => {
                if (hit.evidenceId) discoverEvidence(hit.evidenceId);
                openApp(hit.appId as AppId);
              }}
            >
              <div className="flex items-baseline gap-2">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {hit.source}
                </span>
                {hit.timestamp && (
                  <span className="font-mono text-[10px] text-slate-400">
                    {formatDateTime(hit.timestamp)}
                  </span>
                )}
              </div>
              <div className="mt-1 truncate text-sm font-semibold text-slate-800">{hit.title}</div>
              <div className="truncate text-xs text-slate-400">{hit.snippet}</div>
            </button>
            <PinButton evidenceId={hit.evidenceId} />
          </div>
        ))}
      </div>
    </div>
  );
}
