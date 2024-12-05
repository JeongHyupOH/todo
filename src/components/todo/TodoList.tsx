'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/TodoList.module.css";
import { api } from "@/utils/api";
import { Todo, TabType } from "@/types/todo";
import { TodoEmptySvg } from '@/components/icons/TodoEmptySvg';
import { DoneEmptySvg } from '@/components/icons/DoneEmptySvg';
import { DoneCheckbox } from '@/components/icons/DoneCheckbox';

export default function TodoList() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await api.getTodos();
      setTodos(response.items);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    // 낙관적 업데이트
    setTodos(prev => prev.map(t => 
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    ));

    try {
      await api.updateTodo(id, { isCompleted: !todo.isCompleted });
    } catch {
      // 실패시 다시 목록 불러오기
      fetchTodos();
    }
  };

  const EmptyState = ({ type }: { type: TabType }) => (
    <div className={styles.empty}>
      <div className={styles.emptyImage}>
        {type === "TODO" ? <TodoEmptySvg /> : <DoneEmptySvg />}
      </div>
      <div className={styles.emptyTextWrapper}>
        <p className={styles.mainText}>
          {type === "TODO" 
            ? "할 일이 없어요.\nTODO를 새롭게 추가해주세요!" 
            : "할 일이 없어요.\nTODO를 새롭게 추가해주세요!"}
        </p>
        <p className={styles.subText}>
          {type === "TODO" 
            ? "아직 다 한 일이 없어요.\n해야 할 일을 체크해주세요!" 
            : "아직 다 한 일이 없어요.\n해야 할 일을 체크해주세요!"}
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  const todoItems = todos.filter(todo => !todo.isCompleted);
  const doneItems = todos.filter(todo => todo.isCompleted);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div className={styles.tabSection}>
          <div className={styles.tabHeader}>TODO</div>
          <div className={styles.list}>
            {todoItems.length === 0 ? (
              <EmptyState type="TODO" />
            ) : (
              todoItems.map(todo => (
                <div
                  key={todo.id}
                  className={styles.item}
                  onClick={() => router.push(`/items/${todo.id}`)}
                >
                  <div
                    className={styles.checkbox}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(todo.id);
                    }}
                  />
                  <span className={styles.text}>{todo.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className={styles.tabSection}>
          <div className={styles.tabHeader}>DONE</div>
          <div className={styles.list}>
            {doneItems.length === 0 ? (
              <EmptyState type="DONE" />
            ) : (
              doneItems.map(todo => (
                <div
                  key={todo.id}
                  className={`${styles.item} ${styles.completed}`}
                  onClick={() => router.push(`/items/${todo.id}`)}
                >
                  <div
                    className={styles.checkbox}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(todo.id);
                    }}
                  >
                    <DoneCheckbox />
                  </div>
                  <span className={styles.text}>{todo.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}