import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TaskForm from './TaskForm';

const onCancel = jest.fn();
const onSubmit = jest.fn();

beforeEach(() => {
  onCancel.mockReset();
  onSubmit.mockReset();
});

it('focuses the title input when rendered', () => {
  render(<TaskForm onCancel={onCancel} onSubmit={onSubmit} />);
  expect(screen.getByLabelText('Title')).toHaveFocus();
});

it('calls onCancel when the cancel button is clicked', async () => {
  const user = userEvent.setup();
  render(<TaskForm onCancel={onCancel} onSubmit={onSubmit} />);
  await user.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(onSubmit).not.toHaveBeenCalled();
  expect(onCancel).toHaveBeenCalledTimes(1);
});

it('calls onSubmit when the submit button is clicked', async () => {
  const user = userEvent.setup();
  render(<TaskForm onCancel={onCancel} onSubmit={onSubmit} />);
  await user.click(screen.getByRole('button', { name: 'Save task' }));
  expect(onCancel).not.toHaveBeenCalled();
  expect(onSubmit).toHaveBeenCalledTimes(1);
});

it('sends the form data when the submit button is clicked.', async () => {
  const testData = {
    title: 'A erat nam at lectus urna duis',
    emailAddress: 'test@example.com',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  };

  const user = userEvent.setup();
  render(<TaskForm onCancel={onCancel} onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('Title'), testData.title);
  await user.type(screen.getByLabelText('Email'), testData.emailAddress);
  await user.type(screen.getByLabelText('Description'), testData.description);
  await user.click(screen.getByRole('button', { name: 'Save task' }));
  expect(onSubmit).toHaveBeenCalledWith(testData);
});

it('is navigable by keyboard', async () => {
  const user = userEvent.setup();
  render(<TaskForm onCancel={onCancel} onSubmit={onSubmit} />);
  expect(screen.getByLabelText('Title')).toHaveFocus();

  await user.tab();
  expect(screen.getByLabelText('Email')).toHaveFocus();

  await user.tab();
  expect(screen.getByLabelText('Description')).toHaveFocus();

  await user.tab();
  expect(screen.getByRole('button', { name: 'Save task' })).toHaveFocus();

  await user.keyboard('{Enter}');
  expect(onSubmit).toHaveBeenCalled();

  await user.tab();
  expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();

  await user.keyboard('{Enter}');
  expect(onCancel).toHaveBeenCalled();
});
