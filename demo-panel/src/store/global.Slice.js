import { createSlice, current } from '@reduxjs/toolkit'
import { GetCurrencies, GetUserData, GetWallet } from './global.Action'


const initialState = {
  Users: null,
  currentUser: null,
  currentUserBalance: null,
  currenecies: null,
  userWallet: null,
}

export const globalSlice = createSlice({
  name: 'globalState',
  initialState,
  reducers: {

    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    setCurrentUserBalance: (state, action) => {
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
    builder
      .addCase(GetCurrencies.pending, (state) => {
        state.currenecies = [];
      })
      .addCase(GetCurrencies.rejected, (state, action) => {
        state.currenecies = [];
      })
      .addCase(GetCurrencies.fulfilled, (state, action) => {
        state.currenecies = action.payload;
      });
    builder
      .addCase(GetWallet.pending, (state) => {
        state.userWallet = [];
      })
      .addCase(GetWallet.rejected, (state, action) => {
        state.userWallet = [];
      })
      .addCase(GetWallet.fulfilled, (state, action) => {
        state.userWallet = action.payload;
      });
  }
})

export const { setCurrentUser, setCurrentUserBalance, deductBalance, creditBalance } = globalSlice.actions

export default globalSlice.reducer