import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { missingReportCase } from '@/cases/missing-report';
import type {
  AppId,
  CaseDefinition,
  InvestigationState,
  NotebookEntry,
  PinnedEvidence,
  SubmissionResult,
  WindowState,
} from '@/types';
import { evaluateSubmission } from '@/utils/case';

const STORAGE_KEY = 'desktop-detective:missing-report:v1';

const APP_META: Record<AppId, { title: string; defaultWidth: number; defaultHeight: number }> = {
  mail: { title: 'Mail', defaultWidth: 820, defaultHeight: 560 },
  files: { title: 'Files', defaultWidth: 780, defaultHeight: 520 },
  browser: { title: 'Browser', defaultWidth: 800, defaultHeight: 540 },
  chat: { title: 'Messages', defaultWidth: 720, defaultHeight: 520 },
  calendar: { title: 'Calendar', defaultWidth: 760, defaultHeight: 540 },
  notes: { title: 'Notes', defaultWidth: 640, defaultHeight: 480 },
  recycle: { title: 'Recycle Bin', defaultWidth: 640, defaultHeight: 440 },
  search: { title: 'Search', defaultWidth: 680, defaultHeight: 480 },
  board: { title: 'Investigation Board', defaultWidth: 720, defaultHeight: 500 },
  notebook: { title: 'Detective Notebook', defaultWidth: 560, defaultHeight: 440 },
  resolve: { title: 'Submit Investigation', defaultWidth: 640, defaultHeight: 560 },
};

function emptyInvestigation(): InvestigationState {
  return {
    discoveredEvidenceIds: [],
    pinnedEvidence: [],
    notebookEntries: [],
    resolutionAnswers: {},
    selectedSupportEvidence: [],
    hasSubmitted: false,
    submissionResult: null,
  };
}

function loadState(): InvestigationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyInvestigation();
    return { ...emptyInvestigation(), ...JSON.parse(raw) };
  } catch {
    return emptyInvestigation();
  }
}

interface CaseContextValue {
  caseData: CaseDefinition;
  investigation: InvestigationState;
  windows: WindowState[];
  activeWindowId: string | null;
  bootDone: boolean;
  debugOpen: boolean;
  clock: Date;
  setBootDone: (v: boolean) => void;
  setDebugOpen: (v: boolean) => void;
  openApp: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
  discoverEvidence: (evidenceId?: string) => void;
  pinEvidence: (evidenceId: string) => void;
  unpinEvidence: (evidenceId: string) => void;
  isPinned: (evidenceId: string) => boolean;
  addNotebookEntry: (text: string, linkedEvidenceIds?: string[]) => void;
  updateNotebookEntry: (id: string, text: string) => void;
  deleteNotebookEntry: (id: string) => void;
  setResolutionAnswer: (questionId: string, optionId: string) => void;
  toggleSupportEvidence: (evidenceId: string) => void;
  submitInvestigation: () => SubmissionResult;
  resetCase: () => void;
  revealAllEvidence: () => void;
}

const CaseContext = createContext<CaseContextValue | null>(null);

