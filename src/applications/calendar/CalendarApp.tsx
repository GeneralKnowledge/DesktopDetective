import { useMemo, useState } from 'react';
import { useCase } from '@/investigation/CaseProvider';
import { PinButton } from '@/components/PinButton';
import { useDiscover } from '@/hooks/useDiscover';
import { formatDateTime, formatTime } from '@/utils/case';
import clsx from 'clsx';

export function CalendarApp() {
  const { caseData } = useCase();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const events = useMemo(
    () => [...caseData.calendarEvents].sort((a, b) => a.start.localeCompare(b.start)),
    [caseData.calendarEvents],
  );

  const selected = events.find((e) => e.id === selectedId);

  const byDay = useMemo(() => {
    const map = new Map<string, typeof events>();
    for (const ev of events) {
      const day = ev.start.slice(0, 10);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(ev);
    }
    return [...map.entries()];
  }, [events]);

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Calendar</h2>
        <div className="space-y-5">
          {byDay.map(([day, dayEvents]) => (
            <div key={day}>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                {new Date(day + 'T12:00:00').toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </div>
              <div className="space-y-2">
                {dayEvents.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setSelectedId(ev.id)}
                    className={clsx(
                      'flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition',
                      selectedId === ev.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300',
                    )}
                  >
                    <div className="w-14 shrink-0 font-mono text-xs font-semibold text-blue-600">
                      {formatTime(ev.start)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{ev.title}</div>
                      {ev.location && (
                        <div className="text-[11px] text-slate-400">{ev.location}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <aside className="w-64 shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50 p-4">
        {selected ? (
          <EventDetail eventId={selected.id} />
        ) : (
          <p className="text-sm text-slate-400">Select an event</p>
        )}
      </aside>
    </div>
  );
}

function EventDetail({ eventId }: { eventId: string }) {
  const { caseData } = useCase();
  const event = caseData.calendarEvents.find((e) => e.id === eventId)!;
  useDiscover(event.evidenceId);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-800">{event.title}</h3>
        <PinButton evidenceId={event.evidenceId} />
      </div>
      <div className="text-sm text-slate-600">
        <div className="font-mono text-xs">{formatDateTime(event.start)}</div>
        <div className="font-mono text-xs text-slate-400">→ {formatDateTime(event.end)}</div>
      </div>
      {event.location && (
        <div>
          <div className="text-[11px] text-slate-400">Location</div>
          <div className="text-sm">{event.location}</div>
        </div>
      )}
      {event.description && (
        <div>
          <div className="text-[11px] text-slate-400">Details</div>
          <p className="text-sm leading-relaxed text-slate-700">{event.description}</p>
        </div>
      )}
      {event.attendees && (
        <div>
          <div className="text-[11px] text-slate-400">Attendees</div>
          <p className="text-sm">{event.attendees.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
