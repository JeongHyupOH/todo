import { Todo, CreateTodoInput, UpdateTodoInput, TodoListResponse, ImageUploadResponse } from '@/types/todo';

const BASE_URL = 'https://assignment-todolist-api.vercel.app/api';
const TENANT_ID = 'haqu';

export const api = {
  // Todo 목록 조회
  getTodos: async (page: number = 1, pageSize: number = 10): Promise<TodoListResponse> => {
    try {
      console.log('Fetching todos...', `${BASE_URL}/${TENANT_ID}/items`);
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items?page=${page}&pageSize=${pageSize}`);
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Todos data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // 단일 Todo 조회
  getTodoById: async (itemId: number): Promise<Todo> => {
    const res = await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`);
    if (!res.ok) throw new Error('Failed to fetch todo');
    return res.json();
  },

  // Todo 생성
  createTodo: async (data: CreateTodoInput): Promise<Todo> => {
    const res = await fetch(`${BASE_URL}/${TENANT_ID}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create todo');
    return res.json();
  },

  // Todo 수정
  updateTodo: async (id: number, data: UpdateTodoInput) => {
    try {
      console.log('Update request data:', data); // 요청 데이터 확인
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Server error response:', errorData); // 서버 에러 응답 확인
        throw new Error('Failed to update todo');
      }
  
      return res.json();
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Todo 삭제
  deleteTodo: async (itemId: number): Promise<{ message: string }> => {
    const res = await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete todo');
    return res.json();
  },

  // 이미지 업로드
  uploadImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
  
      console.log('Uploading image:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
  
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/images/upload`, {
        method: 'POST',
        body: formData
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Upload error response:', errorData);
        throw new Error('Failed to upload image');
      }
  
      return res.json();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}