export function CaseProvider({ children }: { children: ReactNode }) {
  const caseData = missingReportCase;
  const [investigation, setInvestigation] = useState<InvestigationState>(loadState);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [bootDone, setBootDone] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [zCounter, setZCounter] = useState(10);
  const [clock, setClock] = useState(() => new Date(`${caseData.incidentDate}T22:45:00`));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(investigation));
  }, [investigation]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setDebugOpen((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openAppInternal('search');
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        openAppInternal('board');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zCounter, windows]);

  useEffect(() => {
    const t = setInterval(() => {
      setClock((c) => new Date(c.getTime() + 1000));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const openAppInternal = useCallback(
    (appId: AppId) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.appId === appId);
        if (existing) {
          const nextZ = zCounter + 1;
          setZCounter(nextZ);
          setActiveWindowId(existing.id);
          return prev.map((w) =>
            w.id === existing.id ? { ...w, minimized: false, zIndex: nextZ } : w,
          );
        }
        const meta = APP_META[appId];
        const nextZ = zCounter + 1;
        setZCounter(nextZ);
        const id = `win-${appId}-${Date.now()}`;
        const offset = (prev.length % 6) * 28;
        const win: WindowState = {
          id,
          appId,
          title: meta.title,
          x: 80 + offset,
          y: 48 + offset,
          width: meta.defaultWidth,
          height: meta.defaultHeight,
          minimized: false,
          maximized: false,
          zIndex: nextZ,
        };
        setActiveWindowId(id);
        return [...prev, win];
      });
    },
    [zCounter],
  );

  const openApp = openAppInternal;

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindowId((cur) => (cur === id ? null : cur));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
    setActiveWindowId((cur) => (cur === id ? null : cur));
  }, []);

  const focusWindow = useCallback(
    (id: string) => {
      const nextZ = zCounter + 1;
      setZCounter(nextZ);
      setActiveWindowId(id);
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, minimized: false, zIndex: nextZ } : w)),
      );
    },
    [zCounter],
  );

  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized, minimized: false } : w)),
    );
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resizeWindow = useCallback((id: string, width: number, height: number) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, width: Math.max(420, width), height: Math.max(280, height) }
          : w,
      ),
    );
  }, []);

  const discoverEvidence = useCallback((evidenceId?: string) => {
    if (!evidenceId) return;
    setInvestigation((prev) => {
      if (prev.discoveredEvidenceIds.includes(evidenceId)) return prev;
      return {
        ...prev,
        discoveredEvidenceIds: [...prev.discoveredEvidenceIds, evidenceId],
      };
    });
  }, []);

  const pinEvidence = useCallback(
    (evidenceId: string) => {
      discoverEvidence(evidenceId);
      setInvestigation((prev) => {
        if (prev.pinnedEvidence.some((p) => p.evidenceId === evidenceId)) return prev;
        const pin: PinnedEvidence = {
          evidenceId,
          pinnedAt: new Date().toISOString(),
        };
        return { ...prev, pinnedEvidence: [...prev.pinnedEvidence, pin] };
      });
    },
    [discoverEvidence],
  );

  const unpinEvidence = useCallback((evidenceId: string) => {
    setInvestigation((prev) => ({
      ...prev,
      pinnedEvidence: prev.pinnedEvidence.filter((p) => p.evidenceId !== evidenceId),
      selectedSupportEvidence: prev.selectedSupportEvidence.filter((id) => id !== evidenceId),
    }));
  }, []);

  const isPinned = useCallback(
    (evidenceId: string) => investigation.pinnedEvidence.some((p) => p.evidenceId === evidenceId),
    [investigation.pinnedEvidence],
  );

  const addNotebookEntry = useCallback((text: string, linkedEvidenceIds: string[] = []) => {
    const entry: NotebookEntry = {
      id: `note-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      linkedEvidenceIds,
    };
    setInvestigation((prev) => ({
      ...prev,
      notebookEntries: [entry, ...prev.notebookEntries],
    }));
  }, []);

  const updateNotebookEntry = useCallback((id: string, text: string) => {
    setInvestigation((prev) => ({
      ...prev,
      notebookEntries: prev.notebookEntries.map((n) =>
        n.id === id ? { ...n, text, updatedAt: new Date().toISOString() } : n,
      ),
    }));
  }, []);

  const deleteNotebookEntry = useCallback((id: string) => {
    setInvestigation((prev) => ({
      ...prev,
      notebookEntries: prev.notebookEntries.filter((n) => n.id !== id),
    }));
  }, []);

  const setResolutionAnswer = useCallback((questionId: string, optionId: string) => {
    setInvestigation((prev) => ({
      ...prev,
      resolutionAnswers: { ...prev.resolutionAnswers, [questionId]: optionId },
      hasSubmitted: false,
      submissionResult: null,
    }));
  }, []);

  const toggleSupportEvidence = useCallback((evidenceId: string) => {
    setInvestigation((prev) => {
      const has = prev.selectedSupportEvidence.includes(evidenceId);
      return {
        ...prev,
        selectedSupportEvidence: has
          ? prev.selectedSupportEvidence.filter((id) => id !== evidenceId)
          : [...prev.selectedSupportEvidence, evidenceId],
      };
    });
  }, []);

  const submitInvestigation = useCallback(() => {
    const result = evaluateSubmission(
      caseData,
      investigation.resolutionAnswers,
      investigation.selectedSupportEvidence,
    );
    setInvestigation((prev) => ({
      ...prev,
      hasSubmitted: true,
      submissionResult: result,
    }));
    return result;
  }, [caseData, investigation.resolutionAnswers, investigation.selectedSupportEvidence]);

  const resetCase = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setInvestigation(emptyInvestigation());
    setWindows([]);
    setActiveWindowId(null);
    setBootDone(false);
    setClock(new Date(`${caseData.incidentDate}T22:45:00`));
  }, [caseData.incidentDate]);

  const revealAllEvidence = useCallback(() => {
    setInvestigation((prev) => ({
      ...prev,
      discoveredEvidenceIds: caseData.evidence.map((e) => e.id),
    }));
  }, [caseData.evidence]);

  const value = useMemo<CaseContextValue>(
    () => ({
      caseData,
      investigation,
      windows,
      activeWindowId,
      bootDone,
      debugOpen,
      clock,
      setBootDone,
      setDebugOpen,
      openApp,
      closeWindow,
      minimizeWindow,
      focusWindow,
      toggleMaximize,
      moveWindow,
      resizeWindow,
      discoverEvidence,
      pinEvidence,
      unpinEvidence,
      isPinned,
      addNotebookEntry,
      updateNotebookEntry,
      deleteNotebookEntry,
      setResolutionAnswer,
      toggleSupportEvidence,
      submitInvestigation,
      resetCase,
      revealAllEvidence,
    }),
    [
      caseData,
      investigation,
      windows,
      activeWindowId,
      bootDone,
      debugOpen,
      clock,
      openApp,
      closeWindow,
      minimizeWindow,
      focusWindow,
      toggleMaximize,
      moveWindow,
      resizeWindow,
      discoverEvidence,
      pinEvidence,
      unpinEvidence,
      isPinned,
      addNotebookEntry,
      updateNotebookEntry,
      deleteNotebookEntry,
      setResolutionAnswer,
      toggleSupportEvidence,
      submitInvestigation,
      resetCase,
      revealAllEvidence,
    ],
  );

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
}

export function useCase() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error('useCase must be used within CaseProvider');
  return ctx;
}
