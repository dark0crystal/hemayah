// Simple store to share test data between pages
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TestDataPoint {
  'Civil ID': string;
  'Disability Description': string;
  'Disability Type': string;
  'Date Submitted': string;
}

interface TestDataStore {
  testData: TestDataPoint[];
  setTestData: (data: TestDataPoint[]) => void;
}

export const useTestDataStore = create<TestDataStore>()(
  persist(
    (set) => ({
      testData: [],
      setTestData: (data) => set({ testData: data }),
    }),
    {
      name: 'test-data-storage',
    }
  )
);