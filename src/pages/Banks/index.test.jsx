// src/pages/Banks/index.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Banks from './index';

test('renders the Banks page', () => {
  render(<Banks />);

  expect(screen.getByText(/banks/i)).toBeInTheDocument();
});
