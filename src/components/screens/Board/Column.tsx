import PlusIcon from 'components/icons/PlusIcon';
import { useState } from 'react';
import Card from './Card';
import styles from './Column.module.css';
import TaskForm, { Task, TaskFormProps } from './TaskForm';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Column as ColumnName } from '../../../hooks/useBoardState';

export type ColumnProps = {
  cards: Array<Task & { id: string }>;
  maxTasks?: number;
  name: ColumnName;
  onTaskAdded: TaskFormProps['onSubmit'];
  title: string;
};

export default function Column({
  cards,
  maxTasks = 100,
  name,
  onTaskAdded,
  title,
}: ColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const isFull = cards.length >= maxTasks;

  return (
    <section className={styles.column}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button
          disabled={isFull}
          type="button"
          aria-label="Add task"
          title={
            isFull
              ? `Maximum number of tasks (${maxTasks}) reached`
              : 'Add task'
          }
          className={styles.button}
          onClick={() => setIsAddingTask(true)}
        >
          <PlusIcon />
        </button>
      </header>
      <Droppable droppableId={name} type="TASK" isDropDisabled={isFull}>
        {(provided) => (
          <div
            className={styles.cards}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {!isFull && isAddingTask && (
              <TaskForm
                onCancel={() => setIsAddingTask(false)}
                onSubmit={(task) => {
                  onTaskAdded(task);
                  setIsAddingTask(false);
                }}
              />
            )}
            <>
              {cards.map(({ description, emailAddress, id, title }, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card
                        emailAddress={emailAddress}
                        description={description}
                        title={title}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </>
          </div>
        )}
      </Droppable>
    </section>
  );
}
