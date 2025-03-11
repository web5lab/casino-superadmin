import { createSlice } from '@reduxjs/toolkit'
import {  logInApi } from './global.Action'


const initialState = {
  user: null,
}

export const globalSlice = createSlice({
  name: 'globalState',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logInApi.pending, (state) => {
        state.user = null;
      })
      .addCase(logInApi.rejected, (state, action) => {
        state.user = false;
      })
      .addCase(logInApi.fulfilled, (state, action) => {
        state.user = action.payload;
      });
   
  }
})

export const { setLogedIn, setProfile, setBots, setBotsActive } = globalSlice.actions

export default globalSlice.reducer