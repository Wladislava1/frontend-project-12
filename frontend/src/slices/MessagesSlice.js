
import { createSlice } from '@reduxjs/toolkit'
import { removeChannel } from './ChannelsSlice'

const initialState = {
  messages: [],
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, action) => {
      const channelIdToRemove = action.payload
      state.messages = state.messages.filter((msg) => msg.channelId !== channelIdToRemove)
    })
  },
})

export const { setMessages, addMessage } = messagesSlice.actions
export const selectMessages = (state) => state.messages.messages
export default messagesSlice.reducer
