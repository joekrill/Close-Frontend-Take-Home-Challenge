import { renderHook, act } from '@testing-library/react';
import { useBoardState } from './useBoardState';
import { Task } from '../components/screens/Board/TaskForm';

const testData = {
  todo: [
    {
      id: '6c80d0f0-367e-4224-99e6-32b201a47bc0',
      title: 'Technical Call 2',
      description: 'Have a call with a Close Engineering Manager.',
      emailAddress: 'ty@close.com',
    },
    {
      id: '887d216b-0c54-4a55-99aa-588671136eb4',
      title: 'Culture Call',
      description:
        "Learn about Close's culture with Harmonie, from the People Ops team.",
      emailAddress: 'harmonie@close.com',
    },
    {
      id: '195a7b6d-5c68-4037-a1b0-fde26071c267',
      title: 'General Call 3',
      description:
        'Time to talk to Phil Freo, the Director of Engineering at Close. :D',
      emailAddress: 'phil@close.com',
    },
  ],
  inProgress: [
    {
      id: '687cd371-39be-4fa7-aa55-557dc692acd9',
      title: 'Take-Home Project',
      description: 'Create a simple Kanban Board to show your skills.',
      emailAddress: 'vitor@close.com',
    },
  ],
  done: [
    {
      id: 'dcc1ed7f-6789-4283-b2c4-f5f12630d3a5',
      title: 'Technical Call 1',
      description:
        'Talk to one of the Frontend Engineers currently on the team.',
      emailAddress: 'scott@close.com',
    },
    {
      id: 'ca3078ac-a818-4ee8-a306-1ed4ec954460',
      title: 'Screening',
      description:
        "Fill out Close's application form, so they can get to know me. :)",
      emailAddress: 'vitor@close.com',
    },
  ],
};

it('is populated with no data by default', () => {
  const { result } = renderHook(() => useBoardState());
  expect(result.current[0].todo).toHaveLength(0);
  expect(result.current[0].inProgress).toHaveLength(0);
  expect(result.current[0].done).toHaveLength(0);
});

describe('ADD_TASK', () => {
  const testTask: Task = {
    title: 'Lorem ipsum dolor sit amet',
    emailAddress: 'someone@somewhere.com',
    description:
      'Consectetur a erat nam at. Mauris sit amet massa vitae tortor condimentum lacinia quis.',
  };

  it('adds new tasks to the beginning of the task list', async () => {
    const { result } = renderHook(() => useBoardState());
    act(() => {
      result.current[1]({
        type: 'ADD_TASK',
        payload: { column: 'todo', ...testTask },
      });
    });

    expect(result.current[0].todo).toHaveLength(1);
    expect(result.current[0].todo[0]).toMatchObject(testTask);
  });

  it('generates an ID for new tasks', () => {
    const { result } = renderHook(() => useBoardState());
    act(() => {
      result.current[1]({
        type: 'ADD_TASK',
        payload: { column: 'todo', ...testTask },
      });
    });

    expect(typeof result.current[0].todo[0].id).toEqual(expect.any(String));
  });

  it('updates localStorage with the new state', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useBoardState());
    act(() => {
      result.current[1]({
        type: 'ADD_TASK',
        payload: { column: 'todo', ...testTask },
      });
    });

    expect(setItemSpy).toHaveBeenCalledWith('BOARD_STATE', expect.any(String));
    expect(() => JSON.parse(setItemSpy.mock.lastCall[1])).not.toThrow();
  });
});

describe('SYNC_BOARD', () => {
  it('replaces the board with the given state', () => {
    const { result } = renderHook(() => useBoardState());
    act(() => {
      result.current[1]({
        type: 'SYNC_BOARD',
        payload: testData,
      });
    });

    expect(result.current[0].todo).toHaveLength(3);
    expect(result.current[0].inProgress).toHaveLength(1);
    expect(result.current[0].done).toHaveLength(2);
  });

  it('does not update localStorage', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useBoardState());
    act(() => {
      result.current[1]({
        type: 'SYNC_BOARD',
        payload: testData,
      });
    });

    expect(setItemSpy).not.toHaveBeenCalled();
  });
});

