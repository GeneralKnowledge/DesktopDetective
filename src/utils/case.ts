import type { CaseDefinition, Evidence, SubmissionResult } from '@/types';

export function formatTime(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getEvidenceById(caseData: CaseDefinition, id: string): Evidence | undefined {
  return caseData.evidence.find((e) => e.id === id);
}

export function evaluateSubmission(
  caseData: CaseDefinition,
  answers: Record<string, string>,
  selectedEvidenceIds: string[],
): SubmissionResult {
  const questions = caseData.resolution.questions;
  const whatQ = questions.find((q) => q.truthKey === 'whatHappened');
  const whenQ = questions.find((q) => q.truthKey === 'when');
  const whyQ = questions.find((q) => q.truthKey === 'why');

  const whatCorrect = whatQ?.options.find((o) => o.id === answers['q-what'])?.correct ?? false;
  const whenCorrect = whenQ?.options.find((o) => o.id === answers['q-when'])?.correct ?? false;
  const whyCorrect = whyQ?.options.find((o) => o.id === answers['q-why'])?.correct ?? false;

  const critical = caseData.evidence.filter((e) => e.importance === 'critical');
  const selected = selectedEvidenceIds
    .map((id) => getEvidenceById(caseData, id))
    .filter((e): e is Evidence => !!e);

  const strongEvidenceUsed = selected
    .filter((e) => e.importance === 'critical' || e.importance === 'supporting')
    .map((e) => e.id);
  const weakEvidenceUsed = selected.filter((e) => e.importance === 'red_herring').map((e) => e.id);
  const missedCritical = critical
    .filter((e) => !selectedEvidenceIds.includes(e.id))
    .map((e) => e.id);

  const correctCount = [whatCorrect, whenCorrect, whyCorrect].filter(Boolean).length;

  let feedbackTier: SubmissionResult['feedbackTier'];
  if (correctCount === 3) feedbackTier = 'correct';
  else if (correctCount === 2) feedbackTier = 'mostly_supported';
  else if (correctCount === 1) feedbackTier = 'partially_supported';
  else feedbackTier = 'unsupported';

  const details: string[] = [];

  if (whatCorrect) details.push('Your reading of what happened aligns with the case facts.');
  else details.push('Your conclusion about what happened does not match the strongest evidence.');

  if (whenCorrect) details.push('Your timing estimate matches the deletion timestamp.');
  else details.push('Check file and recycle-bin timestamps again — the timing may be off.');

  if (whyCorrect) details.push('Your motive hypothesis is well supported by cross-application evidence.');
  else details.push('The motive may need another pass — look at pressure around the next morning.');

  if (strongEvidenceUsed.length >= 3) {
    details.push('You cited multiple relevant pieces of evidence.');
  } else if (selected.length === 0) {
    details.push('You did not cite supporting evidence — pin and select clues next time.');
  }

  if (weakEvidenceUsed.length > 0) {
    details.push('Some cited items look like distractions rather than core proof.');
  }

  if (missedCritical.length > 0 && correctCount < 3) {
    details.push('Not all critical trails appear to have been fully explored.');
  }

  const messages: Record<SubmissionResult['feedbackTier'], string> = {
    correct: 'Conclusion strongly supported',
    mostly_supported: 'Conclusion mostly supported',
    partially_supported: 'Conclusion only partially supported',
    unsupported: 'Conclusion not supported by the evidence',
  };

  return {
    whatCorrect,
    whenCorrect,
    whyCorrect,
    strongEvidenceUsed,
    weakEvidenceUsed,
    missedCritical,
    feedbackTier,
    message: messages[feedbackTier],
    details,
  };
}

export function globalSearch(caseData: CaseDefinition, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  type Hit = {
    id: string;
    source: string;
    title: string;
    snippet: string;
    timestamp?: string;
    evidenceId?: string;
    appId: string;
    openTarget?: string;
  };

  const hits: Hit[] = [];

  for (const email of caseData.emails) {
    const blob = `${email.subject} ${email.body} ${email.from} ${email.to.join(' ')}`.toLowerCase();
    if (blob.includes(q)) {
      hits.push({
        id: `search-email-${email.id}`,
        source: 'Mail',
        title: email.subject,
        snippet: email.body.slice(0, 120).replace(/\n/g, ' '),
        timestamp: email.timestamp,
        evidenceId: email.evidenceId,
        appId: 'mail',
        openTarget: email.id,
      });
    }
  }

  for (const file of caseData.files) {
    if (file.type === 'folder') continue;
    const blob = `${file.name} ${file.path} ${file.content ?? ''}`.toLowerCase();
    if (blob.includes(q)) {
      hits.push({
        id: `search-file-${file.id}`,
        source: 'Files',
        title: file.name,
        snippet: file.path,
        timestamp: file.modifiedAt,
        evidenceId: file.evidenceId,
        appId: 'files',
        openTarget: file.id,
      });
    }
  }

  for (const entry of caseData.browserHistory) {
    const blob = `${entry.title} ${entry.url}`.toLowerCase();
    if (blob.includes(q)) {
      hits.push({
        id: `search-browser-${entry.id}`,
        source: 'Browser',
        title: entry.title,
        snippet: entry.url,
        timestamp: entry.timestamp,
        evidenceId: entry.evidenceId,
        appId: 'browser',
        openTarget: entry.id,
      });
    }
  }

  for (const thread of caseData.chats) {
    for (const msg of thread.messages) {
      const blob = `${msg.text} ${msg.senderName} ${thread.contactName}`.toLowerCase();
      if (blob.includes(q)) {
        hits.push({
          id: `search-chat-${msg.id}`,
          source: 'Chat',
          title: `${thread.contactName}: ${msg.text.slice(0, 60)}`,
          snippet: msg.text,
          timestamp: msg.timestamp,
          evidenceId: msg.evidenceId,
          appId: 'chat',
          openTarget: thread.id,
        });
      }
    }
  }

  for (const note of caseData.notes) {
    const blob = `${note.title} ${note.body}`.toLowerCase();
    if (blob.includes(q)) {
      hits.push({
        id: `search-note-${note.id}`,
        source: 'Notes',
        title: note.title,
        snippet: note.body.slice(0, 120).replace(/\n/g, ' '),
        timestamp: note.modifiedAt,
        evidenceId: note.evidenceId,
        appId: 'notes',
        openTarget: note.id,
      });
    }
  }

  for (const event of caseData.calendarEvents) {
    const blob = `${event.title} ${event.description ?? ''} ${event.location ?? ''}`.toLowerCase();
    if (blob.includes(q)) {
      hits.push({
        id: `search-cal-${event.id}`,
        source: 'Calendar',
        title: event.title,
        snippet: event.description ?? event.location ?? '',
        timestamp: event.start,
        evidenceId: event.evidenceId,
        appId: 'calendar',
        openTarget: event.id,
      });
    }
  }

  for (const item of caseData.recycleBin) {
    const blob = `${item.name} ${item.originalPath} ${item.content ?? ''}`.toLowerCase();
    if (blob.includes(q)) {
      hits.push({
        id: `search-recycle-${item.id}`,
        source: 'Recycle Bin',
        title: item.name,
        snippet: `Deleted from ${item.originalPath}`,
        timestamp: item.deletedAt,
        evidenceId: item.evidenceId,
        appId: 'recycle',
        openTarget: item.id,
      });
    }
  }

  return hits.sort((a, b) => (b.timestamp ?? '').localeCompare(a.timestamp ?? ''));
}
