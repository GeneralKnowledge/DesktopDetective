import { useState } from 'react';
import { useCase } from '@/investigation/CaseProvider';
import { formatDateTime } from '@/utils/case';

export function NotebookApp() {
  const { investigation, addNotebookEntry, updateNotebookEntry, deleteNotebookEntry } = useCase();
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  return (
    <div className="flex h-full flex-col bg-[#faf6eb]">
      <div className="border-b border-amber-900/10 px-4 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900/60">
          Detective Notebook
        </h2>
        <p className="text-xs text-slate-500">Free-form notes. Write what you notice.</p>
      </div>
      <div className="border-b border-amber-900/10 p-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. Report deleted at 22:21 but Daniel claimed submission at 22:28…"
          rows={3}
          className="w-full resize-none rounded-lg border border-amber-900/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300"
        />
        <button
          type="button"
          disabled={!draft.trim()}
          onClick={() => {
            addNotebookEntry(draft.trim());
            setDraft('');
          }}
          className="mt-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
        >
          Add note
        </button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {investigation.notebookEntries.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">No notes yet</p>
        )}
        {investigation.notebookEntries.map((entry) => (
          <div key={entry.id} className="rounded-lg border border-amber-900/10 bg-white p-3 shadow-sm">
            {editingId === entry.id ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded border border-slate-200 p-2 text-sm outline-none"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    className="rounded bg-slate-800 px-2 py-1 text-xs text-white"
                    onClick={() => {
                      updateNotebookEntry(entry.id, editText);
                      setEditingId(null);
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="rounded px-2 py-1 text-xs text-slate-500"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {entry.text}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">
                    {formatDateTime(entry.updatedAt)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-[11px] text-slate-500 hover:underline"
                      onClick={() => {
                        setEditingId(entry.id);
                        setEditText(entry.text);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-[11px] text-red-500 hover:underline"
                      onClick={() => deleteNotebookEntry(entry.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
