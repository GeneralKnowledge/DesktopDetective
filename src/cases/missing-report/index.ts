import type { CaseDefinition } from '@/types';

/**
 * THE MISSING REPORT
 *
 * Truth (hidden from player):
 * Daniel Mercer deliberately deleted the Helix Q3 report at ~22:21
 * after James Whitfield sent corrected figures showing revenue was DOWN 12%,
 * not UP 8% as Daniel had prepared. With a performance review the next morning
 * and pressure from Sarah Chen to show strong numbers, Daniel deleted the report,
 * searched how to obscure file timestamps, then lied that it had been submitted.
 *
 * Critical evidence requires cross-referencing:
 * Mail, Chat, Browser, Files/Recycle, Calendar, Notes
 */

const caseDate = '2025-09-30';

export const missingReportCase: CaseDefinition = {
  id: 'missing-report',
  title: 'The Missing Report',
  incidentDate: caseDate,
  subject: {
    id: 'daniel',
    name: 'Daniel Mercer',
    role: 'Senior Financial Analyst',
    email: 'daniel.mercer@meridian-analytics.com',
    relationship: 'Subject',
  },
  premise:
    'A critical client report disappeared from Daniel Mercer\'s workstation shortly before the submission deadline. Daniel claims he completed and submitted it around 22:30.',
  briefing:
    'You have been granted temporary forensic access to Daniel Mercer\'s workstation at Meridian Analytics. Reconstruct what happened to the Helix Corp Q3 report.',
  truth: {
    whatHappened: 'deliberately_deleted',
    when: '22:21',
    why: 'hide_bad_numbers_before_review',
    summary:
      'Daniel deliberately deleted the Helix Q3 report at 22:21 after receiving corrected figures from James showing revenue was down 12%. Facing a performance review the next morning and pressure to deliver strong numbers, he covered his tracks and lied that the report had been submitted.',
  },
  people: [
    {
      id: 'daniel',
      name: 'Daniel Mercer',
      role: 'Senior Financial Analyst',
      email: 'daniel.mercer@meridian-analytics.com',
      relationship: 'Subject',
    },
    {
      id: 'sarah',
      name: 'Sarah Chen',
      role: 'Director of Analytics',
      email: 'sarah.chen@meridian-analytics.com',
      relationship: 'Manager',
    },
    {
      id: 'james',
      name: 'James Whitfield',
      role: 'Financial Analyst',
      email: 'james.whitfield@meridian-analytics.com',
      relationship: 'Coworker',
    },
    {
      id: 'priya',
      name: 'Priya Nair',
      role: 'Operations Coordinator',
      email: 'priya.nair@meridian-analytics.com',
      relationship: 'Coworker',
    },
    {
      id: 'marcus',
      name: 'Marcus Mercer',
      role: 'Brother',
      email: 'marcus.m@gmail.com',
      relationship: 'Family',
    },
    {
      id: 'elena',
      name: 'Elena Vos',
      role: 'IT Support',
      email: 'it-support@meridian-analytics.com',
      relationship: 'IT',
    },
    {
      id: 'client',
      name: 'Tom Bradley',
      role: 'Helix Corp — Client Contact',
      email: 't.bradley@helixcorp.com',
      relationship: 'Client',
    },
  ],

  // ─────────────────────────────────────────────
  // EVIDENCE INDEX (internal — not shown to player)
  // ─────────────────────────────────────────────
  evidence: [
    // CRITICAL (~9)
    {
      id: 'ev-chat-james-correction',
      type: 'chat',
      timestamp: `${caseDate}T21:47:00`,
      title: 'James sends corrected Helix revenue figures',
      content:
        'James: "Hey — double-checked Helix revenue. It\'s -12%, not +8%. The Q2 carryover was double-counted. Sorry to dump this late."',
      importance: 'critical',
      relatedPeople: ['james', 'daniel'],
      relatedEvidence: ['ev-file-report-modified', 'ev-recycle-report', 'ev-notes-review'],
      reveals: ['bad_numbers'],
      sourceId: 'chat-james',
    },
    {
      id: 'ev-browser-recover',
      type: 'browser',
      timestamp: `${caseDate}T21:52:00`,
      title: 'Searched: recover deleted Excel file',
      content: 'Browser search: "recover deleted Excel file"',
      importance: 'critical',
      relatedPeople: ['daniel'],
      relatedEvidence: ['ev-browser-timestamp', 'ev-browser-empty-bin', 'ev-recycle-report'],
      reveals: ['covering_tracks'],
      sourceId: 'bh-recover',
    },
    {
      id: 'ev-browser-timestamp',
      type: 'browser',
      timestamp: `${caseDate}T22:03:00`,
      title: 'Searched: change Excel file modification timestamp',
      content: 'Browser search: "how to change Excel file modification timestamp"',
      importance: 'critical',
      relatedPeople: ['daniel'],
      relatedEvidence: ['ev-browser-recover', 'ev-file-report-modified'],
      reveals: ['covering_tracks'],
      sourceId: 'bh-timestamp',
    },
    {
      id: 'ev-browser-empty-bin',
      type: 'browser',
      timestamp: `${caseDate}T22:14:00`,
      title: 'Searched: empty recycle bin permanently',
      content: 'Browser search: "can emptied recycle bin files be recovered by IT"',
      importance: 'critical',
      relatedPeople: ['daniel'],
      relatedEvidence: ['ev-recycle-report', 'ev-browser-recover'],
      reveals: ['covering_tracks'],
      sourceId: 'bh-empty-bin',
    },
    {
      id: 'ev-file-report-modified',
      type: 'file',
      timestamp: `${caseDate}T22:18:00`,
      title: 'Helix_Q3_Report_FINAL.xlsx modified at 22:18',
      content:
        'File metadata shows Helix_Q3_Report_FINAL.xlsx last modified at 22:18. A stub copy remains in Projects/Helix with a note that figures are provisional.',
      importance: 'critical',
      relatedPeople: ['daniel'],
      relatedEvidence: ['ev-recycle-report', 'ev-chat-james-correction'],
      reveals: ['timeline'],
      sourceId: 'file-report-stub',
    },
    {
      id: 'ev-recycle-report',
      type: 'recycle',
      timestamp: `${caseDate}T22:21:00`,
      title: 'Helix_Q3_Report_FINAL.xlsx deleted at 22:21',
      content:
        'Recycle Bin: Helix_Q3_Report_FINAL.xlsx deleted from /Projects/Helix at 22:21. Recoverable content still shows +8% revenue (the incorrect figure).',
      importance: 'critical',
      relatedPeople: ['daniel'],
      relatedEvidence: ['ev-file-report-modified', 'ev-email-submitted-lie', 'ev-chat-sarah-lie'],
      reveals: ['deletion'],
      sourceId: 'recycle-report',
    },
    {
      id: 'ev-email-submitted-lie',
      type: 'email',
      timestamp: `${caseDate}T22:28:00`,
      title: 'Sent email claiming report was uploaded',
      content:
        'Daniel emailed Sarah: "Helix Q3 report uploaded to the client portal at 22:28. Full pack attached for your records." — but the portal attachment is missing / email has no real attachment of the final report.',
      importance: 'critical',
      relatedPeople: ['daniel', 'sarah'],
      relatedEvidence: ['ev-recycle-report', 'ev-chat-sarah-lie'],
      reveals: ['lie_about_submission'],
      sourceId: 'email-submitted',
    },
    {
      id: 'ev-chat-sarah-lie',
      type: 'chat',
      timestamp: `${caseDate}T22:31:00`,
      title: 'Daniel tells Sarah the report was submitted',
      content: 'Daniel to Sarah: "Just submitted the Helix report — you\'re all set for tomorrow."',
      importance: 'critical',
      relatedPeople: ['daniel', 'sarah'],
      relatedEvidence: ['ev-email-submitted-lie', 'ev-recycle-report', 'ev-calendar-review'],
      reveals: ['lie_about_submission'],
      sourceId: 'chat-sarah',
    },
    {
      id: 'ev-calendar-review',
      type: 'calendar',
      timestamp: '2025-10-01T09:00:00',
      title: 'Performance Review scheduled next morning',
      content:
        'Calendar: Performance Review with Sarah Chen — Wed 1 Oct, 09:00–09:45. Description references Q3 delivery track record.',
      importance: 'critical',
      relatedPeople: ['daniel', 'sarah'],
      relatedEvidence: ['ev-notes-review', 'ev-email-sarah-pressure', 'ev-chat-sarah-lie'],
      reveals: ['motive'],
      sourceId: 'cal-review',
    },

    // SUPPORTING (~12)
    {
      id: 'ev-notes-review',
      type: 'note',
      timestamp: `${caseDate}T08:40:00`,
      title: 'Note about performance review pressure',
      content:
        'Notes app: "Review tomorrow 9am. Sarah wants strong Helix numbers. Can\'t afford another miss after Q2 slippage. Finish report tonight no matter what."',
      importance: 'supporting',
      relatedPeople: ['daniel', 'sarah'],
      relatedEvidence: ['ev-calendar-review', 'ev-email-sarah-pressure'],
      reveals: ['motive'],
      sourceId: 'note-review',
    },
    {
      id: 'ev-email-sarah-pressure',
      type: 'email',
      timestamp: `${caseDate}T11:14:00`,
      title: 'Sarah email about strong Q3 numbers',
      content:
        'Sarah: "Looking forward to seeing strong Helix Q3 numbers ahead of tomorrow\'s review. Client portal closes at 23:00 sharp."',
      importance: 'supporting',
      relatedPeople: ['sarah', 'daniel'],
      relatedEvidence: ['ev-notes-review', 'ev-calendar-review'],
      reveals: ['motive'],
      sourceId: 'email-sarah-pressure',
    },
    {
      id: 'ev-chat-james-finish',
      type: 'chat',
      timestamp: `${caseDate}T22:35:00`,
      title: 'James asks if report finished; Daniel says yes',
      content: 'James: "Did you finish it?" Daniel: "Yes."',
      importance: 'supporting',
      relatedPeople: ['james', 'daniel'],
      relatedEvidence: ['ev-chat-james-correction', 'ev-recycle-report'],
      reveals: ['lie_about_submission'],
      sourceId: 'chat-james',
    },
    {
      id: 'ev-email-draft-apology',
      type: 'email',
      timestamp: `${caseDate}T22:24:00`,
      title: 'Unfinished draft apology to Sarah',
      content:
        'Drafts: "Sarah — I need to flag something about the Helix figures. James caught a double-count and the real number is…" [draft abandoned]',
      importance: 'supporting',
      relatedPeople: ['daniel', 'sarah', 'james'],
      relatedEvidence: ['ev-chat-james-correction', 'ev-email-submitted-lie'],
      reveals: ['hesitation'],
      sourceId: 'email-draft-apology',
    },
    {
      id: 'ev-file-working-copy',
      type: 'file',
      timestamp: `${caseDate}T20:55:00`,
      title: 'Earlier working copy shows +8% narrative',
      content:
        'Projects/Helix/drafts/Helix_Q3_working.xlsx — narrative still celebrates +8% growth. Modified 20:55, before James\'s correction.',
      importance: 'supporting',
      relatedPeople: ['daniel'],
      relatedEvidence: ['ev-chat-james-correction', 'ev-recycle-report'],
      reveals: ['timeline'],
      sourceId: 'file-working',
    },
    {
      id: 'ev-email-client-deadline',
      type: 'email',
      timestamp: `${caseDate}T16:02:00`,
      title: 'Client reminder about 23:00 portal deadline',
      content:
        'Tom Bradley (Helix): "Reminder — Q3 pack needs to be in the portal by 23:00 tonight. Board pack goes out first thing."',
      importance: 'supporting',
      relatedPeople: ['client', 'daniel'],
      relatedEvidence: ['ev-calendar-deadline'],
      reveals: ['deadline'],
      sourceId: 'email-client-deadline',
    },
    {
      id: 'ev-calendar-deadline',
      type: 'calendar',
      timestamp: `${caseDate}T23:00:00`,
      title: 'Helix portal submission deadline',
      content: 'Reminder: Helix Q3 portal submission — due 23:00',
      importance: 'supporting',
      relatedPeople: ['daniel', 'client'],
      relatedEvidence: ['ev-email-client-deadline'],
      reveals: ['deadline'],
      sourceId: 'cal-deadline',
    },
    {
      id: 'ev-chat-marcus-stress',
      type: 'chat',
      timestamp: `${caseDate}T21:18:00`,
      title: 'Daniel tells brother he\'s stressed about numbers',
      content:
        'Daniel to Marcus: "If these Helix numbers go sideways before the review I\'m cooked."',
      importance: 'supporting',
      relatedPeople: ['daniel', 'marcus'],
      relatedEvidence: ['ev-notes-review', 'ev-calendar-review'],
      reveals: ['motive'],
      sourceId: 'chat-marcus',
    },
    {
      id: 'ev-file-readme-stub',
      type: 'file',
      timestamp: `${caseDate}T22:19:00`,
      title: 'Stub README left in Helix folder',
      content:
        'Projects/Helix/README.txt modified 22:19: "FINAL uploaded to portal — see sent mail. Local copy archived."',
      importance: 'supporting',
      relatedPeople: ['daniel'],
      relatedEvidence: ['ev-email-submitted-lie', 'ev-recycle-report'],
      reveals: ['cover_story'],
      sourceId: 'file-readme',
    },
    {
      id: 'ev-email-james-followup',
      type: 'email',
      timestamp: `${caseDate}T21:50:00`,
      title: 'James emails formal correction note',
      content:
        'James: "Following up on chat — attached reconciliation. Helix net revenue for Q3 is −12.1% YoY once Q2 carryover is removed. Happy to walk through tomorrow."',
      importance: 'supporting',
      relatedPeople: ['james', 'daniel'],
      relatedEvidence: ['ev-chat-james-correction'],
      reveals: ['bad_numbers'],
      sourceId: 'email-james-correction',
    },
    {
      id: 'ev-browser-portal',
      type: 'browser',
      timestamp: `${caseDate}T22:26:00`,
      title: 'Visited client portal briefly without upload evidence',
      content:
        'History: helix-portal.meridian-analytics.com/upload — page open ~40 seconds, no download of confirmation receipt found.',
      importance: 'supporting',
      relatedPeople: ['daniel'],
      relatedEvidence: ['ev-email-submitted-lie'],
      reveals: ['lie_about_submission'],
      sourceId: 'bh-portal',
    },
    {
      id: 'ev-notes-scratch',
      type: 'note',
      timestamp: `${caseDate}T21:55:00`,
      title: 'Scratch note with −12% scribbled out',
      content:
        'Untitled note: "James says −12%. If I send that… review… options: 1) tell Sarah 2) delay 3) …" rest deleted mid-sentence.',
      importance: 'supporting',
      relatedPeople: ['daniel', 'james', 'sarah'],
      relatedEvidence: ['ev-chat-james-correction', 'ev-notes-review'],
      reveals: ['motive', 'hesitation'],
      sourceId: 'note-scratch',
    },

    // RED HERRINGS (~10)
    {
      id: 'ev-recycle-budget',
      type: 'recycle',
      timestamp: `${caseDate}T12:28:00`,
      title: 'Personal budget spreadsheet deleted at lunch',
      content:
        'Recycle Bin: personal_budget_2025.xlsx deleted from /Personal at 12:28. Ordinary household budget — unrelated to Helix.',
      importance: 'red_herring',
      relatedPeople: ['daniel'],
      relatedEvidence: ['ev-browser-recover-lunch'],
      sourceId: 'recycle-budget',
    },
    {
      id: 'ev-browser-recover-lunch',
      type: 'browser',
      timestamp: `${caseDate}T12:35:00`,
      title: 'Lunchtime search: recover deleted files',
      content:
        'Search at 12:35: "recover deleted files windows 11" — shortly after deleting personal_budget_2025.xlsx.',
      importance: 'red_herring',
      relatedPeople: ['daniel'],
      relatedEvidence: ['ev-recycle-budget'],
      sourceId: 'bh-recover-lunch',
    },
    {
      id: 'ev-email-printer',
      type: 'email',
      timestamp: `${caseDate}T09:42:00`,
      title: 'IT ticket about printer jam',
      content: 'Elena (IT): "3rd floor printer queue cleared. Your Helix draft print job was cancelled — resubmit if needed."',
      importance: 'red_herring',
      relatedPeople: ['elena', 'daniel'],
      relatedEvidence: [],
      sourceId: 'email-printer',
    },
    {
      id: 'ev-chat-priya-lunch',
      type: 'chat',
      timestamp: `${caseDate}T12:05:00`,
      title: 'Priya invites Daniel to lunch',
      content: 'Priya: "Thai place at 12:30?" Daniel: "Can\'t — drowning in Helix. Next week?"',
      importance: 'red_herring',
      relatedPeople: ['priya', 'daniel'],
      relatedEvidence: [],
      sourceId: 'chat-priya',
    },
    {
      id: 'ev-browser-football',
      type: 'browser',
      timestamp: `${caseDate}T19:40:00`,
      title: 'Checked football scores',
      content: 'Visited: bbc.co.uk/sport/football — Arsenal vs Villa live scores',
      importance: 'red_herring',
      relatedPeople: ['daniel'],
      relatedEvidence: [],
      sourceId: 'bh-football',
    },
    {
      id: 'ev-calendar-dentist',
      type: 'calendar',
      timestamp: '2025-10-03T15:30:00',
      title: 'Dentist appointment Friday',
      content: 'Dentist — check-up, 15:30 Friday',
      importance: 'red_herring',
      relatedPeople: ['daniel'],
      relatedEvidence: [],
      sourceId: 'cal-dentist',
    },
    {
      id: 'ev-email-password',
      type: 'email',
      timestamp: `${caseDate}T08:05:00`,
      title: 'Password reset for streaming service',
      content: 'noreply@streamfli.x: "Your password was reset. If this wasn\'t you, contact support."',
      importance: 'red_herring',
      relatedPeople: ['daniel'],
      relatedEvidence: [],
      sourceId: 'email-password',
    },
    {
      id: 'ev-file-holiday',
      type: 'file',
      timestamp: '2025-09-22T18:10:00',
      title: 'Portugal holiday itinerary',
      content: 'Personal/portugal_itinerary.txt — Lisbon/Porto plan for November half-term.',
      importance: 'red_herring',
      relatedPeople: ['daniel', 'marcus'],
      relatedEvidence: [],
      sourceId: 'file-holiday',
    },
    {
      id: 'ev-browser-takeaway',
      type: 'browser',
      timestamp: `${caseDate}T18:02:00`,
      title: 'Searched for takeaway',
      content: 'Search: "best takeaway near Paddington"',
      importance: 'red_herring',
      relatedPeople: ['daniel'],
      relatedEvidence: [],
      sourceId: 'bh-takeaway',
    },
    {
      id: 'ev-email-renovation',
      type: 'email',
      timestamp: `${caseDate}T14:20:00`,
      title: 'Office renovation survey',
      content: 'Facilities: "Please complete the 3rd floor renovation preference survey by Friday."',
      importance: 'red_herring',
      relatedPeople: ['daniel'],
      relatedEvidence: [],
      sourceId: 'email-renovation',
    },
    {
      id: 'ev-chat-marcus-weekend',
      type: 'chat',
      timestamp: `${caseDate}T17:55:00`,
      title: 'Marcus asks about weekend plans',
      content: 'Marcus: "Pub Sunday?" Daniel: "Maybe — depends how tonight goes."',
      importance: 'red_herring',
      relatedPeople: ['marcus', 'daniel'],
      relatedEvidence: [],
      sourceId: 'chat-marcus',
    },
    {
      id: 'ev-file-old-report',
      type: 'file',
      timestamp: '2025-06-28T16:00:00',
      title: 'Archived Q2 Helix report',
      content: 'Archive/Helix_Q2_Report_FINAL.xlsx — completed and submitted in June. Unrelated to tonight.',
      importance: 'red_herring',
      relatedPeople: ['daniel'],
      relatedEvidence: [],
      sourceId: 'file-q2',
    },
  ],

  // ─────────────────────────────────────────────
  // EMAILS (~18)
  // ─────────────────────────────────────────────
  emails: [
    {
      id: 'email-password',
      folder: 'inbox',
      from: 'noreply@streamflix.example',
      to: ['daniel.mercer@meridian-analytics.com'],
      subject: 'Your StreamFlix password was reset',
      body: `Hi Daniel,

Your password for StreamFlix was successfully reset at 08:02.

If you did not request this change, please secure your account immediately.

— StreamFlix Security`,
      timestamp: `${caseDate}T08:05:00`,
      read: true,
      evidenceId: 'ev-email-password',
    },
    {
      id: 'email-printer',
      folder: 'inbox',
      from: 'it-support@meridian-analytics.com',
      to: ['daniel.mercer@meridian-analytics.com'],
      subject: 'Re: 3rd floor printer — job cancelled',
      body: `Hi Daniel,

The 3rd floor printer queue was jammed this morning. Your Helix draft print job (12 pages) was cancelled when we cleared the spooler.

Please resubmit if you still need a hard copy.

Elena Vos
IT Support`,
      timestamp: `${caseDate}T09:42:00`,
      read: true,
      evidenceId: 'ev-email-printer',
    },
    {
      id: 'email-sarah-pressure',
      folder: 'inbox',
      from: 'sarah.chen@meridian-analytics.com',
      to: ['daniel.mercer@meridian-analytics.com'],
      subject: 'Helix Q3 — before tomorrow\'s review',
      body: `Daniel,

Quick note before the day runs away from us.

Looking forward to seeing strong Helix Q3 numbers ahead of tomorrow's review. The client portal closes at 23:00 sharp — no extensions this quarter.

I know Q2 was messy. Tonight is a chance to reset the narrative.

Ping me when it's uploaded.

Sarah Chen
Director of Analytics
Meridian Analytics`,
      timestamp: `${caseDate}T11:14:00`,
      read: true,
      evidenceId: 'ev-email-sarah-pressure',
    },
    {
      id: 'email-renovation',
      folder: 'inbox',
      from: 'facilities@meridian-analytics.com',
      to: ['all-staff@meridian-analytics.com'],
      subject: '3rd floor renovation preference survey',
      body: `Team,

Please complete the short preference survey for the 3rd floor renovation by Friday. Hot-desk ratios and quiet-room allocation are still open questions.

Thanks,
Facilities`,
      timestamp: `${caseDate}T14:20:00`,
      read: true,
      evidenceId: 'ev-email-renovation',
    },
    {
      id: 'email-client-deadline',
      folder: 'inbox',
      from: 't.bradley@helixcorp.com',
      to: ['daniel.mercer@meridian-analytics.com'],
      cc: ['sarah.chen@meridian-analytics.com'],
      subject: 'Reminder: Q3 pack by 23:00',
      body: `Daniel, Sarah,

Reminder — Q3 pack needs to be in the portal by 23:00 tonight. Our board pack goes out first thing Wednesday.

Appreciate the usual thoroughness.

Tom Bradley
FP&A, Helix Corp`,
      timestamp: `${caseDate}T16:02:00`,
      read: true,
      evidenceId: 'ev-email-client-deadline',
    },
    {
      id: 'email-priya-expenses',
      folder: 'inbox',
      from: 'priya.nair@meridian-analytics.com',
      to: ['daniel.mercer@meridian-analytics.com'],
      subject: 'Expense claim — client dinner Aug',
      body: `Hi Dan,

Finance bounced your August client dinner claim — missing receipt photo. Can you re-upload when you get a chance? Not urgent.

Priya`,
      timestamp: `${caseDate}T16:44:00`,
      read: true,
    },
    {
      id: 'email-james-correction',
      folder: 'inbox',
      from: 'james.whitfield@meridian-analytics.com',
      to: ['daniel.mercer@meridian-analytics.com'],
      subject: 'Helix revenue reconciliation — urgent',
      body: `Dan,

Following up on chat — attached reconciliation summary below (couldn't attach the full workbook from my phone).

Helix net revenue for Q3 is −12.1% YoY once the Q2 carryover is removed. We double-counted the Orion contract (£840k) in the preliminary pack you were using.

Happy to walk through first thing tomorrow if useful. Sorry this landed so late — I only caught it when cross-checking the ledger export.

James Whitfield
Financial Analyst`,
      timestamp: `${caseDate}T21:50:00`,
      read: true,
      evidenceId: 'ev-email-james-followup',
    },
    {
      id: 'email-newsletter',
      folder: 'inbox',
      from: 'digest@fintechweekly.example',
      to: ['daniel.mercer@meridian-analytics.com'],
      subject: 'Fintech Weekly: rate cuts, SaaS multiples, and more',
      body: `This week in markets:
• Central banks signal patience
• Mid-market SaaS multiples compress further
• Featured: FP&A automation tools comparison

Unsubscribe anytime.`,
      timestamp: `${caseDate}T07:30:00`,
      read: true,
    },
    {
      id: 'email-hr-review',
      folder: 'inbox',
      from: 'hr@meridian-analytics.com',
      to: ['daniel.mercer@meridian-analytics.com'],
      subject: 'Prep pack for your performance review',
      body: `Hi Daniel,

Your performance review with Sarah Chen is scheduled for Wednesday 1 October, 09:00.

Please complete the self-assessment form in Workday before the meeting. Managers have been asked to weigh Q3 delivery outcomes heavily this cycle.

HR Business Partnering`,
      timestamp: '2025-09-29T15:10:00',
      read: true,
    },
    {
      id: 'email-marcus-personal',
      folder: 'inbox',
      from: 'marcus.m@gmail.com',
      to: ['daniel.mercer@meridian-analytics.com'],
      subject: 'Mum\'s birthday present',
      body: `Mate,

Did we decide on the weekend away voucher or the kitchen thing? Need to order by Thursday.

M`,
      timestamp: `${caseDate}T10:22:00`,
      read: true,
    },
    // SENT
    {
      id: 'email-submitted',
      folder: 'sent',
      from: 'daniel.mercer@meridian-analytics.com',
      to: ['sarah.chen@meridian-analytics.com'],
      cc: ['t.bradley@helixcorp.com'],
      subject: 'Helix Q3 report — submitted',
      body: `Sarah, Tom,

Helix Q3 report uploaded to the client portal at 22:28. Full pack attached for your records.

Let me know if you need anything adjusted before the board pack goes out.

Daniel Mercer
Senior Financial Analyst
Meridian Analytics

---
[Attachment: Helix_Q3_Report_FINAL.xlsx — FAILED TO ATTACH / 0 bytes]`,
      timestamp: `${caseDate}T22:28:00`,
      read: true,
      evidenceId: 'ev-email-submitted-lie',
    },
    {
      id: 'email-sent-sarah-status',
      folder: 'sent',
      from: 'daniel.mercer@meridian-analytics.com',
      to: ['sarah.chen@meridian-analytics.com'],
      subject: 'Re: Helix Q3 — before tomorrow\'s review',
      body: `Thanks Sarah — on track. Will have it in the portal well before 23:00.

Daniel`,
      timestamp: `${caseDate}T11:31:00`,
      read: true,
    },
    {
      id: 'email-sent-james-thanks',
      folder: 'sent',
      from: 'daniel.mercer@meridian-analytics.com',
      to: ['james.whitfield@meridian-analytics.com'],
      subject: 'Re: Helix revenue reconciliation — urgent',
      body: `Got it. Looking now.

D`,
      timestamp: `${caseDate}T21:51:00`,
      read: true,
    },
    {
      id: 'email-sent-takeaway',
      folder: 'sent',
      from: 'daniel.mercer@meridian-analytics.com',
      to: ['orders@padthai-express.example'],
      subject: 'Order confirmation #48291',
      body: `Thanks — order #48291 for delivery to desk 3.14.

Pad Thai (no peanuts), spring rolls ×2.`,
      timestamp: `${caseDate}T18:11:00`,
      read: true,
    },
    {
      id: 'email-sent-priya',
      folder: 'sent',
      from: 'daniel.mercer@meridian-analytics.com',
      to: ['priya.nair@meridian-analytics.com'],
      subject: 'Re: Expense claim — client dinner Aug',
      body: `Will dig out the receipt tomorrow. Swamped with Helix tonight.

Dan`,
      timestamp: `${caseDate}T16:52:00`,
      read: true,
    },
    // DRAFTS
    {
      id: 'email-draft-apology',
      folder: 'drafts',
      from: 'daniel.mercer@meridian-analytics.com',
      to: ['sarah.chen@meridian-analytics.com'],
      subject: 'Helix figures — need to flag something',
      body: `Sarah —

I need to flag something about the Helix figures. James caught a double-count and the real number is

`,
      timestamp: `${caseDate}T22:24:00`,
      read: true,
      evidenceId: 'ev-email-draft-apology',
    },
    {
      id: 'email-draft-holiday',
      folder: 'drafts',
      from: 'daniel.mercer@meridian-analytics.com',
      to: ['marcus.m@gmail.com'],
      subject: 'Portugal flights',
      body: `Shall I book the Friday evening flight or Saturday morning? Saturday is cheaper but we lose a day.

`,
      timestamp: '2025-09-27T20:15:00',
      read: true,
    },
    {
      id: 'email-inbox-standup',
      folder: 'inbox',
      from: 'sarah.chen@meridian-analytics.com',
      to: ['analytics-team@meridian-analytics.com'],
      subject: 'Stand-up notes — Mon 29 Sep',
      body: `Team notes:
• Helix Q3 due Tue night
• Orion scoping call Wed
• Please update capacity sheet

Sarah`,
      timestamp: '2025-09-29T09:35:00',
      read: true,
    },
  ],

  // ─────────────────────────────────────────────
  // FILES
  // ─────────────────────────────────────────────
  files: [
    // Folders
    { id: 'folder-root', name: 'This PC', path: '/', type: 'folder', createdAt: '2024-01-01T00:00:00', modifiedAt: '2025-09-30T22:19:00', size: '—', parentId: null },
    { id: 'folder-documents', name: 'Documents', path: '/Documents', type: 'folder', createdAt: '2024-01-01T00:00:00', modifiedAt: '2025-09-28T12:00:00', size: '—', parentId: 'folder-root' },
    { id: 'folder-downloads', name: 'Downloads', path: '/Downloads', type: 'folder', createdAt: '2024-01-01T00:00:00', modifiedAt: `${caseDate}T18:05:00`, size: '—', parentId: 'folder-root' },
    { id: 'folder-projects', name: 'Projects', path: '/Projects', type: 'folder', createdAt: '2024-03-01T00:00:00', modifiedAt: `${caseDate}T22:19:00`, size: '—', parentId: 'folder-root' },
    { id: 'folder-helix', name: 'Helix', path: '/Projects/Helix', type: 'folder', createdAt: '2025-07-01T00:00:00', modifiedAt: `${caseDate}T22:19:00`, size: '—', parentId: 'folder-projects' },
    { id: 'folder-helix-drafts', name: 'drafts', path: '/Projects/Helix/drafts', type: 'folder', createdAt: '2025-09-15T00:00:00', modifiedAt: `${caseDate}T20:55:00`, size: '—', parentId: 'folder-helix' },
    { id: 'folder-orion', name: 'Orion', path: '/Projects/Orion', type: 'folder', createdAt: '2025-09-01T00:00:00', modifiedAt: '2025-09-25T11:00:00', size: '—', parentId: 'folder-projects' },
    { id: 'folder-personal', name: 'Personal', path: '/Personal', type: 'folder', createdAt: '2024-01-01T00:00:00', modifiedAt: `${caseDate}T12:28:00`, size: '—', parentId: 'folder-root' },
    { id: 'folder-desktop', name: 'Desktop', path: '/Desktop', type: 'folder', createdAt: '2024-01-01T00:00:00', modifiedAt: `${caseDate}T09:00:00`, size: '—', parentId: 'folder-root' },
    { id: 'folder-archive', name: 'Archive', path: '/Archive', type: 'folder', createdAt: '2024-06-01T00:00:00', modifiedAt: '2025-06-28T16:00:00', size: '—', parentId: 'folder-root' },

    // Helix project files
    {
      id: 'file-readme',
      name: 'README.txt',
      path: '/Projects/Helix/README.txt',
      type: 'text',
      createdAt: '2025-09-15T10:00:00',
      modifiedAt: `${caseDate}T22:19:00`,
      size: '212 B',
      parentId: 'folder-helix',
      evidenceId: 'ev-file-readme-stub',
      content: `Helix Corp — Q3 2025 Delivery

Status: COMPLETE
FINAL uploaded to portal — see sent mail. Local copy archived.

Owner: D. Mercer
Deadline: 30 Sep 23:00
`,
    },
    {
      id: 'file-report-stub',
      name: 'Helix_Q3_figures_NOTES.txt',
      path: '/Projects/Helix/Helix_Q3_figures_NOTES.txt',
      type: 'text',
      createdAt: `${caseDate}T19:10:00`,
      modifiedAt: `${caseDate}T22:18:00`,
      size: '640 B',
      parentId: 'folder-helix',
      evidenceId: 'ev-file-report-modified',
      content: `Helix Q3 — working figures (PROVISIONAL)

Revenue YoY: +8.0%   ← from prelim pack
Gross margin: 41.2%
Orion contract: included in Q3 (confirm with James)

TODO:
[ ] Final crosstab
[ ] Client narrative polish
[ ] Upload to portal

Last opened workbook: Helix_Q3_Report_FINAL.xlsx
Last local save: 22:18
`,
    },
    {
      id: 'file-working',
      name: 'Helix_Q3_working.xlsx',
      path: '/Projects/Helix/drafts/Helix_Q3_working.xlsx',
      type: 'spreadsheet',
      createdAt: `${caseDate}T14:00:00`,
      modifiedAt: `${caseDate}T20:55:00`,
      size: '184 KB',
      parentId: 'folder-helix-drafts',
      evidenceId: 'ev-file-working-copy',
      content: `SHEET: Summary
─────────────────────────────────────────
Metric              Q3 2024    Q3 2025    YoY
Revenue (£000)      6,420      6,934      +8.0%
Gross Profit        2,568      2,857      +11.3%
Op. Margin          18.1%      19.0%      +0.9pp

SHEET: Narrative (draft)
─────────────────────────────────────────
"Helix delivered another quarter of solid top-line growth (+8%), supported by the Orion contract ramp and resilient services pipeline…"

NOTE: Figures sourced from prelim ledger export 28 Sep.
Awaiting James Whitfield final reconciliation.
`,
    },
    {
      id: 'file-meeting-notes',
      name: 'helix_kickoff_notes.txt',
      path: '/Projects/Helix/helix_kickoff_notes.txt',
      type: 'text',
      createdAt: '2025-07-08T11:00:00',
      modifiedAt: '2025-07-08T11:45:00',
      size: '1.1 KB',
      parentId: 'folder-helix',
      content: `Helix Q3 engagement kickoff — 8 Jul

Attendees: Sarah, Daniel, Tom (Helix)
• Monthly flash + quarterly deep dive
• Portal upload SLA: day-of by 23:00
• Primary contact: Tom Bradley
`,
    },
    {
      id: 'file-orion-scope',
      name: 'orion_scoping.txt',
      path: '/Projects/Orion/orion_scoping.txt',
      type: 'text',
      createdAt: '2025-09-20T10:00:00',
      modifiedAt: '2025-09-25T11:00:00',
      size: '890 B',
      parentId: 'folder-orion',
      content: `Orion scoping notes

Potential Q4 engagement. Kickoff call Wed 1 Oct after my review.
Not related to tonight's Helix delivery.
`,
    },
    {
      id: 'file-q2',
      name: 'Helix_Q2_Report_FINAL.xlsx',
      path: '/Archive/Helix_Q2_Report_FINAL.xlsx',
      type: 'spreadsheet',
      createdAt: '2025-06-20T09:00:00',
      modifiedAt: '2025-06-28T16:00:00',
      size: '210 KB',
      parentId: 'folder-archive',
      evidenceId: 'ev-file-old-report',
      content: `Helix Q2 2025 — ARCHIVED SUBMITTED COPY

Revenue YoY: +3.2%
Status: Submitted 28 Jun 2025
Notes: Q2 carryover items flagged for Q3 cleanup.
`,
    },
    {
      id: 'file-holiday',
      name: 'portugal_itinerary.txt',
      path: '/Personal/portugal_itinerary.txt',
      type: 'text',
      createdAt: '2025-09-18T19:00:00',
      modifiedAt: '2025-09-22T18:10:00',
      size: '1.4 KB',
      parentId: 'folder-personal',
      evidenceId: 'ev-file-holiday',
      content: `Portugal — November half-term

Fri: Fly LHR → LIS
Sat–Mon: Lisbon (Alfama, Belém)
Tue–Thu: Porto (train)
Fri: Return

Budget ~£1,100 with Marcus.
Still deciding Friday vs Saturday outbound.
`,
    },
    {
      id: 'file-photo-placeholder',
      name: 'IMG_4421_desk.jpg',
      path: '/Personal/IMG_4421_desk.jpg',
      type: 'image',
      createdAt: '2025-08-12T13:20:00',
      modifiedAt: '2025-08-12T13:20:00',
      size: '3.2 MB',
      parentId: 'folder-personal',
      content: '[Image placeholder: photo of a cluttered desk with a coffee mug and dual monitors]',
    },
    {
      id: 'file-shopping',
      name: 'shopping_list.txt',
      path: '/Documents/shopping_list.txt',
      type: 'text',
      createdAt: `${caseDate}T08:15:00`,
      modifiedAt: `${caseDate}T08:15:00`,
      size: '120 B',
      parentId: 'folder-documents',
      content: `- Milk
- Bread
- Dishwasher tablets
- Bin bags
- Toothpaste
`,
    },
    {
      id: 'file-capacity',
      name: 'team_capacity_sep.xlsx',
      path: '/Documents/team_capacity_sep.xlsx',
      type: 'spreadsheet',
      createdAt: '2025-09-01T09:00:00',
      modifiedAt: '2025-09-29T16:30:00',
      size: '45 KB',
      parentId: 'folder-documents',
      content: `Name          Util%   Notes
D. Mercer     95%     Helix heavy
J. Whitfield  80%
P. Nair       70%     Ops support
`,
    },
    {
      id: 'file-download-menu',
      name: 'padthai_menu.pdf',
      path: '/Downloads/padthai_menu.pdf',
      type: 'pdf',
      createdAt: `${caseDate}T18:05:00`,
      modifiedAt: `${caseDate}T18:05:00`,
      size: '2.1 MB',
      parentId: 'folder-downloads',
      content: '[PDF] Pad Thai Express — delivery menu, Paddington.',
    },
    {
      id: 'file-download-ledger',
      name: 'helix_ledger_export_28sep.csv',
      path: '/Downloads/helix_ledger_export_28sep.csv',
      type: 'other',
      createdAt: '2025-09-28T17:40:00',
      modifiedAt: '2025-09-28T17:40:00',
      size: '520 KB',
      parentId: 'folder-downloads',
      content: `Raw ledger export used for prelim Helix figures.
Includes Orion contract line that James later flagged as Q2 carryover.
`,
    },
    {
      id: 'file-desktop-todo',
      name: 'todo_today.txt',
      path: '/Desktop/todo_today.txt',
      type: 'text',
      createdAt: `${caseDate}T08:50:00`,
      modifiedAt: `${caseDate}T09:05:00`,
      size: '180 B',
      parentId: 'folder-desktop',
      content: `□ Finish Helix Q3 final
□ Reply Priya expenses
□ Prep 3 bullets for review
□ Order mum present (ask Marcus)
`,
    },
    {
      id: 'file-cv-old',
      name: 'CV_Daniel_Mercer_2023.pdf',
      path: '/Personal/CV_Daniel_Mercer_2023.pdf',
      type: 'pdf',
      createdAt: '2023-11-02T20:00:00',
      modifiedAt: '2023-11-02T20:00:00',
      size: '240 KB',
      parentId: 'folder-personal',
      content: '[PDF] Older CV from previous job search — 2023. Not recently opened.',
    },
  ],

  // ─────────────────────────────────────────────
  // BROWSER (~26 entries)
  // ─────────────────────────────────────────────
  browserHistory: [
    { id: 'bh-weather', type: 'search', title: 'weather tomorrow London', url: 'https://search.trace/q?weather+tomorrow+London', timestamp: `${caseDate}T08:12:00` },
    { id: 'bh-news', type: 'history', title: 'Financial Times — Markets', url: 'https://ft.example/markets', timestamp: `${caseDate}T08:20:00` },
    { id: 'bh-workday', type: 'history', title: 'Workday — Self assessment', url: 'https://workday.meridian-analytics.com/review', timestamp: `${caseDate}T08:45:00` },
    { id: 'bh-excel-formula', type: 'search', title: 'Excel YoY growth formula', url: 'https://search.trace/q?Excel+YoY+growth+formula', timestamp: `${caseDate}T10:05:00` },
    { id: 'bh-recover-lunch', type: 'search', title: 'recover deleted files windows 11', url: 'https://search.trace/q?recover+deleted+files+windows+11', timestamp: `${caseDate}T12:35:00`, evidenceId: 'ev-browser-recover-lunch' },
    { id: 'bh-recycle-help', type: 'history', title: 'Microsoft Support — Restore files from Recycle Bin', url: 'https://support.microsoft.example/recycle-bin', timestamp: `${caseDate}T12:37:00` },
    { id: 'bh-capacity', type: 'history', title: 'Team capacity sheet — Drive', url: 'https://drive.meridian-analytics.com/capacity', timestamp: `${caseDate}T15:10:00` },
    { id: 'bh-takeaway', type: 'search', title: 'best takeaway near Paddington', url: 'https://search.trace/q?best+takeaway+near+Paddington', timestamp: `${caseDate}T18:02:00`, evidenceId: 'ev-browser-takeaway' },
    { id: 'bh-padthai', type: 'history', title: 'Pad Thai Express — Order', url: 'https://padthai-express.example/order', timestamp: `${caseDate}T18:08:00` },
    { id: 'bh-football', type: 'history', title: 'BBC Sport — Arsenal vs Villa', url: 'https://bbc.co.uk/sport/football', timestamp: `${caseDate}T19:40:00`, evidenceId: 'ev-browser-football' },
    { id: 'bh-annual', type: 'search', title: 'company annual report formatting tips', url: 'https://search.trace/q?company+annual+report+formatting', timestamp: `${caseDate}T20:12:00` },
    { id: 'bh-helix-site', type: 'history', title: 'Helix Corp — Investor relations', url: 'https://helixcorp.example/investors', timestamp: `${caseDate}T20:30:00` },
    { id: 'bh-recover', type: 'search', title: 'recover deleted Excel file', url: 'https://search.trace/q?recover+deleted+Excel+file', timestamp: `${caseDate}T21:52:00`, evidenceId: 'ev-browser-recover' },
    { id: 'bh-recover-page', type: 'history', title: 'How to recover an unsaved Excel workbook', url: 'https://office-help.example/excel-recover', timestamp: `${caseDate}T21:54:00` },
    { id: 'bh-timestamp', type: 'search', title: 'how to change Excel file modification timestamp', url: 'https://search.trace/q?change+Excel+modification+timestamp', timestamp: `${caseDate}T22:03:00`, evidenceId: 'ev-browser-timestamp' },
    { id: 'bh-timestamp-page', type: 'history', title: 'StackOverflow — Changing file LastWriteTime', url: 'https://stackoverflow.example/q/file-timestamp', timestamp: `${caseDate}T22:05:00` },
    { id: 'bh-empty-bin', type: 'search', title: 'can emptied recycle bin files be recovered by IT', url: 'https://search.trace/q?emptied+recycle+bin+recovered+by+IT', timestamp: `${caseDate}T22:14:00`, evidenceId: 'ev-browser-empty-bin' },
    { id: 'bh-forensic', type: 'history', title: 'Do IT departments recover emptied recycle bins?', url: 'https://security-forum.example/recycle-forensics', timestamp: `${caseDate}T22:16:00` },
    { id: 'bh-portal', type: 'history', title: 'Meridian Client Portal — Helix upload', url: 'https://helix-portal.meridian-analytics.com/upload', timestamp: `${caseDate}T22:26:00`, evidenceId: 'ev-browser-portal' },
    { id: 'bh-mail-web', type: 'history', title: 'Trace Mail — compose', url: 'https://mail.trace.os/compose', timestamp: `${caseDate}T22:27:00` },
    { id: 'bh-portugal', type: 'search', title: 'Lisbon to Porto train tickets', url: 'https://search.trace/q?Lisbon+Porto+train', timestamp: '2025-09-22T18:00:00' },
    { id: 'bh-bookmark-portal', type: 'bookmark', title: 'Helix Client Portal', url: 'https://helix-portal.meridian-analytics.com' },
    { id: 'bh-bookmark-drive', type: 'bookmark', title: 'Meridian Drive', url: 'https://drive.meridian-analytics.com' },
    { id: 'bh-bookmark-hr', type: 'bookmark', title: 'Workday HR', url: 'https://workday.meridian-analytics.com' },
    { id: 'bh-bookmark-ft', type: 'bookmark', title: 'FT Markets', url: 'https://ft.example/markets' },
    { id: 'bh-maps', type: 'history', title: 'Maps — dentist Marylebone', url: 'https://maps.example/dentist-marylebone', timestamp: '2025-09-25T12:00:00' },
  ],

  // ─────────────────────────────────────────────
  // CHATS
  // ─────────────────────────────────────────────
  chats: [
    {
      id: 'chat-sarah',
      contactId: 'sarah',
      contactName: 'Sarah Chen',
      messages: [
        { id: 'cs1', senderId: 'sarah', senderName: 'Sarah Chen', text: 'Morning — still good for Helix tonight?', timestamp: `${caseDate}T09:05:00` },
        { id: 'cs2', senderId: 'daniel', senderName: 'Daniel Mercer', text: 'Yes. On it all day.', timestamp: `${caseDate}T09:07:00` },
        { id: 'cs3', senderId: 'sarah', senderName: 'Sarah Chen', text: 'Portal hard-closes at 23:00. Don\'t cut it fine.', timestamp: `${caseDate}T09:08:00` },
        { id: 'cs4', senderId: 'daniel', senderName: 'Daniel Mercer', text: 'Understood.', timestamp: `${caseDate}T09:08:30` },
        { id: 'cs5', senderId: 'sarah', senderName: 'Sarah Chen', text: 'Also — review tomorrow. Bring the Helix story. We need a clean win.', timestamp: `${caseDate}T17:20:00` },
        { id: 'cs6', senderId: 'daniel', senderName: 'Daniel Mercer', text: 'Will do.', timestamp: `${caseDate}T17:22:00` },
        { id: 'cs7', senderId: 'daniel', senderName: 'Daniel Mercer', text: 'Just submitted the Helix report — you\'re all set for tomorrow.', timestamp: `${caseDate}T22:31:00`, evidenceId: 'ev-chat-sarah-lie' },
        { id: 'cs8', senderId: 'sarah', senderName: 'Sarah Chen', text: 'Perfect. See you at 9.', timestamp: `${caseDate}T22:33:00` },
      ],
    },
    {
      id: 'chat-james',
      contactId: 'james',
      contactName: 'James Whitfield',
      messages: [
        { id: 'cj1', senderId: 'james', senderName: 'James Whitfield', text: 'How\'s the Helix pack looking?', timestamp: `${caseDate}T15:40:00` },
        { id: 'cj2', senderId: 'daniel', senderName: 'Daniel Mercer', text: 'Solid. +8% narrative is clean. Polishing now.', timestamp: `${caseDate}T15:42:00` },
        { id: 'cj3', senderId: 'james', senderName: 'James Whitfield', text: 'Cool. I\'m still reconciling the ledger export — will ping if anything looks off.', timestamp: `${caseDate}T15:43:00` },
        { id: 'cj4', senderId: 'james', senderName: 'James Whitfield', text: 'Hey — double-checked Helix revenue. It\'s -12%, not +8%. The Q2 carryover was double-counted. Sorry to dump this late.', timestamp: `${caseDate}T21:47:00`, evidenceId: 'ev-chat-james-correction' },
        { id: 'cj5', senderId: 'daniel', senderName: 'Daniel Mercer', text: 'Wait. Are you sure?', timestamp: `${caseDate}T21:48:00` },
        { id: 'cj6', senderId: 'james', senderName: 'James Whitfield', text: 'Yeah. Orion £840k sat in both quarters. Emailing you the note.', timestamp: `${caseDate}T21:49:00` },
        { id: 'cj7', senderId: 'daniel', senderName: 'Daniel Mercer', text: 'Okay.', timestamp: `${caseDate}T21:49:30` },
        { id: 'cj8', senderId: 'james', senderName: 'James Whitfield', text: 'Did you finish it?', timestamp: `${caseDate}T22:35:00`, evidenceId: 'ev-chat-james-finish' },
        { id: 'cj9', senderId: 'daniel', senderName: 'Daniel Mercer', text: 'Yes.', timestamp: `${caseDate}T22:35:40`, evidenceId: 'ev-chat-james-finish' },
      ],
    },
    {
      id: 'chat-priya',
      contactId: 'priya',
      contactName: 'Priya Nair',
      messages: [
        { id: 'cp1', senderId: 'priya', senderName: 'Priya Nair', text: 'Thai place at 12:30?', timestamp: `${caseDate}T12:05:00`, evidenceId: 'ev-chat-priya-lunch' },
        { id: 'cp2', senderId: 'daniel', senderName: 'Daniel Mercer', text: 'Can\'t — drowning in Helix. Next week?', timestamp: `${caseDate}T12:06:00`, evidenceId: 'ev-chat-priya-lunch' },
        { id: 'cp3', senderId: 'priya', senderName: 'Priya Nair', text: 'No worries. Don\'t forget the expense receipt though 😄', timestamp: `${caseDate}T12:07:00` },
        { id: 'cp4', senderId: 'daniel', senderName: 'Daniel Mercer', text: 'Tomorrow. Promise.', timestamp: `${caseDate}T12:08:00` },
      ],
    },
    {
      id: 'chat-marcus',
      contactId: 'marcus',
      contactName: 'Marcus Mercer',
      messages: [
        { id: 'cm1', senderId: 'marcus', senderName: 'Marcus Mercer', text: 'Pub Sunday?', timestamp: `${caseDate}T17:55:00`, evidenceId: 'ev-chat-marcus-weekend' },
        { id: 'cm2', senderId: 'daniel', senderName: 'Daniel Mercer', text: 'Maybe — depends how tonight goes.', timestamp: `${caseDate}T17:56:00`, evidenceId: 'ev-chat-marcus-weekend' },
        { id: 'cm3', senderId: 'daniel', senderName: 'Daniel Mercer', text: 'If these Helix numbers go sideways before the review I\'m cooked.', timestamp: `${caseDate}T21:18:00`, evidenceId: 'ev-chat-marcus-stress' },
        { id: 'cm4', senderId: 'marcus', senderName: 'Marcus Mercer', text: 'You always say that. It\'ll be fine.', timestamp: `${caseDate}T21:20:00` },
        { id: 'cm5', senderId: 'daniel', senderName: 'Daniel Mercer', text: 'Yeah. Sure.', timestamp: `${caseDate}T21:21:00` },
      ],
    },
  ],

  // ─────────────────────────────────────────────
  // CALENDAR
  // ─────────────────────────────────────────────
  calendarEvents: [
    {
      id: 'cal-standup',
      title: 'Analytics stand-up',
      start: `${caseDate}T09:30:00`,
      end: `${caseDate}T09:45:00`,
      location: 'Zoom',
      description: 'Daily team stand-up',
      attendees: ['Sarah Chen', 'James Whitfield', 'Priya Nair'],
    },
    {
      id: 'cal-focus',
      title: 'Focus block — Helix Q3',
      start: `${caseDate}T13:00:00`,
      end: `${caseDate}T17:00:00`,
      location: 'Desk 3.14',
      description: 'Blocked for Helix finalisation',
    },
    {
      id: 'cal-deadline',
      title: 'DEADLINE: Helix portal submission',
      start: `${caseDate}T23:00:00`,
      end: `${caseDate}T23:15:00`,
      description: 'Client portal hard close',
      evidenceId: 'ev-calendar-deadline',
    },
    {
      id: 'cal-review',
      title: 'Performance Review — Sarah Chen',
      start: '2025-10-01T09:00:00',
      end: '2025-10-01T09:45:00',
      location: 'Meeting Room B / Hybrid',
      description: 'Annual mid-cycle review. Q3 delivery outcomes weighted heavily. Bring Helix case study.',
      attendees: ['Sarah Chen'],
      evidenceId: 'ev-calendar-review',
    },
    {
      id: 'cal-orion',
      title: 'Orion scoping call',
      start: '2025-10-01T11:00:00',
      end: '2025-10-01T11:45:00',
      location: 'Zoom',
      description: 'Preliminary scoping with Orion procurement',
    },
    {
      id: 'cal-dentist',
      title: 'Dentist — check-up',
      start: '2025-10-03T15:30:00',
      end: '2025-10-03T16:00:00',
      location: 'Marylebone Dental',
      evidenceId: 'ev-calendar-dentist',
    },
    {
      id: 'cal-mum',
      title: 'Mum\'s birthday dinner',
      start: '2025-10-05T18:00:00',
      end: '2025-10-05T21:00:00',
      location: 'Home',
      description: 'With Marcus — still need present',
    },
    {
      id: 'cal-1to1',
      title: '1:1 Sarah (cancelled)',
      start: `${caseDate}T16:00:00`,
      end: `${caseDate}T16:30:00`,
      description: 'Cancelled — Sarah travelling. Review moved to Wednesday.',
    },
  ],

  // ─────────────────────────────────────────────
  // NOTES
  // ─────────────────────────────────────────────
  notes: [
    {
      id: 'note-review',
      title: 'Review prep',
      body: `Review tomorrow 9am.

Sarah wants strong Helix numbers. Can't afford another miss after Q2 slippage.

Finish report tonight no matter what.

Talking points:
• Delivery reliability
• Client relationship with Tom
• Mentoring James on reconciliations`,
      createdAt: `${caseDate}T08:40:00`,
      modifiedAt: `${caseDate}T08:42:00`,
      evidenceId: 'ev-notes-review',
    },
    {
      id: 'note-scratch',
      title: 'Untitled',
      body: `James says −12%. If I send that… review… options:
1) tell Sarah
2) delay
3) …`,
      createdAt: `${caseDate}T21:55:00`,
      modifiedAt: `${caseDate}T21:56:00`,
      evidenceId: 'ev-notes-scratch',
    },
    {
      id: 'note-shopping',
      title: 'Shopping',
      body: `Milk
Bread
Dishwasher tablets
Bin bags
Toothpaste
Multi vitamins`,
      createdAt: '2025-09-28T19:00:00',
      modifiedAt: `${caseDate}T08:10:00`,
    },
    {
      id: 'note-passwords-hint',
      title: 'Desk wifi guest',
      body: `Guest wifi password for visitors: MeridianGuest2025
(Don't put real passwords here — IT policy)`,
      createdAt: '2025-08-01T10:00:00',
      modifiedAt: '2025-08-01T10:00:00',
    },
    {
      id: 'note-ideas',
      title: 'Q4 process improvements',
      body: `• Earlier ledger freeze for client packs
• Dual review on carryover items
• Template for portal upload checklist`,
      createdAt: '2025-09-12T16:00:00',
      modifiedAt: '2025-09-12T16:20:00',
    },
  ],

  // ─────────────────────────────────────────────
  // RECYCLE BIN
  // ─────────────────────────────────────────────
  recycleBin: [
    {
      id: 'recycle-report',
      name: 'Helix_Q3_Report_FINAL.xlsx',
      originalPath: '/Projects/Helix/Helix_Q3_Report_FINAL.xlsx',
      deletedAt: `${caseDate}T22:21:00`,
      type: 'spreadsheet',
      size: '198 KB',
      evidenceId: 'ev-recycle-report',
      content: `SHEET: Summary — Helix Q3 Report FINAL
─────────────────────────────────────────
Metric              Q3 2024    Q3 2025    YoY
Revenue (£000)      6,420      6,934      +8.0%
Gross Profit        2,568      2,857      +11.3%
Op. Margin          18.1%      19.0%      +0.9pp

SHEET: Executive Narrative
─────────────────────────────────────────
"Helix Corp delivered strong Q3 results with revenue growth of 8.0% year-on-year, driven by the Orion contract contribution and resilient services demand…"

INTERNAL COMMENT (hidden row):
prelim figures — pending James recon — DO NOT SUBMIT IF RECON FAILS

Deleted from: /Projects/Helix
Deleted at: 22:21
`,
    },
    {
      id: 'recycle-budget',
      name: 'personal_budget_2025.xlsx',
      originalPath: '/Personal/personal_budget_2025.xlsx',
      deletedAt: `${caseDate}T12:28:00`,
      type: 'spreadsheet',
      size: '34 KB',
      evidenceId: 'ev-recycle-budget',
      content: `Monthly budget (personal)

Rent          £1,450
Utilities     £120
Groceries     £350
Transport     £180
Savings       £400

Note to self: stop leaving personal finance on work PC.
`,
    },
    {
      id: 'recycle-old-draft',
      name: 'Helix_Q3_v3_OLD.xlsx',
      originalPath: '/Projects/Helix/drafts/Helix_Q3_v3_OLD.xlsx',
      deletedAt: '2025-09-29T18:40:00',
      type: 'spreadsheet',
      size: '150 KB',
      content: `Older draft from 29 Sep — superseded by working copy.
Revenue still listed as TBD.
`,
    },
    {
      id: 'recycle-screenshot',
      name: 'Screenshot_2025-09-30_1022.png',
      originalPath: '/Desktop/Screenshot_2025-09-30_1022.png',
      deletedAt: `${caseDate}T10:25:00`,
      type: 'image',
      size: '880 KB',
      content: '[Image] Screenshot of an Excel formula error dialog — mundane.',
    },
  ],

  resolution: {
    questions: [
      {
        id: 'q-what',
        prompt: 'What happened to the Helix Q3 report?',
        truthKey: 'whatHappened',
        options: [
          { id: 'accidentally_deleted', label: 'Daniel accidentally deleted the report', correct: false },
          { id: 'deliberately_deleted', label: 'Daniel deliberately deleted the report', correct: true },
          { id: 'someone_else', label: 'Someone else deleted the report from his machine', correct: false },
          { id: 'never_existed', label: 'The final report was never created', correct: false },
          { id: 'insufficient', label: 'Insufficient evidence to determine', correct: false },
        ],
      },
      {
        id: 'q-when',
        prompt: 'Approximately when was the report deleted?',
        truthKey: 'when',
        options: [
          { id: '12:28', label: 'Around 12:28 (lunchtime)', correct: false },
          { id: '20:55', label: 'Around 20:55', correct: false },
          { id: '22:21', label: 'Around 22:21', correct: true },
          { id: '22:28', label: 'Around 22:28', correct: false },
          { id: '22:35', label: 'Around 22:35', correct: false },
        ],
      },
      {
        id: 'q-why',
        prompt: 'Why did this happen?',
        truthKey: 'why',
        options: [
          { id: 'technical_glitch', label: 'A technical glitch / accidental file operation', correct: false },
          { id: 'hide_bad_numbers_before_review', label: 'To hide bad revenue figures ahead of his performance review', correct: true },
          { id: 'protect_james', label: 'To protect James from blame for the accounting error', correct: false },
          { id: 'client_pressure', label: 'Because the client asked him to delay submission', correct: false },
          { id: 'leave_company', label: 'As sabotage related to leaving the company', correct: false },
        ],
      },
    ],
  },
};

