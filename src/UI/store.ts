import { create } from 'zustand';
import { Piece, Tool, ToolName } from '../types';

interface AppState {
  selectedTool: ToolName;
  setSelectedTool: (tool: ToolName) => void;

  pieces: Piece[];
  addPiece: (piece: Piece) => void;
  setPieceName: (pieceId: Piece["id"], newName: Piece["name"]) => void;
  
  
}

export const useAppState = create<AppState>((set) => ({
  selectedTool: 'path',
  setSelectedTool: (tool) => set({ selectedTool: tool }),

  pieces: [],
  addPiece: (piece:Piece) => {
    set((state) => ({
      pieces: [...state.pieces, piece],
    }));
    // makeThumbnail(piece)
  },

  setPieceName: (pieceId: Piece["id"], newName: Piece["name"]) => {
    set((state) => ({
      pieces: state.pieces.map((piece) =>
        piece.id === pieceId ? { ...piece, name: newName } : piece
      ),
    }));
  }
}));
