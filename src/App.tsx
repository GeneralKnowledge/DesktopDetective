import { CaseProvider } from '@/investigation/CaseProvider';
import { Desktop } from '@/desktop/Desktop';

export default function App() {
  return (
    <CaseProvider>
      <Desktop />
    </CaseProvider>
  );
}
