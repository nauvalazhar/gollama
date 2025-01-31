'use client';

import { ChatForm } from './chat-form';
import { useChat } from 'ai/react';
import { ChatHeader } from './chat-header';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { Message } from 'ai';
import { generateUUID } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { ChatMessages } from '@/components/chat/chat-messages';
import { Info } from 'lucide-react';

export function Chat({
  id,
  initialMessages,
  title,
}: {
  id: string;
  initialMessages: Message[];
  title?: string;
}) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const [chatContainerRef, endRef, isAtBottom] =
    useScrollToBottom<HTMLDivElement>();
  const pathname = usePathname();

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    id,
    body: {
      id,
    },
    initialMessages,
    generateId: generateUUID,
    sendExtraMessageFields: true,
    api: '/api/chat',
    onResponse: () => {
      if (!pathname.includes('chat')) {
        router.push(`/chat/${id}`);
      }
      mutate('/api/chat/history');
    },
  });

  console.log('render');

  return (
    <section className="flex flex-col h-full relative">
      <ChatHeader
        title={title}
        onModelChange={(value) => console.log('Model changed:', value)}
        id={id}
      />

      <div ref={chatContainerRef} className="overflow-y-auto h-full py-6">
        <div className="flex flex-col gap-10 max-w-3xl mx-auto">
          <ChatMessages messages={messages} isLoading={isLoading} />
          {messages.length > 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mx-auto">
              <Info size={16} />
              AI can make mistakes. Always verify information.
            </p>
          )}
          <div ref={endRef} />
        </div>
      </div>
      <ChatForm handleSubmit={handleSubmit} input={input} setInput={setInput} />
    </section>
  );
}
