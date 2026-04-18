import { create } from 'zustand';
import { MedicalReport, ChatMessage } from '@/types/health';

interface StoreState {
  apiKey: string | null;
  reports: MedicalReport[];
  chatMessages: ChatMessage[];
  isProcessing: boolean;
  demoMode: boolean;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  addReport: (report: MedicalReport) => void;
  updateReport: (id: number, updates: Partial<MedicalReport>) => void;
  removeReport: (id: number) => void;
  setReports: (reports: MedicalReport[]) => void;
  setDemoMode: (enabled: boolean) => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  setIsProcessing: (processing: boolean) => void;
  clearAllData: () => void;
}

const getStoredApiKey = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hb_api_key');
};

export const useStore = create<StoreState>((set) => ({
  apiKey: getStoredApiKey(),
  reports: [],
  chatMessages: [],
  isProcessing: false,
  demoMode: false,

  setApiKey: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hb_api_key', key);
    }
    set({ apiKey: key });
  },

  clearApiKey: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hb_api_key');
    }
    set({ apiKey: null });
  },

  addReport: (report: MedicalReport) =>
    set((state) => ({ reports: [...state.reports, report] })),

  updateReport: (id: number, updates: Partial<MedicalReport>) =>
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  removeReport: (id: number) =>
    set((state) => ({
      reports: state.reports.filter((r) => r.id !== id),
    })),

  setReports: (reports: MedicalReport[]) => set({ reports }),

  setDemoMode: (enabled: boolean) => set({ demoMode: enabled }),

  addChatMessage: (message: ChatMessage) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),

  setChatMessages: (messages: ChatMessage[]) => set({ chatMessages: messages }),

  setIsProcessing: (processing: boolean) => set({ isProcessing: processing }),

  clearAllData: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hb_api_key');
    }
    set({
      apiKey: null,
      reports: [],
      chatMessages: [],
      isProcessing: false,
      demoMode: false,
    });
  },
}));
