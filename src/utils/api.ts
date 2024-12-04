const BASE_URL = 'https://assignment-todolist-api.vercel.app/api';
const TENANT_ID = 'haqu';

interface TodoItem {
  id: string;
  tenantId: string;
  name: string;
  memo: string;
  imageUrl: string;
  isCompleted: boolean;
}

interface TodoListItem {
  id: string;
  name: string;
  isCompleted: boolean;
}

interface UpdateTodoItem {
  name?: string;
  memo?: string;
  imageUrl?: string;
  isCompleted?: boolean;
}

export const api = {
  getTodos: async (page: number = 1, pageSize: number = 10) => {
    try {
      console.log('Requesting todos:', `${BASE_URL}/${TENANT_ID}/items?page=${page}&pageSize=${pageSize}`);
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items?page=${page}&pageSize=${pageSize}`);
      console.log('Response status:', res.status);
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  getTodoById: async (itemId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`);
      if (!res.ok) throw new Error('Failed to fetch todo');
      return res.json() as Promise<TodoItem>;
    } catch (error) {
      console.error('Error fetching todo:', error);
      throw error;
    }
  },

  updateTodo: async (itemId: string, data: UpdateTodoItem) => {
    try {
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update todo');
      return res.json() as Promise<TodoItem>;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  deleteTodo: async (itemId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete todo');
      return res.json() as Promise<{ message: string }>;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  createTodo: async (name: string) => {
    try {
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to create todo');
      return res.json() as Promise<TodoItem>;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  uploadImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/images/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload image');
      return res.json() as Promise<{ url: string }>;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};