import styles from './index.module.css';

export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Close Frontend Take-Home Project</h1>
      </header>
      <div className={styles.spacing} aria-hidden="true" />
    </>
  );
}
