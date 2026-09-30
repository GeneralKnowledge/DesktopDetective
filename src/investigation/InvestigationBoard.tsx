import { Pin, Trash2 } from 'lucide-react';
import { useCase } from '@/investigation/CaseProvider';
import { formatDateTime } from '@/utils/case';

export function InvestigationBoard() {
  const { caseData, investigation, unpinEvidence, openApp } = useCase();

  const pinned = investigation.pinnedEvidence
    .map((p) => {
      const ev = caseData.evidence.find((e) => e.id === p.evidenceId);
      return ev ? { ...p, evidence: ev } : null;
    })
    .filter(Boolean);

  return (
    <div className="flex h-full flex-col bg-[#1e293b] text-slate-100">
      <div className="border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Investigation Board
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Pin evidence from apps as you investigate. Connections are yours to make.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {pinned.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-400">
            <Pin size={28} className="opacity-40" />
            <p className="max-w-xs text-sm">
              Nothing pinned yet. Open Mail, Files, Browser, Chat, and other apps — use{' '}
              <span className="text-amber-300">Pin</span> on anything suspicious.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {pinned.map((item) =>
              item ? (
                <div
                  key={item.evidenceId}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 shadow"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-200">
                      {item.evidence.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => unpinEvidence(item.evidenceId)}
                      className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-red-300"
                      title="Unpin"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h3 className="text-sm font-semibold leading-snug">{item.evidence.title}</h3>
                  {item.evidence.timestamp && (
                    <p className="mt-1 font-mono text-[11px] text-slate-400">
                      {formatDateTime(item.evidence.timestamp)}
                    </p>
                  )}
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {item.evidence.content}
                  </p>
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
      <div className="border-t border-white/10 px-4 py-2 text-[11px] text-slate-500">
        {pinned.length} pinned ·{' '}
        <button
          type="button"
          className="text-emerald-400 hover:underline"
          onClick={() => openApp('resolve')}
        >
          Ready to submit?
        </button>
      </div>
    </div>
  );
}
