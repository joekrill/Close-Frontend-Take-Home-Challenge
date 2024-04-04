import { DragDropContext } from '@hello-pangea/dnd';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Column from './Column';

const onTaskAdded = jest.fn();

beforeEach(() => {
  onTaskAdded.mockReset();
});

it('shows the task form when the add task button is clicked.', async () => {
  const user = userEvent.setup();
  render(
    <DragDropContext onDragEnd={() => {}}>
      <Column
        cards={[]}
        name="done"
        title="Testing"
        onTaskAdded={onTaskAdded}
      />
    </DragDropContext>,
  );
  expect(screen.queryByTestId('task-form')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Add task' }));
  expect(screen.getByTestId('task-form')).toBeInTheDocument();
});

it('hides the task form when the form\'s "Cancel" button is clicked.', async () => {
  const user = userEvent.setup();
  render(
    <DragDropContext onDragEnd={() => {}}>
      <Column
        cards={[]}
        name="done"
        title="Testing"
        onTaskAdded={onTaskAdded}
      />
    </DragDropContext>,
  );
  await user.click(screen.getByRole('button', { name: 'Add task' }));
  expect(screen.getByTestId('task-form')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(screen.queryByTestId('task-form')).not.toBeInTheDocument();
});

describe('submitting the form', () => {
  const testData = {
    title: 'Cursus vitae congue mauris rhoncus.',
    emailAddress: 'close@example.com',
    description:
      'Vulputate dignissim suspendisse in est ante in nibh mauris. Eget felis eget nunc lobortis mattis. ',
  };

  it('calls onTaskAdded with the entered data', async () => {
    const user = userEvent.setup();
    render(
      <DragDropContext onDragEnd={() => {}}>
        <Column
          cards={[]}
          name="done"
          title="Testing"
          onTaskAdded={onTaskAdded}
        />
      </DragDropContext>,
    );
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(screen.getByTestId('task-form')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Title'), testData.title);
    await user.type(screen.getByLabelText('Email'), testData.emailAddress);
    await user.type(screen.getByLabelText('Description'), testData.description);
    await user.click(screen.getByRole('button', { name: 'Save task' }));
    expect(onTaskAdded).toHaveBeenCalledWith(testData);
  });

  it('hides the form', async () => {
    const user = userEvent.setup();
    render(
      <DragDropContext onDragEnd={() => {}}>
        <Column
          cards={[]}
          name="done"
          title="Testing"
          onTaskAdded={onTaskAdded}
        />
      </DragDropContext>,
    );
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(screen.getByTestId('task-form')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Title'), testData.title);
    await user.type(screen.getByLabelText('Email'), testData.emailAddress);
    await user.type(screen.getByLabelText('Description'), testData.description);
    await user.click(screen.getByRole('button', { name: 'Save task' }));
    expect(screen.queryByTestId('task-form')).not.toBeInTheDocument();
  });
});

describe('when maximum tasks is reached', () => {
  const tasks = new Array(10)
    .fill({
      title: 'test',
      emailAddress: 'test@example.com',
      description: 'blah blah',
    })
    .map((task, index) => ({
      id: String(index),
      ...task,
    }));

  it('prevents adding new tasks', async () => {
    const user = userEvent.setup();
    render(
      <DragDropContext onDragEnd={() => {}}>
        <Column
          cards={tasks}
          maxTasks={tasks.length}
          name="done"
          title="Testing"
          onTaskAdded={onTaskAdded}
        />
      </DragDropContext>,
    );
    const addTaskButton = screen.getByRole('button', { name: 'Add task' });
    expect(addTaskButton).toBeDisabled();
    await user.click(addTaskButton);
    expect(screen.queryByTestId('task-form')).not.toBeInTheDocument();
  });
});
