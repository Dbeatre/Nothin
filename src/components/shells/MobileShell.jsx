import { useStudyStore } from '../../store/useStudyStore';
import { LayoutDashboard, MessageSquare, CalendarDays } from 'lucide-react';
import UploadBox from '../upload/UploadBox';
import AnalysisResults from '../upload/AnalysisResults';
import ChatWindow from '../chat/ChatWindow';
import ScheduleChecklist from '../schedule/ScheduleChecklist';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 0, label: 'Analyze', icon: LayoutDashboard },
  { id: 1, label: 'Chat', icon: MessageSquare },
  { id: 2, label: 'Schedule', icon: CalendarDays },
];

export default function MobileShell() {
  const activeTab = useStudyStore((s) => s.activeTab);
  const setActiveTab = useStudyStore((s) => s.setActiveTab);

  return (
    <div className="min-h-screen pb-20 safe-bottom">
      {/* Main content */}
      <div className="px-4 py-4 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <UploadBox />
              <AnalysisResults />
            </motion.div>
          )}
          {activeTab === 1 && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <ChatWindow />
            </motion.div>
          )}
          {activeTab === 2 && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <ScheduleChecklist />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
        <div className="glass-card rounded-none rounded-t-3xl border-x-0 border-b-0 px-2 py-2 flex justify-around items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[60px] relative"
            >
              <tab.icon
                className={`w-6 h-6 transition-colors ${
                  activeTab === tab.id ? 'text-accent-violet' : 'text-white/50'
                }`}
              />
              <span
                className={`text-[10px] font-medium ${
                  activeTab === tab.id ? 'text-white' : 'text-white/40'
                }`}
              >
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -top-1 w-8 h-0.5 bg-gradient-to-r from-accent-violet to-accent-cyan rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
