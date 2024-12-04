import Link from 'next/link';
import styles from "@/styles/Header.module.css";
import { Logo } from '@/components/common/Logo';  

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Logo />
        </Link>
      </div>
    </header>
  );
}