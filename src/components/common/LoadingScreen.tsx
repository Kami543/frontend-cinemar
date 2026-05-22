import styles from '../../styles/LoadingScreen.module.css';

interface LoadingScreenProps {
  message?: string;
  fullscreen?: boolean;
}

export default function LoadingScreen({
  message = 'Carregando...',
  fullscreen = false,
}: LoadingScreenProps) {
  return (
    <div
      className={`${styles.wrapper} ${fullscreen ? styles.fullscreen : ''}`}
      role="status"
      aria-label={message}
    >
      <div className={styles.spinner}>
        <div className={styles.spinnerCircle}></div>
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}