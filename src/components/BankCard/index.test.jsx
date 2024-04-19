import React from 'react';
import { render, fireEvent, screen, waitFor  } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import store from '../../redux/store';
import NewBankCard from './index';
import * as bankActions from '../../redux/banks/banks-operations';


// const mockEmptyStore = configureStore([]);

describe('NewBankCard Component', () => {
  const renderedComponent = () => {
    render(
    <Provider store={store}>
        <NewBankCard />
      </Provider>
  )}
  

    it('some test', () => {
        renderedComponent()
    })
//  

  it('renders NewBankCard component with name', () => {
    renderedComponent()
  
    const buttonElement = screen.getByText(/Add Bank/i);
  });

  it('renders NewBankCard component with input and button', () => {
    renderedComponent()
    expect(screen.getByLabelText(/Bank Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

    it('validates input with initial capital letter', () => {
    renderedComponent()

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getByTestId('validation-error')).toHaveTextContent('must start with a capital letter');
    });

        test('dispatches the correct action on form submission', () => {
          renderedComponent()
          fireEvent.click(screen.getByText(/Add Bank/i));

          const actions = store.getActions();
          const expectedPayload = { type: 'banks/filter' }; 
          expect(actions).toEqual([expectedPayload]);
        });

        const middlewares = [thunk];
        const mockStore = configureStore(middlewares);

        jest.mock('../../redux/banks/banks-operations', () => ({
        addBank: jest.fn(),
        }));

    describe('BankCard Component', () => {
      let store;

      beforeEach(() => {
        store = mockStore({
          banks: {
            bankList: []
          }
        });

        bankActions.addBank.mockClear();
      });

      test('calls addBank action with correct data on form submit', async () => {
        const testData = { name: 'Test Bank', interestRate: 5, maxLoan: 100000, minDownPayment: 20, loanTerm: 10 };
        bankActions.addBank.mockImplementation(() => Promise.resolve(testData));

        render(
          <Provider store={store}>
            <NewBankCard />
          </Provider>
        );

        fireEvent.change(screen.getByLabelText(/bank name/i), { target: { value: testData.name } });
        fireEvent.change(screen.getByLabelText(/interest rate/i), { target: { value: testData.interestRate.toString() } });
        fireEvent.change(screen.getByLabelText(/max loan/i), { target: { value: testData.maxLoan.toString() } });
        fireEvent.change(screen.getByLabelText(/min down payment/i), { target: { value: testData.minDownPayment.toString() } });
        fireEvent.change(screen.getByLabelText(/loan term/i), { target: { value: testData.loanTerm.toString() } });

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => expect(bankActions.addBank).toHaveBeenCalledWith(testData));
      });


    });
});

jest.mock('axios');

describe('BankCard Component with API call', () => {
  test('fetches and displays data from an API', async () => {
    const mockedResponse = { data: [{ id: '1', name: 'Mock Bank' }] };
    axios.get.mockResolvedValueOnce(mockedResponse);

    render(<NewBankCard />);

    await screen.findByText('Mock Bank');
  });
});

describe('Async operations in BankCard Component', () => {
  test('handles loading state correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: '1', name: 'Async Bank' }] });

    render(<NewBankCard />);

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
    await waitFor(() => expect(screen.getByTestId('loading')).toBeEmptyDOMElement());
  });
});
