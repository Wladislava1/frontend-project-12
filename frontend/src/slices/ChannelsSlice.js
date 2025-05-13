import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  channels: [],
  selectedChannelId: null,
}

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, action) => {
      state.channels = action.payload
      if (!state.selectedChannelId && action.payload.length > 0) {
        state.selectedChannelId = action.payload[0].id
      }
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload)
      state.selectedChannelId = action.payload.id
    },
    removeChannel: (state, action) => {
      state.channels = state.channels.filter(channel => channel.id !== action.payload)
      if (state.selectedChannelId === action.payload) {
        state.selectedChannelId = state.channels.length > 0 ? state.channels[0].id : null
      }
    },
    setSelectedChannelId: (state, action) => {
      state.selectedChannelId = action.payload
    },
  },
})

export const { setChannels, addChannel, removeChannel, setSelectedChannelId } = channelsSlice.actions
export const selectChannels = state => state.channels.channels
export const selectSelectedChannelId = state => state.channels.selectedChannelId
export default channelsSlice.reducer
