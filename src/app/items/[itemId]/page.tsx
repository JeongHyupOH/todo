import TodoDetail from '@/components/todo/TodoDetail';

interface PageProps {
  params: {
    itemId: string;
  }
}

export default async function TodoDetailPage({ params }: PageProps) {
  const { itemId } = params;
  return <TodoDetail itemId={itemId} />;
}