'use client';

import { useState } from 'react';
import styles from '@/styles/TodoForm.module.css';
import { api } from '@/utils/api';
import { CreateTodoInput } from '@/types/todo';

export default function TodoForm() {
 const [name, setName] = useState('');
 const [isSubmitting, setIsSubmitting] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   const trimmedName = name.trim();
   
   if (!trimmedName || isSubmitting) {
     return;
   }
   
   try {
     setIsSubmitting(true);
     console.log('Creating todo:', { name: trimmedName });
     
     const createData: CreateTodoInput = {
       name: trimmedName
     };

     const response = await api.createTodo(createData);
     console.log('Todo created:', response);
     
     setName('');
     window.location.reload();
   } catch (error) {
     console.error('Failed to create todo:', error);
   } finally {
     setIsSubmitting(false);
   }
 };

 const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
   if (e.key === 'Enter' && !e.shiftKey) {
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