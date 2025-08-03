import { List, Map, fromJS } from 'immutable';

export const toImmutableList = (array) => {
  return List(array);
};

export const toImmutableMap = (object) => {
  return Map(object);
};

export const toImmutable = (data) => {
  return fromJS(data);
};

export const findBankById = (banks, bankId) => {
  const banksList = List.isList(banks) ? banks : List(banks);
  return banksList.find(bank => bank.id === bankId);
};

export const findBanksByCriteria = (banks, criteria) => {
  const banksList = List.isList(banks) ? banks : List(banks);
  
  return banksList.filter(bank => {
    return Object.keys(criteria).every(key => {
      const value = criteria[key];
      if (typeof value === 'string') {
        return bank[key] && bank[key].toLowerCase().includes(value.toLowerCase());
      }
      return bank[key] === value;
    });
  });
};

export const sortBanks = (banks, sortBy, sortOrder = 'asc') => {
  const banksList = List.isList(banks) ? banks : List(banks);
  
  return banksList.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const groupBanksBy = (banks, groupBy) => {
  const banksList = List.isList(banks) ? banks : List(banks);
  
  return banksList.groupBy(bank => bank[groupBy]);
};

export const calculateBanksStatistics = (banks) => {
  const banksList = List.isList(banks) ? banks : List(banks);
  
  if (banksList.isEmpty()) {
    return {
      totalBanks: 0,
      averageInterestRate: 0,
      averageLoanTerm: 0,
      averageMaxLoan: 0,
      averageMinDownPayment: 0
    };
  }
  
  const totalBanks = banksList.size;
  
  const averageInterestRate = banksList
    .map(bank => parseFloat(bank.InterestRate) || 0)
    .reduce((sum, rate) => sum + rate, 0) / totalBanks;
    
  const averageLoanTerm = banksList
    .map(bank => parseFloat(bank.LoanTerm) || 0)
    .reduce((sum, term) => sum + term, 0) / totalBanks;
    
  const averageMaxLoan = banksList
    .map(bank => parseFloat(bank.MaximumLoan) || 0)
    .reduce((sum, loan) => sum + loan, 0) / totalBanks;
    
  const averageMinDownPayment = banksList
    .map(bank => parseFloat(bank.MinimumDownPayment) || 0)
    .reduce((sum, payment) => sum + payment, 0) / totalBanks;
  
  return {
    totalBanks,
    averageInterestRate: Math.round(averageInterestRate * 100) / 100,
    averageLoanTerm: Math.round(averageLoanTerm * 100) / 100,
    averageMaxLoan: Math.round(averageMaxLoan),
    averageMinDownPayment: Math.round(averageMinDownPayment)
  };
}; 