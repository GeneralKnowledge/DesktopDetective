import { useEffect, useState } from 'react';
import { useCase } from '@/investigation/CaseProvider';

export function BootScreen() {
  const { caseData, setBootDone } = useCase();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1400),
      setTimeout(() => setStep(3), 2200),
      setTimeout(() => setBootDone(true), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [setBootDone]);

  return (
    <div className="absolute inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0d1520] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a3050_0%,_#0d1520_70%)]" />
      <div className="relative z-10 w-full max-w-lg px-8 text-center">
        <div
          className={`mb-8 text-5xl font-bold tracking-[0.2em] text-white transition-all duration-700 ${
            step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          TRACE<span className="text-[var(--trace-accent)]"> OS</span>
        </div>

        <div
          className={`space-y-4 transition-all duration-700 ${
            step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-sm uppercase tracking-[0.25em] text-white/45">Forensic Access Granted</p>
          <p className="text-xl font-semibold text-white/95">
            {caseData.subject.name}&apos;s workstation
          </p>
          <div className="mx-auto mt-2 max-w-md rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-left backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--trace-accent)]">
              Case: {caseData.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">{caseData.premise}</p>
          </div>
        </div>

        <div
          className={`mt-10 transition-all duration-700 ${
            step >= 3 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="animate-boot-pulse text-xs tracking-wide text-white/40">
            Loading desktop environment…
          </p>
          <button
            type="button"
            onClick={() => setBootDone(true)}
            className="mt-4 text-xs text-white/50 underline-offset-2 hover:text-white/80 hover:underline"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
