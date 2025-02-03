'use client';

import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableText } from '@/components/ui/editable-text';
import { memo } from 'react';
import { useSWRConfig } from 'swr';
import Link from 'next/link';
import { ChatOptions } from './chat-options';
import { useChatStore } from './chat-store';
import { useChatData } from '@/components/chat/chat-data';
import { useShallow } from 'zustand/react/shallow';

function Header({ isNewChat }: { isNewChat?: boolean }) {
  const { viewFolderId, id } = useChatStore(
    useShallow((state) => ({
      viewFolderId: state.viewFolderId,
      id: state.chatId,
    }))
  );
  const { data, isLoading } = useChatData(id);
  const { mutate } = useSWRConfig();

  const handleTitleChange = async (value: string) => {
    await fetch('/api/chat/rename', {
      method: 'PATCH',
      body: JSON.stringify({ id, title: value }),
    });

    mutate('/api/chat/history');
    mutate(`/api/chat/history?folderId=${viewFolderId}`);
  };

  return (
    <header className="flex items-center py-2 px-6 border-b border-border h-14">
      <div className="w-4/12">
        {!isNewChat && (
          <Button variant="outline" asChild>
            <Link href="/">
              <MessageSquarePlus className="size-4" />
              <span className="ml-2">New Chat</span>
            </Link>
          </Button>
        )}
      </div>
      <div className="w-4/12 flex items-center">
        {data ? (
          <EditableText
            defaultValue={data.title}
            onSubmit={handleTitleChange}
            className="text-lg font-semibold mx-auto"
            classNameInput="text-center"
            staticElement={(value) => <h1>{value}</h1>}
          />
        ) : (
          <div className="animate-pulse mx-auto w-48 h-6 rounded-md bg-white/10" />
        )}
      </div>
      {!isNewChat && (
        <div className="w-4/12">
          {data ? (
            <ChatOptions chatId={id} />
          ) : (
            <div className="animate-pulse ml-auto w-20 h-6 rounded-md bg-white/10" />
          )}
        </div>
      )}
    </header>
  );
}

export const ChatHeader = memo(Header, (prevProps, nextProps) => {
  if (prevProps.title !== nextProps.title) return false;
  return true;
});
