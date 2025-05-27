// store/useUiStore.ts
import { create } from 'zustand';

interface UiState {
  isMenuVisible: boolean;
  showMenu: () => void;
  hideMenu: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMenuVisible: false,
  showMenu: () => set({ isMenuVisible: true }),
  hideMenu: () => set({ isMenuVisible: false }),
}));
