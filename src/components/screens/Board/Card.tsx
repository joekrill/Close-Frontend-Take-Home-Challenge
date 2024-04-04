import { memo } from 'react';
import styles from './Card.module.css';
import Gravatar from './Gravatar';
import { Task } from './TaskForm';

export type CardProps = Task;

export default memo(function Card({
  description,
  emailAddress,
  title,
}: CardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <Gravatar emailAddress={emailAddress} />
        <h3 className={styles.title}>{title}</h3>
      </header>
      <p className={styles.description}>{description}</p>
    </article>
  );
});
