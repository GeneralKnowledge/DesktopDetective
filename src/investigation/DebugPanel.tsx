import { useCase } from '@/investigation/CaseProvider';
import { formatDateTime } from '@/utils/case';
import clsx from 'clsx';

export function DebugPanel() {
  const {
    debugOpen,
    setDebugOpen,
    caseData,
    investigation,
    resetCase,
    revealAllEvidence,
  } = useCase();

  if (!debugOpen) return null;

  return (
    <div className="absolute bottom-14 right-3 z-[20000] flex max-h-[70vh] w-[420px] flex-col overflow-hidden rounded-xl border border-amber-500/40 bg-[#0f172a] text-xs text-slate-200 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-amber-500/20 px-3 py-2">
        <span className="font-bold uppercase tracking-wider text-amber-200">
          Debug · F1 to toggle
        </span>
        <button type="button" onClick={() => setDebugOpen(false)} className="text-slate-400 hover:text-white">
          Close
        </button>
      </div>
      <div className="flex gap-2 border-b border-white/10 p-2">
        <button
          type="button"
          onClick={resetCase}
          className="rounded bg-red-600/80 px-2 py-1 font-semibold text-white hover:bg-red-500"
        >
          Reset Case
        </button>
        <button
          type="button"
          onClick={revealAllEvidence}
          className="rounded bg-slate-600 px-2 py-1 font-semibold text-white hover:bg-slate-500"
        >
          Reveal All Evidence
        </button>
      </div>
      <div className="space-y-3 overflow-y-auto p-3">
        <section>
          <h4 className="mb-1 font-bold text-amber-300">Case Truth</h4>
          <pre className="whitespace-pre-wrap rounded bg-black/30 p-2 font-mono text-[11px] text-emerald-300">
            {JSON.stringify(caseData.truth, null, 2)}
          </pre>
        </section>
        <section>
          <h4 className="mb-1 font-bold text-amber-300">
            Investigation State ({investigation.discoveredEvidenceIds.length} discovered /{' '}
            {investigation.pinnedEvidence.length} pinned)
          </h4>
          <pre className="max-h-32 overflow-auto whitespace-pre-wrap rounded bg-black/30 p-2 font-mono text-[10px]">
            {JSON.stringify(
              {
                discovered: investigation.discoveredEvidenceIds,
                pinned: investigation.pinnedEvidence.map((p) => p.evidenceId),
                answers: investigation.resolutionAnswers,
                submitted: investigation.hasSubmitted,
                result: investigation.submissionResult?.feedbackTier,
              },
              null,
              2,
            )}
          </pre>
        </section>
        <section>
          <h4 className="mb-1 font-bold text-amber-300">
            Evidence ({caseData.evidence.length})
          </h4>
          <div className="space-y-1">
            {caseData.evidence.map((ev) => (
              <div
                key={ev.id}
                className={clsx(
                  'rounded border border-white/5 p-1.5',
                  ev.importance === 'critical' && 'bg-red-500/10',
                  ev.importance === 'supporting' && 'bg-sky-500/10',
                  ev.importance === 'red_herring' && 'bg-slate-500/10',
                )}
              >
                <div className="flex gap-2">
                  <span
                    className={clsx(
                      'rounded px-1 font-bold uppercase',
                      ev.importance === 'critical' && 'text-red-300',
                      ev.importance === 'supporting' && 'text-sky-300',
                      ev.importance === 'red_herring' && 'text-slate-400',
                    )}
                  >
                    {ev.importance}
                  </span>
                  <span className="text-slate-400">{ev.type}</span>
                  {ev.timestamp && (
                    <span className="ml-auto font-mono text-slate-500">
                      {formatDateTime(ev.timestamp)}
                    </span>
                  )}
                </div>
                <div className="font-medium">{ev.title}</div>
                <div className="text-slate-500">{ev.id}</div>
                {ev.relatedEvidence.length > 0 && (
                  <div className="text-slate-500">→ {ev.relatedEvidence.join(', ')}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
