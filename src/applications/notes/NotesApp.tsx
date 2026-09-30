import { useState } from 'react';
import { useCase } from '@/investigation/CaseProvider';
import { PinButton } from '@/components/PinButton';
import { useDiscover } from '@/hooks/useDiscover';
import { formatDateTime } from '@/utils/case';
import clsx from 'clsx';

export function NotesApp() {
  const { caseData } = useCase();
  const [selectedId, setSelectedId] = useState(caseData.notes[0]?.id ?? '');
  const note = caseData.notes.find((n) => n.id === selectedId);

  return (
    <div className="flex h-full">
      <aside className="w-48 shrink-0 overflow-y-auto border-r border-slate-200 bg-[#f7f3e8]">
        <div className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-amber-800/50">
          Notes
        </div>
        {caseData.notes.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setSelectedId(n.id)}
            className={clsx(
              'w-full border-b border-amber-900/5 px-3 py-3 text-left',
              selectedId === n.id ? 'bg-white' : 'hover:bg-amber-100/50',
            )}
          >
            <div className="truncate text-sm font-semibold text-slate-800">{n.title}</div>
            <div className="truncate text-[11px] text-slate-400">
              {n.body.replace(/\n/g, ' ').slice(0, 40)}
            </div>
          </button>
        ))}
      </aside>
      {note ? <NoteDetail noteId={note.id} /> : null}
    </div>
  );
}

function NoteDetail({ noteId }: { noteId: string }) {
  const { caseData } = useCase();
  const note = caseData.notes.find((n) => n.id === noteId)!;
  useDiscover(note.evidenceId);

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#fffdf7]">
      <div className="flex items-center justify-between border-b border-amber-900/10 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{note.title}</h2>
          <p className="font-mono text-[11px] text-slate-400">
            Modified {formatDateTime(note.modifiedAt)}
          </p>
        </div>
        <PinButton evidenceId={note.evidenceId} />
      </div>
      <pre className="flex-1 overflow-y-auto whitespace-pre-wrap p-5 font-[inherit] text-sm leading-relaxed text-slate-700">
        {note.body}
      </pre>
    </div>
  );
}
