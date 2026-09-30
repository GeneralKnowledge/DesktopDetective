import { useEffect, useRef } from 'react';
import { useCase } from '@/investigation/CaseProvider';
import clsx from 'clsx';

export function CaseResolution() {
  const {
    caseData,
    investigation,
    setResolutionAnswer,
    toggleSupportEvidence,
    submitInvestigation,
    openApp,
  } = useCase();
  const resultRef = useRef<HTMLDivElement>(null);

  const pinnedEvidence = investigation.pinnedEvidence
    .map((p) => caseData.evidence.find((e) => e.id === p.evidenceId))
    .filter(Boolean);

  const discoveredEvidence = caseData.evidence.filter((e) =>
    investigation.discoveredEvidenceIds.includes(e.id),
  );

  const selectable = pinnedEvidence.length > 0 ? pinnedEvidence : discoveredEvidence;

  const canSubmit =
    investigation.resolutionAnswers['q-what'] &&
    investigation.resolutionAnswers['q-when'] &&
    investigation.resolutionAnswers['q-why'];

  const result = investigation.submissionResult;

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result]);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-200 bg-slate-900 px-4 py-3 text-white">
        <h2 className="text-sm font-bold uppercase tracking-wider">Submit Investigation</h2>
        <p className="mt-1 text-xs text-slate-300">
          Construct your conclusion. You can revise and resubmit.
        </p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        {caseData.resolution.questions.map((q) => (
          <fieldset key={q.id}>
            <legend className="mb-2 text-sm font-semibold text-slate-800">{q.prompt}</legend>
            <div className="space-y-1.5">
              {q.options.map((opt) => (
                <label
                  key={opt.id}
                  className={clsx(
                    'flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm transition',
                    investigation.resolutionAnswers[q.id] === opt.id
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-slate-200 hover:bg-slate-50',
                  )}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={investigation.resolutionAnswers[q.id] === opt.id}
                    onChange={() => setResolutionAnswer(q.id, opt.id)}
                    className="mt-0.5"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-800">
            Which evidence supports your conclusion?
          </h3>
          <p className="mb-2 text-xs text-slate-400">
            Optional but recommended — cite the clues that convinced you.
            {pinnedEvidence.length === 0 &&
              ' Pin items on the board for a cleaner list; showing discovered items for now.'}
          </p>
          {selectable.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-400">
              Explore the desktop and pin clues first.{' '}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => openApp('board')}
              >
                Open board
              </button>
            </p>
          ) : (
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
              {selectable.map(
                (ev) =>
                  ev && (
                    <label
                      key={ev.id}
                      className="flex cursor-pointer items-start gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={investigation.selectedSupportEvidence.includes(ev.id)}
                        onChange={() => toggleSupportEvidence(ev.id)}
                        className="mt-0.5"
                      />
                      <span>
                        <span className="mr-1 text-[10px] font-bold uppercase text-slate-400">
                          {ev.type}
                        </span>
                        {ev.title}
                      </span>
                    </label>
                  ),
              )}
            </div>
          )}
        </div>

        {result && (
          <div
            ref={resultRef}
            className={clsx(
              'rounded-xl border p-4 shadow-sm',
              result.feedbackTier === 'correct' && 'border-emerald-300 bg-emerald-50',
              result.feedbackTier === 'mostly_supported' && 'border-sky-300 bg-sky-50',
              result.feedbackTier === 'partially_supported' && 'border-amber-300 bg-amber-50',
              result.feedbackTier === 'unsupported' && 'border-red-300 bg-red-50',
            )}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Assessment
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-800">{result.message}</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold">
              <span
                className={clsx(
                  'rounded-full px-2 py-0.5',
                  result.whatCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900',
                )}
              >
                What: {result.whatCorrect ? 'supported' : 'not supported'}
              </span>
              <span
                className={clsx(
                  'rounded-full px-2 py-0.5',
                  result.whenCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900',
                )}
              >
                When: {result.whenCorrect ? 'supported' : 'not supported'}
              </span>
              <span
                className={clsx(
                  'rounded-full px-2 py-0.5',
                  result.whyCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900',
                )}
              >
                Why: {result.whyCorrect ? 'supported' : 'not supported'}
              </span>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
              {result.details.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="text-slate-400">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              The sealed case file stays closed so you can keep investigating and resubmit.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => submitInvestigation()}
          className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white shadow transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {investigation.hasSubmitted ? 'Resubmit Investigation' : 'Submit Investigation'}
        </button>
      </div>
    </div>
  );
}
