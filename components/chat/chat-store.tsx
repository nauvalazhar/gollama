import { create } from 'zustand';

const defaultFolderId = 'general';

interface ChatStore {
  chatId: string;
  viewFolderId: string;
  editorFolderId: string;
  setViewFolderId: (folderId: string) => void;
  setEditorFolderId: (folderId?: string) => void;
  setChatId: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatId: '',
  viewFolderId: defaultFolderId,
  editorFolderId: defaultFolderId,
  setChatId: (chatId) => set({ chatId }),
  setViewFolderId: (folderId) => set({ viewFolderId: folderId }),
  setEditorFolderId: (folderId) =>
    set({ editorFolderId: folderId ?? defaultFolderId }),
}));
