import { render, screen } from '@testing-library/react';

import App from './App';

it('renders page title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Close Frontend Take-Home Project/i);
  expect(titleElement).toBeInTheDocument();
});
