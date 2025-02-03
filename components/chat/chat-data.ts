import { Chat } from '@/database/types';
import { fetcher } from '@/lib/utils';
import useSWR from 'swr';

export const useChatData = (id: string) => {
  const { data, error, isLoading } = useSWR<Chat>(`/api/chat/${id}`, fetcher);

  return {
    data,
    error,
    isLoading,
  };
};
