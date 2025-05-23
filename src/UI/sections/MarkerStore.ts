// store/markerStore.ts
import { create } from 'zustand';
import { Marker } from '../../types';
import { generateUUID } from 'three/src/math/MathUtils';

interface MarkerStore {
  marker:Marker;

  addPieceToMarker: (id: string) => void;
  removePieceFromMarker: (id: string) => void;

  trueIfPieceInMarker: (id: string) => boolean;
}

export const useMarkerStore = create<MarkerStore>((set, get) => ({
  marker: {
    id: generateUUID(),
    pieceIds: [],
    fabric: '',
    width: 54,
    length: 72,
    selvedge: 0,
  },

  addPieceToMarker: (id: string) => {
    set((state) => {
      if (state.marker.pieceIds.includes(id)) return {};
      return {
        marker: {
          ...state.marker,
          pieceIds: [...state.marker.pieceIds, id],
        },
      };
    });
  },

  removePieceFromMarker: (id: string) => {
    set((state) => ({
      marker: {
        ...state.marker,
        pieceIds: state.marker.pieceIds.filter((pid) => pid !== id),
      },
    }));
  },

  trueIfPieceInMarker: (id: string) => {
    return get().marker.pieceIds.includes(id);
  }
}));
