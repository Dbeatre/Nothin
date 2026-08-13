const chips = [
  'Give me 3 more MCQs',
  'Explain in simple terms',
  'Create a quiz',
  'Summarize in 1 line',
];

export default function PromptChips({ onChipClick }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onChipClick(chip)}
          className="flex-shrink-0 px-3 py-1 rounded-full text-xs bg-white/5 hover:bg-white/10 text-white/70 transition-colors border border-white/10"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
