import { create } from 'zustand'

type ModalType = 
  | 'createUser'
  | 'editUser'
  | 'deleteUser'
  | 'createStudent'
  | 'editStudent'
  | 'createHomework'
  | 'editHomework'
  | 'submitHomework'
  | 'gradeHomework'
  | 'createAnnouncement'
  | 'editAnnouncement'
  | 'createEvent'
  | 'editEvent'
  | 'addBalance'
  | 'createProduct'
  | 'editProduct'
  | 'createOrder'
  | 'orderDetails'
  | 'addVehicle'
  | 'editVehicle'
  | 'assignStudent'
  | 'attendance'
  | 'createSemester'
  | 'editSemester'

interface ModalData {
  [key: string]: any
}

interface ModalState {
  isOpen: boolean
  type: ModalType | null
  data: ModalData
  
  // Actions
  openModal: (type: ModalType, data?: ModalData) => void
  closeModal: () => void
  setData: (data: ModalData) => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  type: null,
  data: {},

  openModal: (type, data = {}) => {
    set({ isOpen: true, type, data })
  },

  closeModal: () => {
    set({ isOpen: false, type: null, data: {} })
  },

  setData: (data) => {
    set(state => ({ data: { ...state.data, ...data } }))
  }
}))

export default useModalStore
