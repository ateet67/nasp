import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  loading: boolean
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
  }>
  modals: {
    [key: string]: boolean
  }
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  loading: false,
  notifications: [],
  modals: {},
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    addNotification: (state, action: PayloadAction<{
      id: string
      type: 'success' | 'error' | 'warning' | 'info'
      message: string
      duration?: number
    }>) => {
      state.notifications.push(action.payload)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false
    },
    closeAllModals: (state) => {
      state.modals = {}
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
} = uiSlice.actions

export default uiSlice.reducer

// Selectors
export const selectSidebarOpen = (state: { ui: UIState }) => state.ui.sidebarOpen
export const selectTheme = (state: { ui: UIState }) => state.ui.theme
export const selectUILoading = (state: { ui: UIState }) => state.ui.loading
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications
export const selectModalOpen = (state: { ui: UIState }, modalName: string) => state.ui.modals[modalName] || false
