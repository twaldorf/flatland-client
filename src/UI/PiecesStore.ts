import { create } from 'zustand';
import { Piece } from '../types';

// Store state "header" file
interface PiecesStore {

  pieces: Map<string, Piece>;

  addPiece: (piece: Piece) => void;
  setPieces: (pieces: Map<string, Piece>) => void;
  removePiece: (pieceId: string) => void;
  setPieceName: (pieceId: Piece["id"], newName: Piece["name"]) => void;

}

export const usePiecesStore = create<PiecesStore>((set, get) => ({
  
  pieces: new Map(),

  addPiece: (piece:Piece) => {
      set((state) => ({
        pieces: new Map(state.pieces).set(piece.id, piece),
      }));
    },

    setPieces: (pieces:Map<string, Piece>) => {
      set(() => ({
        pieces: pieces,
      }));
    },

    removePiece: (pieceId:string) => {
      set((state) => {
        state.pieces.delete(pieceId)
        return state
      });
    },
  
    setPieceName: (pieceId: string, newName: string) => {
      set((state) => {
        const newPiece = state.pieces.get(pieceId);
        
        if (!newPiece) return state;

        newPiece.name = newName;
        return { pieces: new Map(state.pieces).set(pieceId, newPiece) };
      });
    },
}));
