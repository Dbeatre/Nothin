import { useEffect } from 'react';
import { useStudyStore } from './store/useStudyStore';
import DesktopShell from './components/shells/DesktopShell';
import MobileShell from './components/shells/MobileShell';
import { loadFromStorage } from './lib/storage';

function App() {
  const setAnalysis = useStudyStore((s) => s.setAnalysis);
  const setChatHistory = useStudyStore((s) => s.setChatHistory);
  const setSchedule = useStudyStore((s) => s.setSchedule);
  const setScheduleProgress = useStudyStore((s) => s.setScheduleProgress);

  useEffect(() => {
    // Load persisted state
    const analysis = loadFromStorage('lastAnalysis');
    const chat = loadFromStorage('chatHistory');
    const schedule = loadFromStorage('schedule');
    const progress = loadFromStorage('scheduleProgress');
    if (analysis) setAnalysis(analysis);
    if (chat) setChatHistory(chat);
    if (schedule) setSchedule(schedule);
    if (progress) setScheduleProgress(progress);
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white font-sans antialiased">
      <div className="hidden md:block h-screen overflow-y-auto">
        <DesktopShell />
      </div>
      <div className="block md:hidden h-screen overflow-y-auto pb-safe">
        <MobileShell />
      </div>
    </div>
  );
}

export default App;
