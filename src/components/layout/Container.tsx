import styles from '@/styles/Container.module.css';

interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}