// Import necessary utilities and components
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Calc from './Calc';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const initialState = {
  banks: {
    isLoading: false,
    banksList: [
      { id: '1', BankName: 'Test Bank', MaximumLoan: '500000', MinimumDownPayment: '50000', LoanTerm: '20', InterestRate: '5' }
    ]
  }
};

const renderWithProviders = (ui, { reduxState } = {}) => {
  const store = mockStore(reduxState || initialState);
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('Calc Component', () => {
  test('component renders without crashing', () => {
    renderWithProviders(<Calc />);
    expect(screen.getByLabelText(/Bank name/i)).toBeInTheDocument();
  });

  test('changing the bank dropdown sets the bank values correctly', () => {
    renderWithProviders(<Calc />);
    fireEvent.mouseDown(screen.getByLabelText(/Bank name/)); 
    fireEvent.click(screen.getByText(/Test Bank/)); 

    expect(screen.getByLabelText(/Initial Loan/i).value).toBe('500000');
  });

  test('input fields update their state on change', () => {
      renderWithProviders(<Calc />);
      const initialLoanInput = screen.getByLabelText(/Initial Loan/i);
      fireEvent.change(initialLoanInput, { target: { value: '300000' } });
      expect(initialLoanInput.value).toBe('300000');
    });
    
    test('calculate button calculates monthly payment correctly', async () => {
      renderWithProviders(<Calc />);
      const calculateButton = screen.getByRole('button', { name: /Calculate/i });
      fireEvent.click(calculateButton);
    
      const monthlyPaymentDisplay = await screen.findByTestId('monthly-payment');
      expect(monthlyPaymentDisplay).toBeInTheDocument();
      expect(monthlyPaymentDisplay).toHaveTextContent(/\$\d/); 
    });
    
    test('displays error for invalid APR', () => {
      renderWithProviders(<Calc />);
      const aprInput = screen.getByLabelText(/APR/i);
      fireEvent.change(aprInput, { target: { value: '105' } }); 
    
      const calculateButton = screen.getByRole('button', { name: /Calculate/i });
      fireEvent.click(calculateButton);
    
      const errorMessage = screen.getByTestId('calc-error');
      expect(errorMessage).toHaveTextContent('Invalid interest rate');
    });
    
    test('displays warning for high APR', () => {
      renderWithProviders(<Calc />);
      const aprInput = screen.getByLabelText(/APR/i);
      fireEvent.change(aprInput, { target: { value: '16' } }); 
    
      const calculateButton = screen.getByRole('button', { name: /Calculate/i });
      fireEvent.click(calculateButton);
    
      const warningMessage = screen.getByTestId('interest-rate-warning');
      expect(warningMessage).toHaveTextContent('Consider negotiating for a better rate');
    });
    
    test('reset button clears the form', () => {
      renderWithProviders(<Calc />);
      const resetButton = screen.getByTestId('reset');
      fireEvent.click(resetButton);
    
      expect(screen.getByLabelText(/Initial Loan/i).value).toBe('');
      expect(screen.getByLabelText(/Down Payment/i).value).toBe('');
    });
    
    test('fetches banks when the component is mounted', () => {
      const store = mockStore(initialState);
      store.dispatch = jest.fn();
    
      renderWithProviders(<Calc />, { reduxState: initialState });
    
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
});
  
  