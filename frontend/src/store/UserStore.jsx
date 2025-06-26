import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const userStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticate: false,
      isCheckingAuth: true,
      setUser: (data) => set({ user: data }),
      setIsAuthenticate: (data) => set({ isAuthenticate: data }),
      setIsCheckingAuth: (data) => set({ isCheckingAuth: data }),
      // Add a clear function if needed
      clearUser: () => set({ user: null, isAuthenticate: false, isCheckingAuth: false }),

    }),
    {
      name: "user-storage", // unique name for the localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      // Optional: You can whitelist or blacklist specific keys
      // partialize: (state) => ({ user: state.user, isAuthenticate: state.isAuthenticate }),
    }
  )
);