'use client';

import { useState } from 'react';
import styles from '@/styles/TodoForm.module.css';
import { api } from '@/utils/api';

export default function TodoForm() {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await api.createTodo({ name: trimmedName });
      setName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
        placeholder="할 일을 입력하세요"
        className={styles.input}
        maxLength={50}
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className={styles.button}
        disabled={!name.trim() || isSubmitting}
      >
        {isSubmitting ? '추가 중...' : '+ 추가하기'}
      </button>
    </form>
  );
}
