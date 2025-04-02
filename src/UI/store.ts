import { create } from 'zustand';
import { Piece, Tool, ToolName } from '../types';
import { Vector2 } from 'three';
import { PathToolCommand } from '../2D/commands/PathToolCommand';
import { pushCommand } from '../Command';
import { GenericAddPointCommand } from '../2D/commands/Generic/GenericAddPointCommand';
import { GenericDeletePointCommand } from '../2D/commands/Generic/GenericDeletePointCommand';
import { GenericUpdatePointCommand } from '../2D/commands/Generic/GenericUpdatePointCommand';

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
  
  pointer: Vector2;
  tool: { name: string };
  setPointer: (point: Vector2) => void;

  shapePoints: Vector2[];
  syncShapePoints: (points: Vector2[]) => void;
  addShapePoint: (point: Vector2) => void;

  updatePoint: (index: number, point: Vector2) => void;
  deletePoint: (index: number) => void;
  insertPoint: (index: number, point: Vector2) => void;
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
  },

  pointer: new Vector2(0, 0),
  tool: { name: "select" },

  setPointer: (point) => { set({ pointer: point }) },

  shapePoints: [],
  syncShapePoints: (points: Vector2[]) => {
    set({
      shapePoints: points
    })
  },

  addShapePoint: (point: Vector2) => {
    set((state) => ({ shapePoints: [ ...state.shapePoints, point ] }) )
  },

  updatePoint: (index, point) => set((state) => {
    pushCommand( new GenericUpdatePointCommand( index, point ) );
    const points = [...state.shapePoints];
    points[index] = point;
    return { shapePoints: points };
  }),

  deletePoint: (index) => set((state) => {
    pushCommand( new GenericDeletePointCommand( index ) );
    const points = state.shapePoints.filter((_, i) => i !== index);
    return { shapePoints: points };
  }),

  insertPoint: (index, point) => set((state) => {
    // points.splice(index + 1, 0, point);
    pushCommand(new GenericAddPointCommand( index + 1, point ));
    const points = [ ...state.shapePoints ];
    return { shapePoints: points };
  }),

}));
