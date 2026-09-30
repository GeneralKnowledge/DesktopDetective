import { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useCase } from '@/investigation/CaseProvider';
import { PinButton } from '@/components/PinButton';
import { useDiscover } from '@/hooks/useDiscover';
import { formatDateTime } from '@/utils/case';
import type { RecycleItem } from '@/types';

export function RecycleBinApp() {
  const { caseData } = useCase();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = caseData.recycleBin.find((i) => i.id === selectedId);

  if (selected) {
    return <RecycleDetail item={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <Trash2 size={16} className="text-slate-400" />
        <span className="text-sm font-semibold text-slate-700">Recycle Bin</span>
        <span className="text-xs text-slate-400">{caseData.recycleBin.length} items</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Original location</th>
              <th className="px-4 py-2 font-medium">Deleted</th>
              <th className="px-4 py-2 font-medium">Size</th>
            </tr>
          </thead>
          <tbody>
            {[...caseData.recycleBin]
              .sort((a, b) => b.deletedAt.localeCompare(a.deletedAt))
              .map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer border-t border-slate-100 hover:bg-red-50/50"
                  onClick={() => setSelectedId(item.id)}
                >
                  <td className="px-4 py-2.5 font-medium text-slate-700">{item.name}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-400">
                    {item.originalPath}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500">
                    {formatDateTime(item.deletedAt)}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-400">{item.size}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecycleDetail({ item, onBack }: { item: RecycleItem; onBack: () => void }) {
  useDiscover(item.evidenceId);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{item.name}</div>
          <div className="font-mono text-[11px] text-slate-400">{item.originalPath}</div>
        </div>
        <PinButton evidenceId={item.evidenceId} />
      </div>
      <div className="grid grid-cols-2 gap-2 border-b border-slate-100 bg-red-50/40 px-4 py-2 text-[11px]">
        <div>
          <span className="text-slate-400">Deleted </span>
          <span className="font-semibold text-red-700">{formatDateTime(item.deletedAt)}</span>
        </div>
        <div>
          <span className="text-slate-400">Size </span>
          {item.size}
        </div>
      </div>
      <pre className="flex-1 overflow-y-auto whitespace-pre-wrap bg-white p-5 font-mono text-[13px] leading-relaxed text-slate-700">
        {item.content ?? '(No preview available)'}
      </pre>
    </div>
  );
}
