import { render, screen } from '@testing-library/react';

import Board from '.';

it('renders columns', () => {
  render(<Board />);
  expect(screen.getByText(/To do/i)).toBeInTheDocument();
  expect(screen.getByText(/In progress/i)).toBeInTheDocument();
  expect(screen.getByText(/Done/i)).toBeInTheDocument();
});
