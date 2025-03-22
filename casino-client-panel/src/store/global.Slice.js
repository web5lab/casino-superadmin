import { createSlice } from '@reduxjs/toolkit'
import { depositesApi, getAllTransactionApi, getCasinoSettingApi, getCasinoSubAdmins, GetUserData, logInApi, updateCasinoSettingApi, withdrawalsApi } from './global.Action'


const initialState = {
  logedIn: false,
  profile: null,
  bots: null,
  activeBot: null,
  allTransactions: [],
  deposites: [],
  withdrawals: [],
  casinoSettings: null,
  subAdmins: null,
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
    },
    logOut: (state) => {
      state.logedIn = false
      state.profile = null
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
    builder
      .addCase(logInApi.pending, (state) => {
        state.logedIn = false;
        state.profile = null
      })
      .addCase(logInApi.rejected, (state, action) => {
        state.logedIn = false;
        state.profile = null
      })
      .addCase(logInApi.fulfilled, (state, action) => {
        state.logedIn = true;
        state.profile = action.payload;
      });
    builder
      .addCase(getAllTransactionApi.pending, (state) => {
        state.allTransactions = [];
      })
      .addCase(getAllTransactionApi.rejected, (state, action) => {
        state.allTransactions = [];
      })
      .addCase(getAllTransactionApi.fulfilled, (state, action) => {
        state.allTransactions = action.payload;
      });
    builder
      .addCase(depositesApi.pending, (state) => {
        state.deposites = [];
      })
      .addCase(depositesApi.rejected, (state, action) => {
        state.deposites = [];
      })
      .addCase(depositesApi.fulfilled, (state, action) => {
        state.deposites = action.payload;
      });
    builder
      .addCase(withdrawalsApi.pending, (state) => {
        state.withdrawals = [];
      })
      .addCase(withdrawalsApi.rejected, (state, action) => {
        state.withdrawals = [];
      })
      .addCase(withdrawalsApi.fulfilled, (state, action) => {
        state.withdrawals = action.payload;
      });
      builder
      .addCase(getCasinoSubAdmins.pending, (state) => {
        state.subAdmins = null;
      })
      .addCase(getCasinoSubAdmins.rejected, (state, action) => {
        state.subAdmins = null;
      })
      .addCase(getCasinoSubAdmins.fulfilled, (state, action) => {
        state.subAdmins = action.payload;
      });
    builder
      .addCase(updateCasinoSettingApi.fulfilled, (state, action) => {
        state.casinoSettings = action.payload;
      });
  }
})

export const { setLogedIn, setProfile, setBots, setBotsActive, logOut } = globalSlice.actions

export default globalSlice.reducer