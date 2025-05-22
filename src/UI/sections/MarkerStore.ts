// store/markerStore.ts
import { create } from 'zustand';
import { Layout, Marker } from '../../types';
import { generateUUID } from 'three/src/math/MathUtils';

interface MarkerStore {
  markers: Map<string, Marker>;
  layouts: Map<string, Layout>;
  activeMarker: string | undefined;

  createMarker: (pieceIds?:string[]) => void;
  addMarker: (marker: Marker) => void;
  removeMarker: (id: string) => void;

  addPieceToMarker: (id: string) => void;

  addLayout: (layout: Layout) => void;
  updateLayout: (id: string, layout: Partial<Layout>) => void;
  removeLayout: (id: string) => void;
}

// export const generateMarker();

export const useMarkerStore = create<MarkerStore>((set, get) => ({
  markers: new Map(),
  layouts: new Map(),

  activeMarker: undefined,

  createMarker: (pieceIds?:string[]) => {
    set(state => {
      const newMarker:Marker = {
        id:generateUUID(),
      }
      if (pieceIds) newMarker.pieceIds = pieceIds;
      return { markers: new Map(state.markers).set(newMarker.id, newMarker)}
    })
  },

  addMarker: (marker) => {
    set(state => {
      const newMarkers = new Map(state.markers);
      newMarkers.set(marker.id, marker);
      return { markers: newMarkers };
    });
  },

  removeMarker: (id) => {
    set(state => {
      const newMarkers = new Map(state.markers);
      newMarkers.delete(id);
      return { markers: newMarkers };
    });
  },

  addPieceToMarker: (id:string) => {
    set(state => {
      if (!state.activeMarker) {
        state.createMarker([id]);
        return { markers: new Map(state.markers) }
      } else {
        const marker = state.markers.get(state.activeMarker)!;
        if (marker) marker.pieceIds.push(id);
        return { markers: new Map(state.markers).set(state.activeMarker, marker)}
      }
    })
  },

  addLayout: (layout) => {
    set(state => {
      const newLayouts = new Map(state.layouts);
      newLayouts.set(layout.id, layout);
      return { layouts: newLayouts };
    });
  },

  updateLayout: (id, partial) => {
    set(state => {
      const newLayouts = new Map(state.layouts);
      const existing = newLayouts.get(id);
      if (existing) {
        newLayouts.set(id, { ...existing, ...partial });
      }
      return { layouts: newLayouts };
    });
  },

  removeLayout: (id) => {
    set(state => {
      const newLayouts = new Map(state.layouts);
      newLayouts.delete(id);
      return { layouts: newLayouts };
    });
  },
}));
