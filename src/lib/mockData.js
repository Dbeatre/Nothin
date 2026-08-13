export const mockAnalysis = {
  subject: 'Physics',
  gradeLevel: 'Grade 11',
  summaryBullets: [
    'Newton\'s First Law (Inertia): objects remain at rest or uniform motion unless acted upon.',
    'Newton\'s Second Law (F=ma): acceleration is proportional to net force and inversely to mass.',
    'Newton\'s Third Law: every action has an equal and opposite reaction.',
    'Applications: friction, tension, normal force, and free-body diagrams.',
  ],
  mermaidSyntax: `graph TD
    A[Newton's Laws] --> B[First Law]
    A --> C[Second Law]
    A --> D[Third Law]
    B --> E[Inertia]
    C --> F[F=ma]
    D --> G[Action-Reaction]
    E --> H[Examples]
    F --> H
    G --> H`,
  mcqs: [
    {
      question: 'What is the SI unit of force?',
      options: ['Newton', 'Joule', 'Pascal', 'Watt'],
      correct: 0,
      explanation: 'The newton (N) is the SI unit of force.',
    },
    {
      question: 'Which law explains why a seatbelt is important?',
      options: ['First Law', 'Second Law', 'Third Law', 'None'],
      correct: 0,
      explanation: 'First law (inertia) – your body continues moving forward during sudden stop.',
    },
    {
      question: 'If mass doubles, acceleration halves for the same force. Which law?',
      options: ['First', 'Second', 'Third', 'Gravitational'],
      correct: 1,
      explanation: 'Second law: a = F/m, so doubling m halves a.',
    },
  ],
  shortQuestions: [
    {
      question: 'Define inertia.',
      answer: 'Inertia is the resistance of an object to change its state of motion.',
    },
    {
      question: 'State Newton\'s third law.',
      answer: 'For every action, there is an equal and opposite reaction.',
    },
  ],
  numericals: [
    {
      question: 'A 5 kg block is pushed with a force of 20 N. Calculate acceleration (ignoring friction).',
      steps: [
        'Use Newton\'s second law: F = m * a',
        'Rearrange: a = F / m',
        'Substitute: a = 20 N / 5 kg = 4 m/s²',
      ],
      finalAnswer: '4 m/s²',
    },
    {
      question: 'A car accelerates from rest to 20 m/s in 5 s. What is the net force if mass is 1000 kg?',
      steps: [
        'Calculate acceleration: a = (v - u)/t = (20 - 0)/5 = 4 m/s²',
        'Apply F = m * a = 1000 * 4 = 4000 N',
      ],
      finalAnswer: '4000 N',
    },
  ],
};

export const mockChatReply = "Sure! Let me explain Newton's laws more simply. Imagine you're on a skateboard – if you push off, you move; if you hit a wall, you stop (that's inertia). The harder you push, the faster you go (F=ma). And if you push someone else, they push back equally (third law). Need more examples?";

export const mockSchedule = {
  days: [
    {
      day: 'Day 1',
      tasks: [
        'Review Newton\'s First Law – watch a video',
        'Practice free-body diagrams (5 problems)',
        'Take a short quiz on inertia',
      ],
    },
    {
      day: 'Day 2',
      tasks: [
        'Study Newton\'s Second Law – solve 10 F=ma problems',
        'Work through numerical examples',
        'Self-test with MCQs',
      ],
    },
    {
      day: 'Day 3',
      tasks: [
        'Review all three laws and connections',
        'Solve mixed problems',
        'Explain concepts to a friend (or yourself)',
      ],
    },
  ],
};
