'use client';

import { ChatForm } from './chat-form';
import { useChat } from 'ai/react';
import { ChatHeader } from './chat-header';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { Message } from 'ai';
import { cn, generateUUID } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ArrowDown, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useChatStore } from './chat-store';
import { useChatData } from '@/components/chat/chat-data';
import { useShallow } from 'zustand/react/shallow';

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Message[];
}) {
  const { data, error } = useChatData(id);

  const { editorFolderId, viewFolderId, setChatId } = useChatStore(
    useShallow((state) => ({
      editorFolderId: state.editorFolderId,
      viewFolderId: state.viewFolderId,
      setChatId: state.setChatId,
    }))
  );

  const { mutate } = useSWRConfig();
  const [chatContainerRef, endRef, isAtBottom] =
    useScrollToBottom<HTMLDivElement>();
  const pathname = usePathname();
  const [editorHeight, setEditorHeight] = useState(0);
  const [atBottomOnce, setAtBottomOnce] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    id,
    body: {
      id,
      folderId: editorFolderId,
    },
    initialMessages,
    generateId: generateUUID,
    sendExtraMessageFields: true,
    api: '/api/chat',
    onResponse: () => {
      if (!pathname.includes('chat')) {
        window.history.pushState({}, '', `/chat/${id}`);
      }

      if (viewFolderId == 'all') {
        mutate(`/api/chat/history`);
      }

      mutate(`/api/chat/history?folderId=${editorFolderId}`);
    },
  });

  useEffect(() => {
    setChatId(id);
  }, [id]);

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

  useEffect(() => {
    if (chatContainerRef.current) {
      setHasScroll(
        chatContainerRef.current.scrollHeight >
          chatContainerRef.current.clientHeight
      );
    }
  }, [messages, editorHeight]);

  return (
    <section
      className={cn(
        'flex flex-col h-full relative transition-opacity duration-150'
      )}
      style={
        {
          '--editor-height': `${editorHeight}px`,
        } as React.CSSProperties
      }
    >
      <ChatHeader isNewChat={initialMessages.length === 0} />
      <div
        ref={chatContainerRef}
        className={cn(
          'overflow-y-auto h-full pt-6',
          'transition-opacity duration-300',
          atBottomOnce ? 'opacity-100' : 'opacity-0'
        )}
      >
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
      {hasScroll && (
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
      )}
      <ChatForm
        handleSubmit={handleSubmit}
        input={input}
        setInput={setInput}
        onHeightChange={handleHeightChange}
        onEditorCreated={() => {
          jumpToBottom();
        }}
        disableFolder={initialMessages.length > 0}
      />
    </section>
  );
}
