'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/TodoDetail.module.css';
import { api } from '@/utils/api';
import { Todo, TodoUpdateInput } from '@/types/todo';

export default function TodoDetail({ itemId }: { itemId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
        setIsLoading(true);
        const data = await api.getTodoById(Number(itemId));
        if (data) {
          setTodo(data);
        }
      } catch {
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodo();
  }, [itemId, router]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      if (file.size > 5 * 1024 * 1024) return;
      if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) return;

      const imageData = await api.uploadImage(file);
      setTodo(prev => ({ ...prev, imageUrl: imageData.url }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(prev => ({ ...prev, name: e.target.value }));
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTodo(prev => ({ ...prev, memo: e.target.value }));
  };

  const handleSave = async () => {
    if (!todo.name.trim()) return;
  
    try {
      setIsLoading(true);
      const updateData: TodoUpdateInput = {
        name: todo.name.trim(),
        memo: todo.memo,
        imageUrl: todo.imageUrl,
        isCompleted: todo.isCompleted
      };
      
      const response = await api.updateTodo(Number(itemId), updateData);
      if (response) {  
        await router.push("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      router.prefetch('/');
      await api.deleteTodo(Number(itemId));
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !todo.name) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

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
            onChange={handleNameChange}
            className={styles.title}
            placeholder="할 일을 입력하세요"
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.imageSection} onClick={handleImageClick}>
          {isUploading && <div className={styles.uploadingOverlay}>업로드 중...</div>}
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
            onChange={handleImageChange}
            hidden
          />
        </div>

        <div className={styles.memoSection}>
          <span className={styles.memoTitle}>Memo</span>
          <textarea
            value={todo.memo}
            onChange={handleMemoChange}
            className={styles.memoTextarea}
            placeholder="메모를 입력하세요"
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.saveButton}`}
          onClick={handleSave}
          disabled={isLoading || isUploading}
        >
          {isLoading ? '저장 중...' : '수정 완료'}
        </button>
        <button
          className={`${styles.button} ${styles.deleteButton}`}
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? '삭제 중...' : '삭제하기'}
        </button>
      </div>
    </div>
  );
}