describe('LOAD_BOARD', () => {
  it('replaces the board with the given state', () => {
    const { result } = renderHook(() => useBoardState());
    act(() => {
      result.current[1]({
        type: 'LOAD_BOARD',
        payload: testData,
      });
    });

    expect(result.current[0].todo).toHaveLength(3);
    expect(result.current[0].inProgress).toHaveLength(1);
    expect(result.current[0].done).toHaveLength(2);
  });

  it('does update localStorage', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useBoardState());
    act(() => {
      result.current[1]({
        type: 'LOAD_BOARD',
        payload: testData,
      });
    });

    expect(setItemSpy).toHaveBeenCalledWith('BOARD_STATE', expect.any(String));
  });
});

describe('MOVE_TASK', () => {
  it('can move to the top', () => {
    const { result } = renderHook(() => useBoardState());
    const expectedResult = [
      testData.todo[1].id,
      testData.todo[0].id,
      testData.todo[2].id,
    ];

    act(() => {
      result.current[1]({
        type: 'LOAD_BOARD',
        payload: testData,
      });
      result.current[1]({
        type: 'MOVE_TASK',
        payload: {
          from: { column: 'todo', id: testData.todo[1].id },
          to: { column: 'todo', index: 0 },
        },
      });
    });

    expect(result.current[0].todo.map(({ id }) => id)).toEqual(expectedResult);
  });

  it('can move to the bottom', () => {
    const { result } = renderHook(() => useBoardState());
    const expectedResult = [
      testData.todo[0].id,
      testData.todo[2].id,
      testData.todo[1].id,
    ];

    act(() => {
      result.current[1]({
        type: 'LOAD_BOARD',
        payload: testData,
      });
      result.current[1]({
        type: 'MOVE_TASK',
        payload: {
          from: { column: 'todo', id: testData.todo[1].id },
          to: { column: 'todo', index: 2 },
        },
      });
    });

    expect(result.current[0].todo.map(({ id }) => id)).toEqual(expectedResult);
  });

  it('can move to the middle', () => {
    const { result } = renderHook(() => useBoardState());
    const expectedResult = [
      testData.todo[1].id,
      testData.todo[0].id,
      testData.todo[2].id,
    ];

    act(() => {
      result.current[1]({
        type: 'LOAD_BOARD',
        payload: testData,
      });
      result.current[1]({
        type: 'MOVE_TASK',
        payload: {
          from: { column: 'todo', id: testData.todo[0].id },
          to: { column: 'todo', index: 1 },
        },
      });
    });

    expect(result.current[0].todo.map(({ id }) => id)).toEqual(expectedResult);
  });

  it('can move between groups', () => {
    const { result } = renderHook(() => useBoardState());

    const expectedTodo = [testData.todo[1].id, testData.todo[2].id];
    const expectedDone = [
      testData.todo[0].id,
      testData.done[0].id,
      testData.done[1].id,
    ];

    act(() => {
      result.current[1]({
        type: 'LOAD_BOARD',
        payload: testData,
      });
      result.current[1]({
        type: 'MOVE_TASK',
        payload: {
          from: { column: 'todo', id: testData.todo[0].id },
          to: { column: 'done', index: 0 },
        },
      });
    });
    expect(result.current[0].todo.map(({ id }) => id)).toEqual(expectedTodo);
    expect(result.current[0].done.map(({ id }) => id)).toEqual(expectedDone);
  });

  it('handles leaving empty columns', () => {
    const { result } = renderHook(() => useBoardState());

    act(() => {
      result.current[1]({
        type: 'LOAD_BOARD',
        payload: testData,
      });
      result.current[1]({
        type: 'MOVE_TASK',
        payload: {
          from: { column: 'inProgress', id: testData.inProgress[0].id },
          to: { column: 'done', index: 0 },
        },
      });
    });
    expect(result.current[0].done).toHaveLength(3);
    expect(result.current[0].inProgress).toHaveLength(0);
  });

  it('ignores unknown IDs', () => {
    const { result } = renderHook(() => useBoardState());

    act(() => {
      result.current[1]({
        type: 'LOAD_BOARD',
        payload: testData,
      });
      result.current[1]({
        type: 'MOVE_TASK',
        payload: {
          from: { column: 'todo', id: 'xxxx' },
          to: { column: 'done', index: 0 },
        },
      });
    });
    expect(result.current[0].todo).toHaveLength(3);
    expect(result.current[0].inProgress).toHaveLength(1);
    expect(result.current[0].done).toHaveLength(2);
  });
});
