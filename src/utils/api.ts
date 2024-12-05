import { Todo, TodoCreateInput, TodoUpdateInput, TodoListResponse, ImageUploadResponse } from '@/types/todo';

const BASE_URL = 'https://assignment-todolist-api.vercel.app/api';
const TENANT_ID = 'haqu';

export const api = {
  getTodos: async (page: number = 1, pageSize: number = 10): Promise<TodoListResponse> => {
    try {
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items?page=${page}&pageSize=${pageSize}`);
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  getTodoById: async (itemId: number): Promise<Todo> => {
    try {
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`);
      if (!res.ok) throw new Error('Failed to fetch todo');
      return res.json();
    } catch (error) {
      console.error('Error fetching todo:', error);
      throw error;
    }
  },

  updateTodo: async (id: number, data: TodoUpdateInput): Promise<Todo> => {
    try {
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update todo');
      return res.json();
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  deleteTodo: async (id: number): Promise<{ message: string }> => {
    try {
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete todo');
      return res.json();
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  createTodo: async (data: TodoCreateInput): Promise<Todo> => {
    try {
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create todo');
      return res.json();
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/images/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload image');
      return res.json();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};