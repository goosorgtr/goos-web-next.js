import { create } from 'zustand'

interface SidebarStore {
    isOpen: boolean
    isMobileOpen: boolean
    activeItem: string | null
    openDropdowns: string[]
    toggleSidebar: () => void
    toggleMobileSidebar: () => void
    closeMobileSidebar: () => void
    setActiveItem: (item: string | null) => void
    toggleDropdown: (itemId: string) => void
    closeAllDropdowns: () => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    isOpen: true,
    isMobileOpen: false,
    activeItem: null,
    openDropdowns: [],

    toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),

    toggleMobileSidebar: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),

    closeMobileSidebar: () => set({ isMobileOpen: false }),

    setActiveItem: (item) => set({ activeItem: item }),

    toggleDropdown: (itemId) =>
        set((state) => ({
            openDropdowns: state.openDropdowns.includes(itemId)
                ? state.openDropdowns.filter((id) => id !== itemId)
                : [...state.openDropdowns, itemId],
        })),

    closeAllDropdowns: () => set({ openDropdowns: [] }),
}))
