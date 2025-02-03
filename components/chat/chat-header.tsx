'use client';

import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableText } from '@/components/ui/editable-text';
import { memo } from 'react';
import { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import Link from 'next/link';
import { ChatOptions } from './chat-options';

interface ChatHeaderProps {
  onModelChange?: (value: string) => void;
  title?: string;
  id: string;
}

function Header({ title, id }: ChatHeaderProps) {
  const { mutate } = useSWRConfig();

  const handleTitleChange = async (value: string) => {
    await fetch('/api/chat/rename', {
      method: 'PATCH',
      body: JSON.stringify({ id, title: value }),
    });

    mutate('/api/chat/history');
  };

  return (
    <header className="flex items-center py-2 px-6 border-b border-border">
      <div className="w-4/12">
        <Button variant="outline" asChild>
          <Link href="/">
            <MessageSquarePlus className="size-4" />
            <span className="ml-2">New Chat</span>
          </Link>
        </Button>
      </div>
      <div className="w-4/12 flex items-center">
        {title && (
          <EditableText
            defaultValue={title}
            onSubmit={handleTitleChange}
            className="text-lg font-semibold mx-auto"
            classNameInput="text-center"
            staticElement={(value) => <h1>{value}</h1>}
          />
        )}
      </div>
      <div className="w-4/12">
        <ChatOptions chatId={id} />
      </div>
    </header>
  );
}

export const ChatHeader = memo(Header, (prevProps, nextProps) => {
  if (prevProps.title !== nextProps.title) return false;
  return true;
});
