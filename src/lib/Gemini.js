import { mockAnalysis, mockChatReply, mockSchedule } from './mockData';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Schema for structured output
const responseSchema = {
  type: 'object',
  properties: {
    subject: { type: 'string' },
    gradeLevel: { type: 'string' },
    summaryBullets: { type: 'array', items: { type: 'string' } },
    mermaidSyntax: { type: 'string' },
    mcqs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          options: { type: 'array', items: { type: 'string' } },
          correct: { type: 'integer' },
          explanation: { type: 'string' },
        },
        required: ['question', 'options', 'correct', 'explanation'],
      },
    },
    shortQuestions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
        },
        required: ['question', 'answer'],
      },
    },
    numericals: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          steps: { type: 'array', items: { type: 'string' } },
          finalAnswer: { type: 'string' },
        },
        required: ['question', 'steps', 'finalAnswer'],
      },
    },
  },
  required: ['subject', 'gradeLevel', 'summaryBullets', 'mermaidSyntax', 'mcqs', 'shortQuestions', 'numericals'],
};

// Helper to call Gemini with retry and fallback
export const callGemini = async (prompt, imageBase64 = null, pdfText = null) => {
  // Mock mode if no API key
  if (!API_KEY) {
    console.warn('No Gemini API key found. Using mock data.');
    return { analysis: mockAnalysis, mock: true };
  }

  const content = [];

  // Text prompt
  const textPart = {
    text: prompt,
  };

  // If image, add inline_data
  if (imageBase64) {
    content.push({
      inlineData: {
        mimeType: 'image/jpeg', // or png; we'll detect
        data: imageBase64,
      },
    });
  }

  // If PDF text, include it in prompt
  let fullPrompt = prompt;
  if (pdfText) {
    fullPrompt = `Here is the extracted text from a PDF study material:\n\n${pdfText}\n\n${prompt}`;
  }

  const requestBody = {
    contents: [
      {
        parts: [
          { text: fullPrompt },
          ...(imageBase64 ? [{ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }] : []),
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
    },
  };

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      if (response.status === 429) {
        // Rate limit – fallback to mock
        return { analysis: mockAnalysis, mock: true };
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const analysis = JSON.parse(text);
    return { analysis, mock: false };
  } catch (error) {
    console.error('Gemini call failed:', error);
    // Fallback to mock
    return { analysis: mockAnalysis, mock: true };
  }
};

export const generateChatReply = async (userMessage, context) => {
  if (!API_KEY) {
    return { reply: mockChatReply, mock: true };
  }

  const prompt = `
You are an AI tutor assisting with study material on the following topic:
${context}

The user asks: "${userMessage}"
Provide a helpful, concise, and clear response.`;

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    return { reply, mock: false };
  } catch (error) {
    console.error('Chat call failed:', error);
    return { reply: mockChatReply, mock: true };
  }
};

export const generateSchedule = async (analysis) => {
  if (!API_KEY) {
    return { schedule: mockSchedule, mock: true };
  }

  const prompt = `
Based on the following study material summary (subject: ${analysis.subject}, grade: ${analysis.gradeLevel}),
create a 3-day study schedule. Each day should have 3–4 tasks covering concept review, practice, and self-test.
Return JSON with a "days" array, each with "day" string and "tasks" array of strings.
`;

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt + '\n\nSummary: ' + analysis.summaryBullets.join(' ') }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              days: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    day: { type: 'string' },
                    tasks: { type: 'array', items: { type: 'string' } },
                  },
                  required: ['day', 'tasks'],
                },
              },
            },
            required: ['days'],
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Schedule API error: ${response.status}`);
    }

    const data = await response.json();
    const schedule = JSON.parse(data.candidates[0].content.parts[0].text);
    return { schedule, mock: false };
  } catch (error) {
    console.error('Schedule generation failed:', error);
    return { schedule: mockSchedule, mock: true };
  }
};
