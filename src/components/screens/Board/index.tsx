import Column from './Column';
import styles from './index.module.css';
import {
  BoardState,
  Column as ColumnName,
  EMPTY_BOARD_STATE,
  useBoardState,
} from '../../../hooks/useBoardState';
import { DragDropContext } from '@hello-pangea/dnd';

let TEST_BOARD_STATE: BoardState = EMPTY_BOARD_STATE;

if (process.env.NODE_ENV === 'development') {
  // Webpack will completely remove this from the final bundle in
  // non-development environments.
  TEST_BOARD_STATE = {
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
}

export default function Board() {
  const [state, dispatch] = useBoardState();

  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <div className={styles.devTools}>
          <button
            type="button"
            onClick={() =>
              dispatch({ type: 'LOAD_BOARD', payload: TEST_BOARD_STATE })
            }
          >
            Load test board
          </button>
          <button
            type="button"
            onClick={() =>
              dispatch({ type: 'LOAD_BOARD', payload: EMPTY_BOARD_STATE })
            }
          >
            Clear board
          </button>
        </div>
      )}
      <DragDropContext
        onDragEnd={(e) => {
          if (!e.source || !e.destination) {
            return;
          }

          dispatch({
            type: 'MOVE_TASK',
            payload: {
              from: {
                column: e.source.droppableId as ColumnName,
                id: e.draggableId,
              },
              to: {
                column: e.destination.droppableId as ColumnName,
                index: e.destination.index,
              },
            },
          });
        }}
      >
        <div className={styles.board}>
          <Column
            name="todo"
            title="To do"
            cards={state.todo}
            onTaskAdded={(task) =>
              dispatch({
                type: 'ADD_TASK',
                payload: { column: 'todo', ...task },
              })
            }
          />
          <Column
            name="inProgress"
            title="In progress"
            cards={state.inProgress}
            onTaskAdded={(task) =>
              dispatch({
                type: 'ADD_TASK',
                payload: { column: 'inProgress', ...task },
              })
            }
          />
          <Column
            name="done"
            title="Done"
            cards={state.done}
            onTaskAdded={(task) =>
              dispatch({
                type: 'ADD_TASK',
                payload: { column: 'done', ...task },
              })
            }
          />
        </div>
      </DragDropContext>
    </>
  );
}
