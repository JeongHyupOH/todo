'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/TodoForm.module.css';
import { api } from '@/utils/api';

export default function TodoForm() {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await api.createTodo(trimmedName);
      setName('');
      router.refresh();
    } catch (error) {
      alert('할 일을 추가하는데 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleSubmit(e);
    }
  };

  return (
    <form 
      className={styles.form} 
      onSubmit={handleSubmit}
      aria-label="할 일 추가 폼"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="할 일을 입력하세요"
        className={styles.input}
        maxLength={50}
        disabled={isSubmitting}
        aria-label="할 일 입력"
      />
      <button
        type="submit"
        className={`${styles.button} ${isSubmitting ? styles.submitting : ''}`}
        disabled={!name.trim() || isSubmitting}
        aria-label="할 일 추가"
      >
        {isSubmitting ? '추가 중...' : '+ 추가하기'}
      </button>
    </form>
  );
}