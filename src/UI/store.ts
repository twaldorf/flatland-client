import { create } from 'zustand';
import { Piece, Tool, ToolName } from '../types';
import { Vector2 } from 'three';

interface Label {
  point: Vector2;
  piece: Piece;
}

interface AppState {
  selectedTool: ToolName;
  setSelectedTool: (tool: ToolName) => void;

  pieces: Piece[];
  addPiece: (piece: Piece) => void;
  setPieceName: (pieceId: Piece["id"], newName: Piece["name"]) => void;
  
  labelPiece: (labelPoint: Vector2, piece: Piece) => void;
  clearLabel: () => void;
  label: Label | undefined;
  
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
  },

  label: undefined,

  labelPiece: (labelPoint: Vector2, piece: Piece) => {
    set((state) => ({
      label: { point: labelPoint, piece: piece }
    }))
  },

  clearLabel: () => {
    set((state) => ({
      label: undefined
    }))
  }

}));
