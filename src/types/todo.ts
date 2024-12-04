// types/todo.ts
export interface Todo {
  id: number;
  name: string;
  memo?: string;
  imageUrl?: string;
  isCompleted: boolean;
  tenantId: string;
}

export type TodoCreateInput = Pick<Todo, 'name'>;
export type TodoUpdateInput = Partial<Pick<Todo, 'name' | 'memo' | 'imageUrl' | 'isCompleted'>>;

export interface TodoListResponse {
  items: Todo[];
  currentPage: number;
  totalPages: number;
}

export interface ImageUploadResponse {
  url: string;
}

export type TabType = 'TODO' | 'DONE';