import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  addChannel: false,
  renameChannel: null,
  deleteChannel: null,
}

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openAddChannelModal(state) {
      state.addChannel = true
    },
    closeAddChannelModal(state) {
      state.addChannel = false
    },
    openRenameChannelModal(state, action) {
      state.renameChannel = action.payload
    },
    closeRenameChannelModal(state) {
      state.renameChannel = null
    },
    openDeleteChannelModal(state, action) {
      state.deleteChannel = action.payload
    },
    closeDeleteChannelModal(state) {
      state.deleteChannel = null
    },
  },
})

export const {
  openAddChannelModal,
  closeAddChannelModal,
  openRenameChannelModal,
  closeRenameChannelModal,
  openDeleteChannelModal,
  closeDeleteChannelModal,
} = modalsSlice.actions
export const selectAddChannelModal = state => state.modals.addChannel
export const selectRenameChannelModal = state => state.modals.renameChannel
export const selectDeleteChannelModal = state => state.modals.deleteChannel
export default modalsSlice.reducer
