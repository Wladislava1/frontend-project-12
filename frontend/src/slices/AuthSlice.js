import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
    },
  },
})

export const { setCredentials } = authSlice.actions
export default authSlice.reducer
export const selectCurrentToken = state => state.auth.token
export const selectCurrentUser = state => state.auth.user
