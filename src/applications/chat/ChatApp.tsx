import { useState } from 'react';
import { useCase } from '@/investigation/CaseProvider';
import { PinButton } from '@/components/PinButton';
import { useDiscover } from '@/hooks/useDiscover';
import { formatDateTime, formatTime } from '@/utils/case';
import clsx from 'clsx';

export function ChatApp() {
  const { caseData } = useCase();
  const [threadId, setThreadId] = useState(caseData.chats[0]?.id ?? '');
  const thread = caseData.chats.find((c) => c.id === threadId);

  return (
    <div className="flex h-full">
      <aside className="w-48 shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50">
        <div className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Messages
        </div>
        {caseData.chats.map((chat) => {
          const last = chat.messages[chat.messages.length - 1];
          return (
            <button
              key={chat.id}
              type="button"
              onClick={() => setThreadId(chat.id)}
              className={clsx(
                'flex w-full flex-col gap-0.5 border-b border-slate-100 px-3 py-3 text-left transition',
                threadId === chat.id ? 'bg-white shadow-sm' : 'hover:bg-slate-100',
              )}
            >
              <span className="text-sm font-semibold text-slate-800">{chat.contactName}</span>
              <span className="truncate text-[11px] text-slate-400">{last?.text}</span>
            </button>
          );
        })}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col bg-[#eef2f7]">
        {thread ? (
          <>
            <div className="border-b border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold">
              {thread.contactName}
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {thread.messages.map((msg) => (
                <ChatBubble key={msg.id} msg={msg} isSelf={msg.senderId === 'daniel'} />
              ))}
            </div>
          </>
        ) : (
          <p className="p-6 text-sm text-slate-400">Select a conversation</p>
        )}
      </div>
    </div>
  );
}

function ChatBubble({
  msg,
  isSelf,
}: {
  msg: { id: string; senderName: string; text: string; timestamp: string; evidenceId?: string };
  isSelf: boolean;
}) {
  useDiscover(msg.evidenceId);
  return (
    <div className={clsx('flex flex-col gap-1', isSelf ? 'items-end' : 'items-start')}>
      <div
        className={clsx(
          'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm',
          isSelf ? 'bg-blue-600 text-white' : 'bg-white text-slate-800',
        )}
      >
        {msg.text}
      </div>
      <div className="flex items-center gap-2 px-1">
        <span className="font-mono text-[10px] text-slate-400" title={formatDateTime(msg.timestamp)}>
          {formatTime(msg.timestamp)}
        </span>
        {msg.evidenceId && <PinButton evidenceId={msg.evidenceId} />}
      </div>
    </div>
  );
}
