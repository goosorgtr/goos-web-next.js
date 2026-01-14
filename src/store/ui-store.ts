import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'light' | 'dark'
  language: 'tr' | 'en'
  sidebarCollapsed: boolean
  breadcrumbs: Array<{ label: string; href: string }>
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  setLanguage: (language: 'tr' | 'en') => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href: string }>) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'tr',
      sidebarCollapsed: false,
      breadcrumbs: [],

      setTheme: (theme) => {
        set({ theme })
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark')
        }
      },

      toggleTheme: () => {
        set(state => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light'
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newTheme === 'dark')
          }
          return { theme: newTheme }
        })
      },

      setLanguage: (language) => {
        set({ language })
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed })
      },

      toggleSidebar: () => {
        set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }))
      },

      setBreadcrumbs: (breadcrumbs) => {
        set({ breadcrumbs })
      }
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        language: state.language,
        sidebarCollapsed: state.sidebarCollapsed
      })
    }
  )
)

export default useUIStore
