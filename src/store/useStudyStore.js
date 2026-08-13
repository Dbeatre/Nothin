import { create } from 'zustand';

export const useStudyStore = create((set) => ({
  // Analysis state
  analysis: null,
  setAnalysis: (analysis) => set({ analysis }),

  // Chat
  chatHistory: [],
  setChatHistory: (chatHistory) => set({ chatHistory }),
  addChatMessage: (message) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, message],
    })),

  // Schedule
  schedule: null,
  setSchedule: (schedule) => set({ schedule }),
  scheduleProgress: {},
  setScheduleProgress: (progress) => set({ scheduleProgress: progress }),
  updateScheduleProgress: (day, itemIndex, checked) =>
    set((state) => ({
      scheduleProgress: {
        ...state.scheduleProgress,
        [day]: {
          ...(state.scheduleProgress[day] || {}),
          [itemIndex]: checked,
        },
      },
    })),

  // UI
  activeTab: 0,
  setActiveTab: (index) => set({ activeTab: index }),

  // Mock mode
  isMockMode: false,
  setMockMode: (isMock) => set({ isMockMode: isMock }),

  // Upload state
  uploadedFile: null,
  setUploadedFile: (file) => set({ uploadedFile: file }),
  analysisLoading: false,
  setAnalysisLoading: (loading) => set({ analysisLoading: loading }),
  analysisError: null,
  setAnalysisError: (error) => set({ analysisError: error }),
}));
