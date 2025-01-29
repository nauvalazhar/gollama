'use client';

import {
  Bot,
  Copy,
  Info,
  Loader,
  Maximize2,
  Pencil,
  Quote,
  RefreshCw,
  ArrowDown,
} from 'lucide-react';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleContent,
  ChatBubbleDetail,
  ChatBubbleDivider,
  ChatBubbleName,
  ChatBubbleTool,
  ChatBubbleTools,
} from './chat-bubble';
import { ChatForm } from './chat-form';
import { useChat } from 'ai/react';
import { ChatHeader } from './chat-header';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Chat() {
  const [chatContainerRef, endRef, isAtBottom] =
    useScrollToBottom<HTMLDivElement>();

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onFinish: () => {},
  });

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="flex flex-col h-full relative">
      <ChatHeader
        onModelChange={(value) => console.log('Model changed:', value)}
        onTitleChange={(value) => console.log(value)}
      />

      <div ref={chatContainerRef} className="overflow-y-auto h-full">
        <div className="flex flex-col gap-10 max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <ChatBubble
              key={index}
              variant={message.role === 'user' ? 'plain' : 'boxed'}
            >
              {message.role === 'user' ? (
                <ChatBubbleAvatar src="/avatar.png" />
              ) : (
                <ChatBubbleAvatar fallback={<Bot />} className="bg-primary" />
              )}
              <ChatBubbleDetail>
                <ChatBubbleName>
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </ChatBubbleName>
                <ChatBubbleContent>{message.content}</ChatBubbleContent>
                {!isLoading && (
                  <>
                    {message.role === 'assistant' ? (
                      <ChatBubbleTools>
                        <ChatBubbleTool label="Quote this response">
                          <Quote />
                        </ChatBubbleTool>
                        <ChatBubbleDivider />
                        <ChatBubbleTool label="Regenerate response">
                          <RefreshCw />
                        </ChatBubbleTool>
                        <ChatBubbleTool label="Copy">
                          <Copy />
                        </ChatBubbleTool>
                        <ChatBubbleTool label="Expand">
                          <Maximize2 />
                        </ChatBubbleTool>
                      </ChatBubbleTools>
                    ) : (
                      <ChatBubbleTools floating>
                        <ChatBubbleTool label="Edit message">
                          <Pencil />
                        </ChatBubbleTool>
                        <ChatBubbleDivider />
                        <ChatBubbleTool label="Copy">
                          <Copy />
                        </ChatBubbleTool>
                      </ChatBubbleTools>
                    )}
                  </>
                )}
              </ChatBubbleDetail>
            </ChatBubble>
          ))}
          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1].role === 'user' && (
              <ChatBubble variant="boxed">
                <ChatBubbleAvatar fallback={<Bot />} className="bg-primary" />
                <ChatBubbleDetail>
                  <ChatBubbleName>Assistant</ChatBubbleName>
                  <ChatBubbleContent>
                    <Loader className="animate-spin size-4" />
                  </ChatBubbleContent>
                </ChatBubbleDetail>
              </ChatBubble>
            )}
          {messages.length > 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mx-auto pb-8">
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
