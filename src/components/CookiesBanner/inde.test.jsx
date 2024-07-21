import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CookiesBanner from './index';

test('renders the CookiesBanner component and accepts cookies', () => {
  render(<CookiesBanner />);

  const acceptButton = screen.getByText(/accept/i);
  expect(acceptButton).toBeInTheDocument();

  fireEvent.click(acceptButton);

  expect(screen.queryByText(/accept/i)).toBeNull();
});
