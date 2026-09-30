import { useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight, FileSpreadsheet, FileText, Folder, Image, File } from 'lucide-react';
import { useCase } from '@/investigation/CaseProvider';
import { PinButton } from '@/components/PinButton';
import { useDiscover } from '@/hooks/useDiscover';
import { formatDateTime } from '@/utils/case';
import type { FileItem } from '@/types';
import clsx from 'clsx';

function fileIcon(type: FileItem['type']) {
  if (type === 'folder') return Folder;
  if (type === 'spreadsheet') return FileSpreadsheet;
  if (type === 'text') return FileText;
  if (type === 'image') return Image;
  return File;
}

export function FilesApp() {
  const { caseData } = useCase();
  const [currentId, setCurrentId] = useState('folder-root');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const current = caseData.files.find((f) => f.id === currentId)!;
  const children = useMemo(
    () =>
      caseData.files
        .filter((f) => f.parentId === currentId)
        .sort((a, b) => {
          if (a.type === 'folder' && b.type !== 'folder') return -1;
          if (b.type === 'folder' && a.type !== 'folder') return 1;
          return a.name.localeCompare(b.name);
        }),
    [caseData.files, currentId],
  );

  const breadcrumbs = useMemo(() => {
    const trail: FileItem[] = [];
    let node: FileItem | undefined = current;
    while (node) {
      trail.unshift(node);
      node = caseData.files.find((f) => f.id === node!.parentId);
    }
    return trail;
  }, [caseData.files, current]);

  const selected = selectedId ? caseData.files.find((f) => f.id === selectedId) : null;

  if (selected && selected.type !== 'folder') {
    return <FileViewer file={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.id} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} className="text-slate-300" />}
            <button
              type="button"
              onClick={() => setCurrentId(crumb.id)}
              className={clsx(
                'rounded px-1.5 py-0.5 hover:bg-slate-200',
                i === breadcrumbs.length - 1 ? 'font-semibold text-slate-800' : 'text-slate-500',
              )}
            >
              {crumb.name}
            </button>
          </span>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-white text-xs uppercase text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Modified</th>
              <th className="px-3 py-2 font-medium">Size</th>
            </tr>
          </thead>
          <tbody>
            {children.map((file) => {
              const Icon = fileIcon(file.type);
              return (
                <tr
                  key={file.id}
                  className="cursor-pointer border-t border-slate-100 hover:bg-blue-50/70"
                  onDoubleClick={() => {
                    if (file.type === 'folder') setCurrentId(file.id);
                    else setSelectedId(file.id);
                  }}
                  onClick={() => {
                    if (file.type !== 'folder') setSelectedId(file.id);
                  }}
                >
                  <td className="flex items-center gap-2 px-3 py-2">
                    <Icon
                      size={16}
                      className={file.type === 'folder' ? 'text-amber-500' : 'text-slate-400'}
                    />
                    <span className="font-medium text-slate-700">{file.name}</span>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-500">
                    {formatDateTime(file.modifiedAt)}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-400">{file.size}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {children.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-400">Empty folder</p>
        )}
      </div>
      <div className="border-t border-slate-200 px-3 py-1.5 text-[11px] text-slate-400">
        Double-click folders to open · Click files to preview
      </div>
    </div>
  );
}

function FileViewer({ file, onBack }: { file: FileItem; onBack: () => void }) {
  useDiscover(file.evidenceId);

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
          <div className="truncate text-sm font-semibold">{file.name}</div>
          <div className="font-mono text-[11px] text-slate-400">{file.path}</div>
        </div>
        <PinButton evidenceId={file.evidenceId} />
      </div>
      <div className="grid grid-cols-3 gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-500">
        <div>
          <span className="text-slate-400">Created </span>
          {formatDateTime(file.createdAt)}
        </div>
        <div>
          <span className="text-slate-400">Modified </span>
          <span className="font-semibold text-slate-700">{formatDateTime(file.modifiedAt)}</span>
        </div>
        <div>
          <span className="text-slate-400">Size </span>
          {file.size}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-white p-5">
        {file.type === 'image' ? (
          <div className="flex h-48 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400">
            {file.content}
          </div>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-slate-700">
            {file.content ?? '(Empty file)'}
          </pre>
        )}
      </div>
    </div>
  );
}
