// src/components/Tabs.tsx
import React from 'react';
import { useViewState } from '../../ViewState';

// Define the available views and their corresponding paths
const tabConfig: { label: string; view: string; path: string }[] = [
  { label: 'Editor',        view: 'app',           path: '/' },
  { label: 'Piece Library', view: 'piece library', path: '/piece-library' },
  { label: 'Mark',          view: 'mark',          path: '/mark' },
  { label: 'Browser',       view: 'browser',       path: '/browser' },
];

export const Tabs: React.FC = () => {
  const view    = useViewState((s) => s.view);
  const setView = useViewState((s) => s.setView);

  return (
    <nav className="flex space-x-2 px-3">
      {tabConfig.map(({ label, view: viewName, path }) => (
        <a
          key={viewName}
          href={path}
          onClick={(e) => {
            e.preventDefault();
            setView(viewName);
          }}
          className={`px-4 py-2 cursor-pointer rounded-t transition-colors  \
            ${
              view === viewName
                ? 'border-b-2 border-blue-500 font-bold bg-white'
                : 'text-gray-500 bg-stone-200 hover:bg-stone-300'
            }`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
};

export default Tabs;
