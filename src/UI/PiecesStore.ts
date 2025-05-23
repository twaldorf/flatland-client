import { create } from 'zustand';
import { Piece } from '../types';

// Store state "header" file
interface PiecesStore {

  pieces: Map<string, Piece>;
  selectedPiece: string | undefined;

  addPiece: (piece: Piece) => void;
  // getPiece: (pieceId: string) => Piece;
  setPieces: (pieces: Map<string, Piece>) => void;
  removePiece: (pieceId: string) => void;
  setPieceName: (pieceId: Piece["id"], newName: Piece["name"]) => void;
  setSelectedPiece: (pieceId:string) => void;

  updatePieceField: <K extends keyof Piece>(
    pieceId: string,
    field: K,
    value: Piece[K]
  ) => void

  setPieceSeamAllowance: (pieceId: string, value:number) => void;

}

export const usePiecesStore = create<PiecesStore>((set, get) => ({
  
  pieces: new Map(),
  selectedPiece: undefined,

  addPiece: (piece:Piece) => {
      set((state) => ({
        pieces: new Map(state.pieces).set(piece.id, {...piece}),
      }));
    },

    setPieces: (pieces: Map<string, Piece>) => {
      set(() => ({
        pieces: new Map(pieces)
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
        let newPiece = state.pieces.get(pieceId);

        if (!newPiece) return state;

        newPiece = {...newPiece, name: newName};
        return { pieces: new Map(state.pieces).set(pieceId, newPiece) };
      });
    },

    setPieceSeamAllowance: (pieceId: string, value: number) => {
      set((store) => {
        console.log(pieceId, value)
        const piece = store.pieces.get(pieceId);
        if (piece) { piece.seamAllowance = value } else { return store };
        return { pieces: new Map(store.pieces).set(pieceId, piece) };
      })
    },

    setSelectedPiece: (pieceId: string) => {
      set(() => ({
        selectedPiece: pieceId
      }))
    },

    updatePieceField: (pieceId, field, value) => {
      set(state => {
        const piece = state.pieces.get(pieceId)
        if (!piece) return {}

        const updated = { ...piece, [field]: value }
        return { pieces: new Map(state.pieces).set(pieceId, updated) }
      })
    },

}));
