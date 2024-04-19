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

// This is a simplified example; adjust according to your actual initial state and reducers
const initialState = {
  banks: {
    isLoading: false,
    banksList: [
      { id: '1', BankName: 'Test Bank', MaximumLoan: '500000', MinimumDownPayment: '50000', LoanTerm: '20', InterestRate: '5' }
    ]
  }
};

// Helper function to render the component with redux store
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
    fireEvent.mouseDown(screen.getByLabelText(/Bank name/)); // Open select dropdown
    fireEvent.click(screen.getByText(/Test Bank/)); // Click on a menu item

    expect(screen.getByLabelText(/Initial Loan/i).value).toBe('500000');
  });

  // Continue with other tests as needed, following the same pattern.
  // Assuming continued from the previous setup
  
  // Input Value Changes
  test('input fields update their state on change', () => {
      renderWithProviders(<Calc />);
      const initialLoanInput = screen.getByLabelText(/Initial Loan/i);
      fireEvent.change(initialLoanInput, { target: { value: '300000' } });
      expect(initialLoanInput.value).toBe('300000');
    });
    
    // Calculate Button Functionality
    test('calculate button calculates monthly payment correctly', async () => {
      renderWithProviders(<Calc />);
      // Assuming you have a form or a submit button to trigger the calculation
      const calculateButton = screen.getByRole('button', { name: /Calculate/i });
      fireEvent.click(calculateButton);
    
      // Wait for the monthly payment to be calculated and displayed
      const monthlyPaymentDisplay = await screen.findByTestId('monthly-payment');
      expect(monthlyPaymentDisplay).toBeInTheDocument();
      expect(monthlyPaymentDisplay).toHaveTextContent(/\$\d/); // This regex should be adjusted based on the expected format
    });
    
    // Error Handling for Invalid APR
    test('displays error for invalid APR', () => {
      renderWithProviders(<Calc />);
      const aprInput = screen.getByLabelText(/APR/i);
      fireEvent.change(aprInput, { target: { value: '105' } }); // Set an invalid APR
    
      const calculateButton = screen.getByRole('button', { name: /Calculate/i });
      fireEvent.click(calculateButton);
    
      const errorMessage = screen.getByTestId('calc-error');
      expect(errorMessage).toHaveTextContent('Invalid interest rate');
    });
    
    // Warning for High APR
    test('displays warning for high APR', () => {
      renderWithProviders(<Calc />);
      const aprInput = screen.getByLabelText(/APR/i);
      fireEvent.change(aprInput, { target: { value: '16' } }); // Set a high but valid APR
    
      const calculateButton = screen.getByRole('button', { name: /Calculate/i });
      fireEvent.click(calculateButton);
    
      const warningMessage = screen.getByTestId('interest-rate-warning');
      expect(warningMessage).toHaveTextContent('Consider negotiating for a better rate');
    });
    
    // Reset Functionality
    test('reset button clears the form', () => {
      renderWithProviders(<Calc />);
      // Assuming values are already set, simulate a reset
      const resetButton = screen.getByTestId('reset');
      fireEvent.click(resetButton);
    
      // After reset, values should be empty or default
      expect(screen.getByLabelText(/Initial Loan/i).value).toBe('');
      expect(screen.getByLabelText(/Down Payment/i).value).toBe('');
      // Continue asserting for other fields...
    });
    
    // Fetching Banks on Mount
    test('fetches banks when the component is mounted', () => {
      const store = mockStore(initialState);
      store.dispatch = jest.fn();
    
      renderWithProviders(<Calc />, { reduxState: initialState });
    
      // Assuming the fetchBanks operation is dispatched on mount
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
});
  
  