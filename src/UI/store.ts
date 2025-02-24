import { create } from 'zustand';
import { Tool, ToolName } from '../types';

// This could be moved
export interface Piece {
  shapeIndex: number;
  name: string;
  // name is also the key to thhe thumbnail map
  // area: number;
}

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
