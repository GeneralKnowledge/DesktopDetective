import { Pin, PinOff } from 'lucide-react';
import { useCase } from '@/investigation/CaseProvider';
import clsx from 'clsx';

export function PinButton({
  evidenceId,
  className,
}: {
  evidenceId?: string;
  className?: string;
}) {
  const { pinEvidence, unpinEvidence, isPinned, discoverEvidence } = useCase();
  if (!evidenceId) return null;

  const pinned = isPinned(evidenceId);

  return (
    <button
      type="button"
      title={pinned ? 'Unpin from investigation board' : 'Pin to investigation board'}
      onClick={(e) => {
        e.stopPropagation();
        discoverEvidence(evidenceId);
        if (pinned) unpinEvidence(evidenceId);
        else pinEvidence(evidenceId);
      }}
      className={clsx(
        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition',
        pinned
          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
        className,
      )}
    >
      {pinned ? <PinOff size={12} /> : <Pin size={12} />}
      {pinned ? 'Pinned' : 'Pin'}
    </button>
  );
}
