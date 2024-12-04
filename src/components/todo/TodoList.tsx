"use client";

import { TodoEmptySvg } from "@/components/icons/TodoEmptySvg";
import { DoneEmptySvg } from "@/components/icons/DoneEmptySvg";
import { DoneCheckbox } from "@/components/icons/DoneCheckbox";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/TodoList.module.css";
import { TabType } from "@/types/todo";
import { api } from "@/utils/api";

interface TodoListItem {
  id: number;
  name: string;
  isCompleted: boolean;
}

export default function TodoList() {
  const router = useRouter();
  const [todos, setTodos] = useState<TodoListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.getTodos(page, pageSize);
        setTodos(Array.isArray(data) ? data : []);
      } catch (error) {
        setError("할 일 목록을 불러오는데 실패했습니다.");
        console.error("Failed to fetch todos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [page, pageSize]);

  const handleToggle = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        await api.updateTodo(id, { isCompleted: !todo.isCompleted });
        // 낙관적 업데이트
        setTodos((prevTodos) =>
          prevTodos.map((t) =>
            t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
          )
        );
        // 실제 데이터로 갱신
        const updatedData = await api.getTodos(page, pageSize);
        setTodos(updatedData.items || []);
      }
    } catch (error) {
      alert("상태 변경에 실패했습니다.");
      // 에러 발생 시 원래 상태로 복구
      const updatedData = await api.getTodos(page, pageSize);
      setTodos(updatedData.items || []);
    }
  };

  const TodoListSection = ({
    items,
    isCompleted,
  }: {
    items: TodoListItem[];
    isCompleted: boolean;
  }) => {
    if (items.length === 0) {
      return <EmptyState type={isCompleted ? "DONE" : "TODO"} />;
    }

    return items.map((todo) => (
      <div
        key={todo.id}
        className={`${styles.item} ${isCompleted ? styles.completed : ""}`}
        onClick={() => router.push(`/items/${todo.id}`)}
        role="button"
        tabIndex={0}
        aria-label={`${todo.name} - ${isCompleted ? "완료됨" : "진행중"}`}
      >
        <div
          className={isCompleted ? styles.doneCheckbox : styles.checkbox}
          onClick={(e) => handleToggle(todo.id, e)}
          role="checkbox"
          aria-checked={isCompleted}
          tabIndex={0}
        >
          {isCompleted && <DoneCheckbox />}
        </div>
        <span className={styles.text}>{todo.name}</span>
      </div>
    ));
  };

  const EmptyState = ({ type }: { type: TabType }) => {
    const mainText =
      type === "TODO" ? "할일이 없어요." : "Todo를 새롭게 추가해주세요!";
    const subText =
      type === "TODO"
        ? "아직 다 한 일이 없어요."
        : "해야 할 일을 체크해보세요!";

    return (
      <div className={styles.empty} role="status">
        <div className={styles.emptyImage}>
          {type === "TODO" ? <TodoEmptySvg /> : <DoneEmptySvg />}
        </div>
        <div className={styles.emptyTextWrapper}>
          <p className={styles.mainText}>{mainText}</p>
          <p className={styles.subText}>{subText}</p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div className={styles.tabSection}>
          <div className={`${styles.tabHeader} ${styles.todoTab}`}>TODO</div>
          <div className={styles.list}>
            <TodoListSection
              items={todos.filter((todo) => !todo.isCompleted)}
              isCompleted={false}
            />
          </div>
        </div>
        <div className={styles.tabSection}>
          <div className={`${styles.tabHeader} ${styles.doneTab}`}>DONE</div>
          <div className={styles.list}>
            <TodoListSection
              items={todos.filter((todo) => todo.isCompleted)}
              isCompleted={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
