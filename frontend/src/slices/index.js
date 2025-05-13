import { configureStore } from '@reduxjs/toolkit'
import authReducer from './AuthSlice'
import channelsReducer from './ChannelsSlice'
import messagesReducer from './MessagesSlice'
import modalsReducer from './ModalsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
    channels: channelsReducer,
    modals: modalsReducer,
  },
})

export default store
