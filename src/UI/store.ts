import { create } from 'zustand';
import { Piece, Tool, ToolName } from '../types';

interface AppState {
  selectedTool: ToolName;
  setSelectedTool: (tool: ToolName) => void;

  pieces: Piece[];
  addPiece: (piece: Piece) => void;
}

export const useAppState = create<AppState>((set) => ({
  selectedTool: 'path',
  setSelectedTool: (tool) => set({ selectedTool: tool }),

  pieces: [],
  addPiece: (piece) => {
    set((state) => ({
      pieces: [...state.pieces, piece],
    }));
    // makeThumbnail(piece)
  }
}));
