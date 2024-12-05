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

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const data = await api.getTodos();
      console.log('Fetched todos:', data); // 데이터 확인용
      if (data && Array.isArray(data)) {
        setTodos(data);
      } else if (data && Array.isArray(data.items)) {
        setTodos(data.items);
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();

    const handleTodoUpdated = () => {
      fetchTodos();
    };

    window.addEventListener('todo-updated', handleTodoUpdated);
    return () => {
      window.removeEventListener('todo-updated', handleTodoUpdated);
    };
  }, []);
  const handleToggle = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      // 낙관적 업데이트
      setTodos(prevTodos => 
        prevTodos.map(t => 
          t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
        )
      );
      
      await api.updateTodo(id, { isCompleted: !todo.isCompleted });
      // 서버 데이터와 동기화
      await fetchTodos();
    } catch (error) {
      console.error("Failed to toggle todo:", error);
      await fetchTodos();  // 에러 시 서버 데이터로 복구
    }
  };

  // EmptyState 컴포넌트는 그대로 유지
  const EmptyState = ({ type }: { type: TabType }) => {
    const messages = {
      TODO: {
        main: "할 일이 없어요.",
        sub: "TODO를 새롭게 추가해주세요!",
      },
      DONE: {
        main: "아직 다 한 일이 없어요.",
        sub: "해야 할 일을 체크해보세요!",
      }
    };

    return (
      <div className={styles.empty} role="status">
        <div className={styles.emptyImage}>
          {type === "TODO" ? <TodoEmptySvg /> : <DoneEmptySvg />}
        </div>
        <div className={styles.emptyTextWrapper}>
          <p className={styles.mainText}>{messages[type].main}</p>
          <p className={styles.subText}>{messages[type].sub}</p>
        </div>
      </div>
    );
  };

  // JSX는 동일하게 유지하되 데이터 필터링 로직 최적화
  const todoItems = todos.filter(todo => !todo.isCompleted);
  const doneItems = todos.filter(todo => todo.isCompleted);

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div className={styles.tabSection}>
          <div className={`${styles.tabHeader} ${styles.todoTab}`}>TODO</div>
          <div className={styles.list}>
            {todoItems.length === 0 ? (
              <EmptyState type="TODO" />
            ) : (
              todoItems.map(todo => (
                <div
                  key={todo.id}
                  className={styles.item}
                  onClick={() => router.push(`/items/${todo.id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <div
                    className={styles.checkbox}
                    onClick={(e) => handleToggle(todo.id, e)}
                    role="checkbox"
                    aria-checked={false}
                    tabIndex={0}
                  />
                  <span className={styles.text}>{todo.name}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.tabSection}>
          <div className={`${styles.tabHeader} ${styles.doneTab}`}>DONE</div>
          <div className={styles.list}>
            {doneItems.length === 0 ? (
              <EmptyState type="DONE" />
            ) : (
              doneItems.map(todo => (
                <div
                  key={todo.id}
                  className={`${styles.item} ${styles.completed}`}
                  onClick={() => router.push(`/items/${todo.id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <div
                    className={styles.doneCheckbox}
                    onClick={(e) => handleToggle(todo.id, e)}
                    role="checkbox"
                    aria-checked={true}
                    tabIndex={0}
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