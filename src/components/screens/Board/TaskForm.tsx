import { useEffect, useRef, useState } from 'react';
import styles from './TaskForm.module.css';

export type Task = {
  description: string;
  emailAddress: string;
  title: string;
};

export type TaskFormProps = {
  onCancel: () => void;
  onSubmit: (task: Task) => void;
};

export default function TaskForm({ onCancel, onSubmit }: TaskFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [title, setTitle] = useState('');

  // Focus the "Title" input when the form is first rendered for easier keyboard navigation.
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title, emailAddress, description });
      }}
      data-testid="task-form"
    >
      <label className={styles.field}>
        <span className={styles.label}>Title</span>
        <input
          ref={titleRef}
          className={styles.input}
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Email</span>
        <input
          className={styles.input}
          name="email"
          type="email"
          required
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Description</span>
        <textarea
          className={styles.textarea}
          name="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <div className={styles.buttons}>
        <button type="submit" className={styles.saveButton}>
          Save task
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => onCancel()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
