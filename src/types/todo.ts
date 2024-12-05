// API 응답의 Todo 아이템 타입
export interface Todo {
  id: number;
  tenantId: string;
  name: string;
  memo: string;
  imageUrl: string;
  isCompleted: boolean;
}

// Todo 생성 요청 타입
export interface CreateTodoInput {
  name: string;
}

// Todo 업데이트 요청 타입
export interface UpdateTodoInput {
  name?: string;
  memo?: string;
  imageUrl?: string;
  isCompleted?: boolean;
}

// Todo 목록 조회 응답 타입
export interface TodoListResponse {
  items: Todo[];
  currentPage: number;
  totalPages: number;
}

// 이미지 업로드 응답 타입
export interface ImageUploadResponse {
  url: string;
}

export type TabType = 'TODO' | 'DONE';