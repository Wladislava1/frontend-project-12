import { configureStore } from '@reduxjs/toolkit'
import authReducer from './AuthSlice'
import channelsReducer from './ChannelsSlice'
import messagesReducer from './MessagesSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
    channels: channelsReducer,
  },
})

export default store
