import { create } from 'zustand';

export type ViewName = 'app' | 'mark' | 'piece library' | 'browser';

// Store state "header" file
interface ViewState {

  view: ViewName;
  setView: (view: ViewName) => void;
}

export const useViewState = create<ViewState>((set, get) => ({
  
  view: 'app',
  setView: (view:ViewName) => set({ view: view }),

}));
