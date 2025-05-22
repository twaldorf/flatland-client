// storage/index.ts
type StorageBackend = 'local' | 'server';

interface StorageAPI {
  saveProject: (projectId: string) => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;

  savePieceToLibrary: (pieceId: string) => Promise<void>;
  loadPiecesFromLibrary: () => Promise<void>;
  loadPiecesFromProject: (projectId: string) => Promise<void>;
}

export const storageBackend: StorageBackend = 'local';

export const storage: StorageAPI = {
  async saveProject(projectId) {
    if (storageBackend === 'local') {
      // TODO: implement localStorage logic
    }
  },

  async loadProject(projectId) {
    if (storageBackend === 'local') {
      // TODO: implement localStorage logic
    }
  },

  async savePieceToLibrary(pieceId) {
    if (storageBackend === 'local') {
      // TODO: implement localStorage logic
    }
  },

  async loadPiecesFromLibrary() {
    if (storageBackend === 'local') {
      // TODO: implement localStorage logic
    }
  },

  async loadPiecesFromProject(projectId) {
    if (storageBackend === 'local') {
      // TODO: implement localStorage logic
    }
  },
};
