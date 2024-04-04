import styles from './Gravatar.module.css';
import { useSha256Hash } from '../../../hooks/useSha256Hash';

export type GravatarProps = {
  emailAddress: string;
};

const DEFAULT_HASH = '00000000000000000000000000000000';

export default function Gravatar({ emailAddress }: GravatarProps) {
  const hash = useSha256Hash(emailAddress.trim().toLowerCase()) || DEFAULT_HASH;

  return (
    <div className={styles.gravatar}>
      <img
        className={styles.image}
        src={`https://gravatar.com/avatar/${hash}`}
        alt={`${emailAddress.trim()} avatar`}
      />
      <div className={styles.border} />
    </div>
  );
}
