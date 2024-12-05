"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@/styles/TodoDetail.module.css";
import { api } from "@/utils/api";
import { Todo } from "@/types/todo";
import { DoneCheckbox } from "../icons/DoneCheckbox";

interface TodoDetailProps {
  itemId: string;
}

export default function TodoDetail({ itemId }: TodoDetailProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todo, setTodo] = useState<Todo>({
    id: Number(itemId),
    tenantId: "",
    name: "",
    memo: "",
    imageUrl: "",
    isCompleted: false,
  });

  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    try {
      setIsLoading(true);
      const data = await api.getTodoById(Number(itemId));
      if (data) {
        setTodo(data);
      }
    } catch (error) {
      console.error("Failed to fetch todo:", error);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      // 파일 타입 검증
      if (!file.type.startsWith("image/")) {
        console.error("Invalid file type");
        return;
      }

      // 파일 이름 검증 (영문, 숫자, 특수문자만)
      if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
        console.error("File name can only contain English characters");
        return;
      }

      // 파일 크기 검증 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error("File size must be less than 5MB");
        return;
      }

      setIsLoading(true);

      // FormData 생성 및 로깅
      const formData = new FormData();
      formData.append("image", file);
      console.log("Uploading file:", file.name, file.type, file.size);

      const imageData = await api.uploadImage(file);
      if (imageData?.url) {
        setTodo((prev) => ({ ...prev, imageUrl: imageData.url }));
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!todo.name.trim()) return;

    try {
      setIsLoading(true);
      const updateData = {
        name: todo.name.trim(),
        memo: todo.memo || "", // memo가 undefined일 경우 빈 문자열로
        imageUrl: todo.imageUrl || "", // imageUrl이 undefined일 경우 빈 문자열로
        isCompleted: todo.isCompleted,
      };

      console.log("Updating todo with data:", updateData); // 요청 데이터 확인

      await api.updateTodo(Number(itemId), updateData);
      window.dispatchEvent(new Event("todo-updated"));
      router.push("/");
    } catch (error) {
      console.error("Update failed with error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await api.deleteTodo(Number(itemId));
      router.push("/");
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <div className={styles.titleWrapper}>
          <div
            className={`${styles.checkbox} ${
              todo.isCompleted ? styles.completed : ""
            }`}
            onClick={() =>
              setTodo((prev) => ({ ...prev, isCompleted: !prev.isCompleted }))
            }
            role="checkbox"
            aria-checked={todo.isCompleted}
          >
            {todo.isCompleted && <DoneCheckbox />}
          </div>
          <input
            type="text"
            value={todo.name}
            onChange={(e) =>
              setTodo((prev) => ({ ...prev, name: e.target.value }))
            }
            className={`${styles.title} ${
              todo.isCompleted ? styles.completedTitle : ""
            }`}
            placeholder="할 일을 입력하세요"
          />
        </div>
      </div>
      <div className={styles.content}>
        <div
          className={styles.imageSection}
          onClick={() => fileInputRef.current?.click()}
        >
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
            onChange={(e) =>
              e.target.files?.[0] && handleImageUpload(e.target.files[0])
            }
            hidden
          />
        </div>

        <div className={styles.memoSection}>
          <span className={styles.memoTitle}>Memo</span>
          <textarea
            value={todo.memo}
            onChange={(e) =>
              setTodo((prev) => ({ ...prev, memo: e.target.value }))
            }
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
