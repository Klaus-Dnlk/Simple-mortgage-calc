export const getLoading = (state) => state.banks.loading

export const getFilter = (state) => state.banks.filter

export const getAllBanks = (state) => state.banks.items

export const getError = (state) => state.banks.error

export const getFilteredBanks = (state) => {
  const banks = getAllBanks(state)
  const filter = getFilter(state)
  
  if (!filter) return banks
  
  return banks.filter(bank => 
    bank.BankName.toLowerCase().includes(filter.toLowerCase())
  )
}
