import { createSlice, current } from '@reduxjs/toolkit'
import { GetUserData } from './global.Action'


const initialState = {
  Users: null,
  currentUser: null,
  currentUserBalance: null,
}

export const globalSlice = createSlice({
  name: 'globalState',
  initialState,
  reducers: {

    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    setCurrentUserBalance: (state,action) => {
      state.currentUserBalance = action.payload
    },
    deductBalance: (state, action) => {
      state.currentUser.balance = state.currentUser.balance - action.payload
    },
    creditBalance: (state, action) => {
      state.currentUser.balance = state.currentUser.balance + action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetUserData.pending, (state) => {
        state.Users = null;
      })
      .addCase(GetUserData.rejected, (state, action) => {
        state.Users = null;
      })
      .addCase(GetUserData.fulfilled, (state, action) => {
        state.Users = action.payload;
      });
  }
})

export const { setCurrentUser , setCurrentUserBalance , deductBalance, creditBalance} = globalSlice.actions

export default globalSlice.reducer