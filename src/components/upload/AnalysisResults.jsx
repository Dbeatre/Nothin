import { useStudyStore } from '../../store/useStudyStore';
import GlassCard from '../ui/GlassCard';
import MindMap from './MindMap';
import PracticeSuite from './PracticeSuite';

export default function AnalysisResults() {
  const analysis = useStudyStore((s) => s.analysis);
  const isMockMode = useStudyStore((s) => s.isMockMode);
  const loading = useStudyStore((s) => s.analysisLoading);
  const error = useStudyStore((s) => s.analysisError);

  if (loading) {
    return (
      <GlassCard className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-12 h-12 border-4 border-accent-violet border-t-transparent rounded-full animate-spin" />
        <p className="text-white/60">Analyzing your material...</p>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className="border-red-500/30 bg-red-500/10">
        <p className="text-red-400">Error: {error}</p>
        <p className="text-sm text-white/40 mt-2">Please try again or use mock mode if API key is missing.</p>
      </GlassCard>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {isMockMode && (
        <div className="text-center text-xs text-accent-cyan/80 bg-white/5 rounded-full py-1 px-4 w-fit mx-auto">
          ⚡ Demo Mode (mock data)
        </div>
      )}

      {/* Subject & Grade */}
      <GlassCard className="flex flex-wrap items-center gap-3">
        <span className="px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium">
          {analysis.subject}
        </span>
        <span className="px-4 py-1.5 rounded-full border border-accent-violet/30 text-sm font-medium text-accent-violet">
          {analysis.gradeLevel}
        </span>
      </GlassCard>

      {/* Summary */}
      <GlassCard>
        <h3 className="text-lg font-heading font-semibold mb-3">Summary</h3>
        <ul className="list-disc list-inside space-y-1 text-white/80">
          {analysis.summaryBullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </ul>
      </GlassCard>

      {/* Mind Map */}
      <GlassCard>
        <h3 className="text-lg font-heading font-semibold mb-3">Mind Map</h3>
        <MindMap mermaidSyntax={analysis.mermaidSyntax} />
      </GlassCard>

      {/* Practice Suite */}
      <GlassCard>
        <h3 className="text-lg font-heading font-semibold mb-3">Practice Suite</h3>
        <PracticeSuite
          mcqs={analysis.mcqs}
          shortQuestions={analysis.shortQuestions}
          numericals={analysis.numericals}
        />
      </GlassCard>
    </div>
  );
}
