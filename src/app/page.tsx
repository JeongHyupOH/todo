'use client';


import TodoForm from '@/components/todo/TodoForm';
import TodoList from '@/components/todo/TodoList';


export default function HomePage() {
  return (
    <div>
      <TodoForm />
      <TodoList />
    </div>
  );
} 