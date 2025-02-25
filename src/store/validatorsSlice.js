import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  items: [],
  isLoading: false,
  error: null,
}

export const validatorsSlice = createSlice({
  name: 'validators',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setValidators: (state, action) => {
      state.items = action.payload
    },
    addValidator: (state, action) => {
      state.items = [...state.items, action.payload].sort((a, b) => 
        a.walletAddress.toLowerCase().localeCompare(b.walletAddress.toLowerCase())
      )
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setLoading, setValidators, addValidator, setError } = validatorsSlice.actions

// export const loadValidators = () => async (dispatch) => {
//   dispatch(setLoading(true))
//   try {
//     const response = await nodeApi.getAllNodes()
//     const sortedValidators = [...response.data.results].sort((a, b) => 
//       a.walletAddress.toLowerCase().localeCompare(b.walletAddress.toLowerCase())
//     )
//     dispatch(setValidators(sortedValidators))
//   } catch (error) {
//     showError('Failed to load validators')
//     dispatch(setError(error.message))
//   } finally {
//     dispatch(setLoading(false))
//   }
// }

// export const addValidatorNode = (nodeInfo) => async (dispatch) => {
//   dispatch(setLoading(true))
//   try {
//     const response = await nodeApi.addNode(nodeInfo)
//     dispatch(addValidator(response.data))
//     return response.data
//   } catch (error) {
//     showError('Failed to add validator node')
//     dispatch(setError(error.message))
//     throw error
//   } finally {
//     dispatch(setLoading(false))
//   }
// }

export default validatorsSlice.reducer