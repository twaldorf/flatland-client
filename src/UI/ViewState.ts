import { create } from 'zustand';
import { pushCommand } from '../Command';
import { SaveProjectCommand } from './commands/SaveProjectCommand';

export type ViewName = 'app' | 'mark' | 'piece library' | 'browser';

// Store state "header" file
interface ViewState {

  view: ViewName;
  setView: (view: ViewName) => void;
}

export const useViewState = create<ViewState>((set, get) => ({
  
  view: 'app',
  setView: (view:ViewName) => {
    pushCommand(new SaveProjectCommand()); // side effect could be major trouble, consider another solution
    set({ view: view });
  },

}));
