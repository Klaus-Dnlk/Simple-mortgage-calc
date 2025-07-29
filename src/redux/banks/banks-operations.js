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
      return rejectWithValue(error.message)
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
      return rejectWithValue(error.message)
    }
  },
)

export const deleteBank = createAsyncThunk(
  'banks/deleteBank',
  async (bankId, { rejectWithValue }) => {
    try {
      await axios.delete(`/banks/${bankId}`)
      return bankId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export default {
  fetchBanks,
  addNewBank,
  deleteBank,
}
