import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  account: null,
  isConnecting: false,
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload
    },
    setConnecting: (state, action) => {
      state.isConnecting = action.payload
    },
  },
})

export const { setAccount, setConnecting } = walletSlice.actions

export default walletSlice.reducer