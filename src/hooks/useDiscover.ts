import { useEffect } from 'react';
import { useCase } from '@/investigation/CaseProvider';

/** Marks evidence as discovered when the player views related content. */
export function useDiscover(evidenceId?: string) {
  const { discoverEvidence } = useCase();
  useEffect(() => {
    if (evidenceId) discoverEvidence(evidenceId);
  }, [evidenceId, discoverEvidence]);
}
