import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

axios.defaults.baseURL = 'https://625314acc534af46cb93846b.mockapi.io/api/'
export const fetchBanks = createAsyncThunk(
  'banks/fetchBanks',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/banks')
      return data
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const addNewBank = createAsyncThunk(
  'banks/addNewBank',
  async (
    { BankName, MaximumLoan, MinimumDownPayment, LoanTerm, InterestRate },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post('/banks', {
        BankName,
        MaximumLoan,
        MinimumDownPayment,
        LoanTerm,
        InterestRate,
      })
      return data
    } catch (error) {
      rejectWithValue(error)
    }
  },
)

export const deleteBank = createAsyncThunk(
  'banks/deleteBank',
  async (bankId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/banks/${bankId}`)
      return data.id
    } catch (error) {
      rejectWithValue(error)
    }
  },
)

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  fetchBanks,
  addNewBank,
  deleteBank,
}
