import { v4 as uuidv4 } from 'uuid';
import { useEffect, useReducer } from 'react';
import { Task } from '../components/screens/Board/TaskForm';

type TaskWithId = Task & { id: string };

export type Column = 'todo' | 'inProgress' | 'done';

export type BoardState = {
  [key in Column]: Array<TaskWithId>;
};

type BoardStateAction =
  | {
      type: 'ADD_TASK';
      payload: Task & { column: Column };
    }
  | {
      type: 'MOVE_TASK';
      payload: {
        from: { id: string; column: Column };
        to: { column: Column; index: number };
      };
    }
  | {
      type: 'SYNC_BOARD' | 'LOAD_BOARD';
      payload: BoardState;
    };

const boardStateReducer = (state: BoardState, action: BoardStateAction) => {
  switch (action.type) {
    case 'ADD_TASK': {
      const { column, ...task } = action.payload;

      return {
        ...state,
        [column]: [{ id: uuidv4(), ...task }, ...state[column]],
      };
    }
    case 'MOVE_TASK': {
      const { from, to } = action.payload;
      const sourceIndex = state[from.column].findIndex(
        ({ id }) => id === from.id,
      );

      if (sourceIndex < 0) {
        // TODO: this should generally not happen. How should we handle this if it does?
        return state;
      }

      const sourceTasks = [...state[from.column]];
      const [removed] = sourceTasks.splice(sourceIndex, 1);

      if (to.column === from.column) {
        sourceTasks.splice(to.index, 0, removed);
        return {
          ...state,
          [from.column]: sourceTasks,
        };
      }

      const destinationTasks = [...state[to.column]];
      destinationTasks.splice(to.index, 0, removed);
      return {
        ...state,
        [to.column]: destinationTasks,
        [from.column]: sourceTasks,
      };
    }
    case 'LOAD_BOARD':
    case 'SYNC_BOARD': {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

/**
 * Generates a wrapped version of boardStateReducer that saves the state in
 * local storage whenever there is a change.
 * @param localStorageKey The key to use when savng to local storage.
 * @returns A board state reducer function.
 */
const storageBackedBoardStateReducer =
  (localStorageKey: string) =>
  (state: BoardState, action: BoardStateAction) => {
    const newState = boardStateReducer(state, action);

    if (action.type !== 'SYNC_BOARD') {
      // We need to avoid storing on SYNC_BOARD because we can end up in an
      // infinite loop (tab 1 updates local storage, tab 2 gets an event to
      // sync and updates storage, which triggers tab 1 to get the event, etc.)
      localStorage.setItem(localStorageKey, JSON.stringify(newState));
    }

    return newState;
  };

export const EMPTY_BOARD_STATE: BoardState = {
  todo: [],
  inProgress: [],
  done: [],
};

/**
 * A state manager that maintains the state of a single board.
 * @param localStorageKey The key to use when savng to and restoring from local storage.
 */
export const useBoardState = (localStorageKey: string = 'BOARD_STATE') => {
  const stateManager = useReducer(
    storageBackedBoardStateReducer(localStorageKey),
    localStorageKey,
    (key) => {
      const data = localStorage.getItem(key);

      if (!data) {
        return EMPTY_BOARD_STATE;
      }

      try {
        // TODO: This should be validated! (perhaps using `zod`?)
        return JSON.parse(data);
      } catch (err) {
        // TODO: store error so we can notify the user in some way.
        return EMPTY_BOARD_STATE;
      }
    },
  );
  const dispatch = stateManager[1];

  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key !== localStorageKey || e.storageArea !== localStorage) {
        return;
      }

      if (!e.newValue) {
        // This can happen if the user manually clears their localStorage.
        // Behavior as to which windows/tabs gets this event seems to vary by
        // browser. In some cases the "active" window won't get the event,
        // leading to an inconsistent state between tabs. So by using
        // `LOAD_BOARD` instead of `SYNC_BOARD` here we ensure the empty state
        // gets persisted, forcing all other tabs into the same empty state.
        // TODO: Is this really what do we want to do here? Could this lead to
        // data loss in some scenarios?
        dispatch({ type: 'LOAD_BOARD', payload: EMPTY_BOARD_STATE });
        return;
      }

      try {
        // TODO: This should be validated! (perhaps using `zod`?)
        dispatch({ type: 'SYNC_BOARD', payload: JSON.parse(e.newValue) });
      } catch (err) {
        // this likely means `e.newValue` was not valid JSON.
        // TODO: What should we do in this case? Load EMPTY_BOARD_STATE.
        // TODO: Store error so we can notify the user in some way?
      }
    };

    window.addEventListener('storage', listener);

    return () => window.removeEventListener('storage', listener);
  }, [localStorageKey, dispatch]);

  return stateManager;
};
