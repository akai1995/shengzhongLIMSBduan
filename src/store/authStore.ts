import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  isFirstLogin: boolean
  username: string
  login: (username: string, isFirst: boolean) => void
  logout: () => void
  setFirstLoginDone: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isFirstLogin: false,
  username: '',
  login: (username: string, isFirst: boolean) => set({ isLoggedIn: true, username, isFirstLogin: isFirst }),
  logout: () => set({ isLoggedIn: false, username: '', isFirstLogin: false }),
  setFirstLoginDone: () => set({ isFirstLogin: false }),
}))