'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/TodoDetail.module.css';
import { api } from '@/utils/api';
import { Todo } from '@/types/todo';

export default function TodoDetail({ itemId }: { itemId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [todo, setTodo] = useState<Todo>({
    id: Number(itemId),
    tenantId: "",
    name: "",
    memo: "",
    imageUrl: "",
    isCompleted: false
  });

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const data = await api.getTodoById(Number(itemId));
        if (data) setTodo(data);
      } catch {
        router.push('/');
      }
    };
    fetchTodo();
  }, [itemId, router]);

  const handleImageUpload = async (file: File) => {
    if (!file || file.size > 5 * 1024 * 1024) return;
    if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) return;

    try {
      const imageData = await api.uploadImage(file);
      setTodo(prev => ({ ...prev, imageUrl: imageData.url }));
    } catch {
      router.push('/');
    }
  };

  const handleSave = async () => {
    if (!todo.name.trim()) return;
    
    try {
      await api.updateTodo(Number(itemId), {
        name: todo.name.trim(),
        memo: todo.memo,
        imageUrl: todo.imageUrl,
        isCompleted: todo.isCompleted
      });
      router.push('/');
    } catch {
      router.push('/');
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteTodo(Number(itemId));
      router.push('/');
    } catch {
      router.push('/');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <div className={styles.titleWrapper}>
          <div 
            className={`${styles.checkbox} ${todo.isCompleted ? styles.checked : ''}`}
            onClick={() => setTodo(prev => ({ ...prev, isCompleted: !prev.isCompleted }))}
            role="checkbox"
            aria-checked={todo.isCompleted}
          />
          <input
            type="text"
            value={todo.name}
            onChange={(e) => setTodo(prev => ({ ...prev, name: e.target.value }))}
            className={styles.title}
            placeholder="할 일을 입력하세요"
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.imageSection} onClick={() => fileInputRef.current?.click()}>
          {todo.imageUrl ? (
            <div className={styles.imageWrapper}>
              <Image
                src={todo.imageUrl}
                alt="Todo image"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          ) : (
            <div className={styles.uploadPlaceholder}>
              클릭하여 이미지 업로드
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            hidden
          />
        </div>

        <div className={styles.memoSection}>
          <span className={styles.memoTitle}>Memo</span>
          <textarea
            value={todo.memo}
            onChange={(e) => setTodo(prev => ({ ...prev, memo: e.target.value }))}
            className={styles.memoTextarea}
            placeholder="메모를 입력하세요"
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.saveButton}`}
          onClick={handleSave}
          disabled={isLoading}
        >
          수정 완료
        </button>
        <button
          className={`${styles.button} ${styles.deleteButton}`}
          onClick={handleDelete}
          disabled={isLoading}
        >
          삭제하기
        </button>
      </div>
    </div>
  );
}