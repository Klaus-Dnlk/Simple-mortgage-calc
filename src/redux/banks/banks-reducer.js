import { createReducer, combineReducers } from '@reduxjs/toolkit'
import changeFilter from './banks-actions'
import operations from './banks-operations'

const items = createReducer([], {
  [operations.fetchBanks.fulfilled]: (_, { payload }) => payload,
  [operations.addNewBank.fulfilled]: (state, { payload }) => [
    ...state,
    payload,
  ],
  [operations.deleteBank.fulfilled]: (state, { payload }) =>
    state.filter((bank) => bank.id !== payload),
})

const loading = createReducer(false, {
  [operations.fetchBanks.pending]: () => true,
  [operations.fetchBanks.fulfilled]: () => false,
  [operations.fetchBanks.rejected]: () => false,
  [operations.addNewBank.pending]: () => true,
  [operations.addNewBank.fulfilled]: () => false,
  [operations.addNewBank.rejected]: () => false,
  [operations.deleteBank.pending]: () => true,
  [operations.deleteBank.fulfilled]: () => false,
  [operations.deleteBank.rejected]: () => false,
})

const filter = createReducer('', {
  [changeFilter]: (_, { payload }) => payload,
})

const error = createReducer(null, {})

export default combineReducers({
  items,
  filter,
  loading,
  error,
})
