import React from 'react';
import { render, screen } from '@testing-library/react';
import IframeComponent from './index';

test('renders the IframeComponent component', () => {
  const src = 'https://example.com';

  render(<IframeComponent src={src} />);

  const iframe = screen.getByTitle(/iframe/i);
  expect(iframe).toHaveAttribute('src', src);
});
