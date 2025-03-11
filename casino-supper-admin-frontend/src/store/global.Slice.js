import { createSlice } from '@reduxjs/toolkit'
import {  getCasinos, GetCurrencies, logInApi } from './global.Action'


const initialState = {
  user: null,
  currencies:[],
  casinos:[],
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
      builder
      .addCase(GetCurrencies.pending, (state) => {
        state.currencies = [];
      })
      .addCase(GetCurrencies.rejected, (state, action) => {
        state.currencies = [];
      })
      .addCase(GetCurrencies.fulfilled, (state, action) => {
        state.currencies = action.payload;
      });
      builder
      .addCase(getCasinos.pending, (state) => {
        state.casinos = [];
      })
      .addCase(getCasinos.rejected, (state, action) => {
        state.casinos = [];
      })
      .addCase(getCasinos.fulfilled, (state, action) => {
        state.casinos = action.payload;
      });
   
  }
})

export const { setLogedIn, setProfile, setBots, setBotsActive } = globalSlice.actions

export default globalSlice.reducer