import { useState } from 'react';
import { useStudyStore } from '../../store/useStudyStore';
import { LayoutDashboard, MessageSquare, CalendarDays } from 'lucide-react';
import UploadBox from '../upload/UploadBox';
import AnalysisResults from '../upload/AnalysisResults';
import ChatWindow from '../chat/ChatWindow';
import ScheduleChecklist from '../schedule/ScheduleChecklist';

const tabs = [
  { id: 0, label: 'Upload & Analyze', icon: LayoutDashboard },
  { id: 1, label: 'AI Study Chat', icon: MessageSquare },
  { id: 2, label: '3-Day Schedule', icon: CalendarDays },
];

export default function DesktopShell() {
  const activeTab = useStudyStore((s) => s.activeTab);
  const setActiveTab = useStudyStore((s) => s.setActiveTab);

  return (
    <div className="min-h-screen bg-dark">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold gradient-text">StudyPulse AI</h1>
          <nav className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {activeTab === 0 && (
          <>
            <UploadBox />
            <AnalysisResults />
          </>
        )}
        {activeTab === 1 && <ChatWindow />}
        {activeTab === 2 && <ScheduleChecklist />}
      </main>
    </div>
  );
}
