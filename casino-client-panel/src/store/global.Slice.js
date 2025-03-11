import { createSlice } from '@reduxjs/toolkit'
import { GetUserData } from './global.Action'


const initialState = {
  logedIn: false,
  profile: null,
  bots: null,
  activeBot: null
}

export const globalSlice = createSlice({
  name: 'globalState',
  initialState,
  reducers: {

    setLogedIn: (state, action) => {
      state.logedIn = action.payload
    },
    setProfile: (state, action) => {
      state.profile = action.payload
    },
    setBots: (state, action) => {
      state.bots = action.payload
    },
    setBotsActive: (state, action) => {
      state.activeBot = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetUserData.pending, (state) => {
        state.logedIn = false;
      })
      .addCase(GetUserData.rejected, (state, action) => {
        state.logedIn = false;
      })
      .addCase(GetUserData.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.logedIn = true;
      });
  }
})

export const { setLogedIn, setProfile, setBots, setBotsActive } = globalSlice.actions

export default globalSlice.reducer