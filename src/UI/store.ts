import { create } from 'zustand';
import { Tool, ToolName } from '../types';

interface AppState {
  selectedTool: ToolName;
  setSelectedTool: (tool: ToolName) => void;
}

export const useAppState = create<AppState>((set) => ({
  selectedTool: 'select',
  setSelectedTool: (tool) => set({ selectedTool: tool }),
}));
