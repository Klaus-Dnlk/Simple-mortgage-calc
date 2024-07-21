// src/pages/Home/index.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './index';

test('renders the Home page', () => {
  render(<Home />);

  expect(screen.getByText(/welcome home/i)).toBeInTheDocument();
});
