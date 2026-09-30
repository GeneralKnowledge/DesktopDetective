export type EvidenceImportance = 'critical' | 'supporting' | 'red_herring';

export type EvidenceType =
  | 'email'
  | 'file'
  | 'browser'
  | 'chat'
  | 'calendar'
  | 'note'
  | 'recycle'
  | 'other';

export type AppId =
  | 'mail'
  | 'files'
  | 'browser'
  | 'chat'
  | 'calendar'
  | 'notes'
  | 'recycle'
  | 'search'
  | 'board'
  | 'notebook'
  | 'resolve';

export interface Person {
  id: string;
  name: string;
  role: string;
  email?: string;
  relationship: string;
}

export interface Evidence {
  id: string;
  type: EvidenceType;
  timestamp?: string;
  title: string;
  content: string;
  importance: EvidenceImportance;
  relatedPeople: string[];
  relatedEvidence: string[];
  reveals?: string[];
  sourceId?: string;
}

export interface Email {
  id: string;
  folder: 'inbox' | 'sent' | 'drafts';
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  evidenceId?: string;
}

export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'text' | 'spreadsheet' | 'image' | 'pdf' | 'other';
  createdAt: string;
  modifiedAt: string;
  size: string;
  content?: string;
  parentId: string | null;
  evidenceId?: string;
}

export interface BrowserEntry {
  id: string;
  type: 'history' | 'search' | 'bookmark';
  title: string;
  url: string;
  timestamp?: string;
  evidenceId?: string;
}

export interface ChatThread {
  id: string;
  contactId: string;
  contactName: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  evidenceId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
  attendees?: string[];
  evidenceId?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  modifiedAt: string;
  evidenceId?: string;
}

export interface RecycleItem {
  id: string;
  name: string;
  originalPath: string;
  deletedAt: string;
  type: 'text' | 'spreadsheet' | 'image' | 'pdf' | 'other';
  content?: string;
  size: string;
  evidenceId?: string;
}

export interface ResolutionOption {
  id: string;
  label: string;
  correct: boolean;
}

export interface ResolutionQuestion {
  id: string;
  prompt: string;
  options: ResolutionOption[];
  truthKey: 'whatHappened' | 'when' | 'why';
}

export interface CaseDefinition {
  id: string;
  title: string;
  subject: Person;
  premise: string;
  briefing: string;
  incidentDate: string;
  truth: {
    whatHappened: string;
    when: string;
    why: string;
    summary: string;
  };
  people: Person[];
  evidence: Evidence[];
  emails: Email[];
  files: FileItem[];
  browserHistory: BrowserEntry[];
  chats: ChatThread[];
  calendarEvents: CalendarEvent[];
  notes: NoteItem[];
  recycleBin: RecycleItem[];
  resolution: {
    questions: ResolutionQuestion[];
  };
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}

export interface PinnedEvidence {
  evidenceId: string;
  pinnedAt: string;
  note?: string;
}

export interface NotebookEntry {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  linkedEvidenceIds: string[];
}

export interface InvestigationState {
  discoveredEvidenceIds: string[];
  pinnedEvidence: PinnedEvidence[];
  notebookEntries: NotebookEntry[];
  resolutionAnswers: Record<string, string>;
  selectedSupportEvidence: string[];
  hasSubmitted: boolean;
  submissionResult: SubmissionResult | null;
}

export interface SubmissionResult {
  whatCorrect: boolean;
  whenCorrect: boolean;
  whyCorrect: boolean;
  strongEvidenceUsed: string[];
  weakEvidenceUsed: string[];
  missedCritical: string[];
  feedbackTier: 'correct' | 'mostly_supported' | 'partially_supported' | 'unsupported';
  message: string;
  details: string[];
}
