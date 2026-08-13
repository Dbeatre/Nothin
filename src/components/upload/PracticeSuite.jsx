import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Check, X } from 'lucide-react';

export default function PracticeSuite({ mcqs, shortQuestions, numericals }) {
  return (
    <div className="space-y-8">
      {/* MCQs */}
      <div>
        <h4 className="font-semibold mb-3 text-accent-violet">Multiple Choice Questions</h4>
        <div className="space-y-4">
          {mcqs.map((mcq, idx) => (
            <MCQItem key={idx} mcq={mcq} index={idx} />
          ))}
        </div>
      </div>

      {/* Short Questions */}
      <div>
        <h4 className="font-semibold mb-3 text-accent-cyan">Short Questions</h4>
        <div className="space-y-3">
          {shortQuestions.map((sq, idx) => (
            <ShortQuestionItem key={idx} question={sq} index={idx} />
          ))}
        </div>
      </div>

      {/* Numericals */}
      <div>
        <h4 className="font-semibold mb-3 text-white/80">Numericals</h4>
        <div className="space-y-4">
          {numericals.map((num, idx) => (
            <NumericalItem key={idx} numerical={num} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MCQItem({ mcq, index }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (optionIndex) => {
    setSelected(optionIndex);
    setRevealed(true);
  };

  const isCorrect = (optionIndex) => revealed && optionIndex === mcq.correct;
  const isWrong = (optionIndex) => revealed && selected === optionIndex && optionIndex !== mcq.correct;

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-white/90">
        {index + 1}. {mcq.question}
      </p>
      <div className="grid grid-cols-1 gap-2">
        {mcq.options.map((opt, oi) => (
          <button
            key={oi}
            onClick={() => !revealed && handleSelect(oi)}
            disabled={revealed}
            className={`text-left px-4 py-2 rounded-xl text-sm transition-all ${
              isCorrect(oi)
                ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                : isWrong(oi)
                ? 'bg-red-500/20 border border-red-500/50 text-red-300'
                : revealed
                ? 'bg-white/5 text-white/40 cursor-default'
                : 'bg-white/5 hover:bg-white/10 text-white/80'
            }`}
          >
            <span className="flex items-center gap-2">
              {isCorrect(oi) && <Check className="w-4 h-4 text-green-400" />}
              {isWrong(oi) && <X className="w-4 h-4 text-red-400" />}
              {String.fromCharCode(65 + oi)}. {opt}
            </span>
          </button>
        ))}
      </div>
      {revealed && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-white/60 mt-1 pl-1"
        >
          {mcq.explanation}
        </motion.p>
      )}
    </div>
  );
}

function ShortQuestionItem({ question, index }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="bg-white/5 rounded-xl p-3">
      <p className="text-sm font-medium text-white/90">
        {index + 1}. {question.question}
      </p>
      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="mt-2 text-xs text-accent-cyan hover:underline flex items-center gap-1"
      >
        {showAnswer ? 'Hide answer' : 'Show answer'}
        {showAnswer ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-2 text-sm text-white/70 bg-white/5 p-2 rounded">{question.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NumericalItem({ numerical, index }) {
  const [stepIndex, setStepIndex] = useState(0);
  const totalSteps = numerical.steps.length;

  const revealNextStep = () => {
    if (stepIndex < totalSteps) setStepIndex(stepIndex + 1);
  };

  return (
    <div className="bg-white/5 rounded-xl p-3 space-y-2">
      <p className="text-sm font-medium text-white/90">
        {index + 1}. {numerical.question}
      </p>
      <div className="space-y-1 text-sm text-white/70">
        {numerical.steps.slice(0, stepIndex).map((step, si) => (
          <motion.div
            key={si}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="py-0.5"
          >
            {si + 1}. {step}
          </motion.div>
        ))}
      </div>
      {stepIndex < totalSteps ? (
        <button
          onClick={revealNextStep}
          className="text-xs text-accent-cyan hover:underline flex items-center gap-1"
        >
          Show next step <ChevronRight className="w-3 h-3" />
        </button>
      ) : (
        <p className="text-sm font-semibold text-accent-violet mt-1">
          Answer: {numerical.finalAnswer}
        </p>
      )}
    </div>
  );
}
