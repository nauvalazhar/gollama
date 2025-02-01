'use client';

import { ChatForm } from './chat-form';
import { useChat } from 'ai/react';
import { ChatHeader } from './chat-header';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { Message } from 'ai';
import { cn, generateUUID } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ArrowDown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

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
  const [editorHeight, setEditorHeight] = useState(0);
  const [atBottomOnce, setAtBottomOnce] = useState(false);

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

  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const jumpToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
      setAtBottomOnce(true);
    }
  };

  const handleHeightChange = (height: number) => {
    setEditorHeight(height);
  };

  return (
    <section
      className={cn(
        'flex flex-col h-full relative transition-opacity duration-150',
        // little bit of hack to hide the glitch during scroll
        !atBottomOnce ? 'opacity-0' : 'opacity-100'
      )}
      style={
        {
          '--editor-height': `${editorHeight}px`,
        } as React.CSSProperties
      }
    >
      <ChatHeader
        title={title}
        onModelChange={(value) => console.log('Model changed:', value)}
        id={id}
      />
      <div ref={chatContainerRef} className="overflow-y-auto h-full pt-6">
        <div className="flex flex-col gap-10 max-w-3xl mx-auto">
          <ChatMessages messages={messages} isLoading={isLoading} />
          {messages.length > 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mx-auto">
              <Info size={16} />
              AI can make mistakes. Always verify information.
            </p>
          )}
        </div>
        <div ref={endRef} className="h-[calc(var(--editor-height)+60px)]" />
      </div>
      <div
        className={cn(
          'absolute -translate-x-1/2 left-1/2 transition-all duration-300',
          isAtBottom
            ? 'bottom-[calc(var(--editor-height)-30px)] opacity-0'
            : 'bottom-[calc(var(--editor-height)+30px)] opacity-100'
        )}
      >
        <button
          onClick={scrollToBottom}
          className={cn(
            'flex items-center justify-center relative size-12',
            'bg-white/5 rounded-full border border-white/10',
            'backdrop-blur-2xl cursor-pointer',
            'hover:bg-white/10 hover:border-white/20 transition-colors duration-200'
          )}
        >
          <ArrowDown className="size-4" />
        </button>
      </div>
      <ChatForm
        handleSubmit={handleSubmit}
        input={input}
        setInput={setInput}
        onHeightChange={handleHeightChange}
        onEditorCreated={() => {
          jumpToBottom();
        }}
      />
    </section>
  );
}
