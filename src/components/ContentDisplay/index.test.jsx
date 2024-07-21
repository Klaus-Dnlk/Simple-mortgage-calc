import React from 'react';
import { render, screen } from '@testing-library/react';
import ContentDisplay from './index';

test('renders the ContentDisplay component', () => {
  render(<ContentDisplay content="This is a test content" />);

  expect(screen.getByText(/this is a test content/i)).toBeInTheDocument();
});
