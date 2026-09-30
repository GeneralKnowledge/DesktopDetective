import { useMemo, useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useCase } from '@/investigation/CaseProvider';
import { PinButton } from '@/components/PinButton';
import { useDiscover } from '@/hooks/useDiscover';
import { formatDateTime } from '@/utils/case';
import clsx from 'clsx';
import type { Email } from '@/types';

export function MailApp() {
  const { caseData } = useCase();
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'drafts'>('inbox');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const emails = useMemo(() => {
    return caseData.emails
      .filter((e) => e.folder === folder)
      .filter((e) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          e.subject.toLowerCase().includes(q) ||
          e.body.toLowerCase().includes(q) ||
          e.from.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [caseData.emails, folder, query]);

  const selected = caseData.emails.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="flex h-full">
      <aside className="flex w-40 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
        <div className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Mail
        </div>
        {(['inbox', 'sent', 'drafts'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              setFolder(f);
              setSelectedId(null);
            }}
            className={clsx(
              'mx-2 mb-1 rounded-lg px-3 py-2 text-left text-sm capitalize transition',
              folder === f ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200',
            )}
          >
            {f}
            <span className="ml-1 opacity-70">
              ({caseData.emails.filter((e) => e.folder === f).length})
            </span>
          </button>
        ))}
      </aside>

      {!selected ? (
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2">
            <Search size={14} className="text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mail…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {emails.map((email) => (
              <button
                key={email.id}
                type="button"
                onClick={() => setSelectedId(email.id)}
                className="flex w-full flex-col gap-0.5 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-blue-50/60"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-slate-800">
                    {folder === 'sent' || folder === 'drafts'
                      ? `To: ${email.to.join(', ')}`
                      : email.from.split('@')[0]}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-slate-400">
                    {formatDateTime(email.timestamp)}
                  </span>
                </div>
                <span className="truncate text-sm text-slate-700">{email.subject}</span>
                <span className="truncate text-xs text-slate-400">
                  {email.body.replace(/\n/g, ' ').slice(0, 90)}
                </span>
              </button>
            ))}
            {emails.length === 0 && (
              <p className="p-6 text-center text-sm text-slate-400">No messages</p>
            )}
          </div>
        </div>
      ) : (
        <EmailDetail email={selected} onBack={() => setSelectedId(null)} />
      )}
    </div>
  );
}

function EmailDetail({ email, onBack }: { email: Email; onBack: () => void }) {
  useDiscover(email.evidenceId);

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="min-w-0 flex-1 truncate text-sm font-semibold">{email.subject}</div>
        <PinButton evidenceId={email.evidenceId} />
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="mb-4 space-y-1 text-sm">
          <div>
            <span className="text-slate-400">From: </span>
            <span className="font-medium">{email.from}</span>
          </div>
          <div>
            <span className="text-slate-400">To: </span>
            {email.to.join(', ')}
          </div>
          {email.cc && (
            <div>
              <span className="text-slate-400">Cc: </span>
              {email.cc.join(', ')}
            </div>
          )}
          <div className="font-mono text-xs text-slate-400">{formatDateTime(email.timestamp)}</div>
          {email.folder === 'drafts' && (
            <div className="inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              Draft — not sent
            </div>
          )}
        </div>
        <pre className="whitespace-pre-wrap font-[inherit] text-sm leading-relaxed text-slate-700">
          {email.body}
        </pre>
      </div>
    </div>
  );
}
