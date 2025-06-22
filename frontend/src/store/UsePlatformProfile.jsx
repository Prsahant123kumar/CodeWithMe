import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
export const usePlatformProfile = create(
    // persist(
        (set) => ({
            UserLeetcode: null,
            UserCodeforces: null,
            UserGFG: null,
            UserAtcoder: null,
            UserCodingNinja: null,
            setLeetcodeData: (data) => set({ UserLeetcode: data }),
            setCodeforcesData: (data) => set({ UserCodeforces: data }),
            setGFGData: (data) => set({ UserGFG: data }),
            setAtcoderData: (data) => set({ UserAtcoder: data }),
            setCodingNinjaData: (data) => set({ UserCodingNinja: data }),
        })
    // )
)