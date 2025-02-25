import { configureStore } from '@reduxjs/toolkit'
import validatorsReducer from './validatorsSlice'
import walletReducer from './walletSlice'

export const store = configureStore({
  reducer: {
    templates: validatorsReducer,
    user: walletReducer,
  },
})