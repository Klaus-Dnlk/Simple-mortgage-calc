import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app component', () => {
  render(<App />);

  expect(screen.getByText(/home/i)).toBeInTheDocument();
  expect(screen.getByText(/calc/i)).toBeInTheDocument();
  expect(screen.getByText(/banks/i)).toBeInTheDocument();
});
