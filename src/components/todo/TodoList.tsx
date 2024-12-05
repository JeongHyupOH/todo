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
  const [page] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching todos...');
      const data = await api.getTodos(page, pageSize);
      console.log('Todos fetched:', data);
      setTodos(data.items || []);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        // 낙관적 업데이트
        setTodos(prevTodos => 
          prevTodos.map(t => 
            t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
          )
        );
        
        await api.updateTodo(id, { isCompleted: !todo.isCompleted });
        await fetchTodos(); // 서버와 동기화
      }
    } catch (error) {
      console.error("Failed to toggle todo:", error);
      await fetchTodos(); // 실패시 목록 새로고침
    }
  };

  const EmptyState = ({ type }: { type: TabType }) => (
    <div className={styles.empty} role="status">
      <div className={styles.emptyImage}>
        {type === "TODO" ? <TodoEmptySvg /> : <DoneEmptySvg />}
      </div>
      <div className={styles.emptyTextWrapper}>
        <p className={styles.mainText}>
          할 일이 없어요.{'\n'}TODO를 새롭게 추가해주세요!
        </p>
        <p className={styles.subText}>
          아직 다 한 일이 없어요.{'\n'}해야 할 일을 체크해주세요!
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div className={styles.tabSection}>
          <div className={`${styles.tabHeader} ${styles.todoTab}`}>TODO</div>
          <div className={styles.list}>
            {todos.filter(todo => !todo.isCompleted).length === 0 ? (
              <EmptyState type="TODO" />
            ) : (
              todos
                .filter(todo => !todo.isCompleted)
                .map(todo => (
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
            {todos.filter(todo => todo.isCompleted).length === 0 ? (
              <EmptyState type="DONE" />
            ) : (
              todos
                .filter(todo => todo.isCompleted)
                .map(todo => (
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