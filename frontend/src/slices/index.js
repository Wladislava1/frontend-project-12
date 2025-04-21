import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice.js';
import channelsReducer from './ChannelsSlice.js';
import messagesReducer from './MessagesSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
    channels: channelsReducer,
  },
});

export default store;
