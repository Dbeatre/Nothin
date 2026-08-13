import { useEffect, useState } from 'react';
import { useStudyStore } from '../../store/useStudyStore';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';
import { generateSchedule } from '../../lib/gemini';
import { saveToStorage } from '../../lib/storage';
import { Check, RefreshCw } from 'lucide-react';

export default function ScheduleChecklist() {
  const analysis = useStudyStore((s) => s.analysis);
  const schedule = useStudyStore((s) => s.schedule);
  const setSchedule = useStudyStore((s) => s.setSchedule);
  const progress = useStudyStore((s) => s.scheduleProgress);
  const updateProgress = useStudyStore((s) => s.updateScheduleProgress);
  const isMockMode = useStudyStore((s) => s.isMockMode);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!schedule && analysis) {
      generateScheduleFromAnalysis();
    }
  }, [analysis]);

  const generateScheduleFromAnalysis = async () => {
    if (!analysis) return;
    setLoading(true);
    try {
      const result = await generateSchedule(analysis);
      setSchedule(result.schedule);
      saveToStorage('schedule', result.schedule);
      if (result.mock) {
        useStudyStore.getState().setMockMode(true);
      }
    } catch (error) {
      console.error('Schedule generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (dayIndex, taskIndex) => {
    const key = `day${dayIndex}`;
    const current = progress[key] || {};
    const newChecked = !current[taskIndex];
    updateProgress(dayIndex, taskIndex, newChecked);
    // Save progress
    const updatedProgress = {
      ...progress,
      [key]: { ...current, [taskIndex]: newChecked },
    };
    saveToStorage('scheduleProgress', updatedProgress);
  };

  const getDayProgress = (dayIndex) => {
    const key = `day${dayIndex}`;
    const tasks = schedule.days[dayIndex]?.tasks || [];
    const checked = Object.keys(progress[key] || {}).filter(k => progress[key][k]).length;
    return { total: tasks.length, done: checked };
  };

  if (!analysis) {
    return (
      <GlassCard className="text-center py-8">
        <p className="text-white/60">Please upload and analyze material first.</p>
      </GlassCard>
    );
  }

  if (loading) {
    return (
      <GlassCard className="flex flex-col items-center py-8 space-y-4">
        <div className="w-10 h-10 border-4 border-accent-violet border-t-transparent rounded-full animate-spin" />
        <p className="text-white/60">Generating your study schedule...</p>
      </GlassCard>
    );
  }

  if (!schedule) {
    return (
      <GlassCard className="text-center py-8">
        <p className="text-white/60 mb-4">No schedule generated yet.</p>
        <GradientButton onClick={generateScheduleFromAnalysis}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Schedule
        </GradientButton>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {isMockMode && (
        <div className="text-center text-xs text-accent-cyan/80 bg-white/5 rounded-full py-1 px-4 w-fit mx-auto">
          ⚡ Demo Mode (mock schedule)
        </div>
      )}
      {schedule.days.map((day, dayIdx) => {
        const { total, done } = getDayProgress(dayIdx);
        const percent = total > 0 ? Math.round((done / total) * 100) : 0;
        return (
          <GlassCard key={dayIdx}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading font-semibold">{day.day}</h3>
              <span className="text-sm text-white/40">{done}/{total} done</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-accent-violet to-accent-cyan transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
            <ul className="space-y-2">
              {day.tasks.map((task, taskIdx) => {
                const isChecked = progress[`day${dayIdx}`]?.[taskIdx] || false;
                return (
                  <li key={taskIdx} className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTask(dayIdx, taskIdx)}
                      className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isChecked
                          ? 'border-accent-violet bg-accent-violet/20 text-accent-violet'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </button>
                    <span className={`text-sm ${isChecked ? 'line-through text-white/30' : 'text-white/80'}`}>
                      {task}
                    </span>
                  </li>
                );
              })}
            </ul>
          </GlassCard>
        );
      })}
      <div className="text-xs text-white/30 text-center">
        Progress is saved locally.
      </div>
    </div>
  );
}
