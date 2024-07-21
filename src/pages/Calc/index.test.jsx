import React from 'react';
import { render, screen } from '@testing-library/react';
import Calc from './index';

test('renders the Calc page', () => {
  render(<Calc />);

  expect(screen.getByText(/calculator/i)).toBeInTheDocument();
});
