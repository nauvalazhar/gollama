'use client';

import {
  Bookmark,
  Bot,
  ChevronDown,
  Copy,
  Download,
  Info,
  Loader,
  Maximize2,
  MoreVertical,
  Pencil,
  Quote,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  Trash,
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
import { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import { ChatHeader } from './chat-header';
import { Button } from '@/components/ui/button';

export function Chat() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onFinish: () => {
      // Scroll to bottom after response finishes
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    },
  });

  // Scroll to bottom whenever messages change
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  // Show/hide scroll button based on scroll position
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="flex flex-col h-full relative">
      <ChatHeader
        onModelChange={(value) => console.log('Model changed:', value)}
        onTitleChange={(value) => console.log(value)}
      />
      <div ref={chatContainerRef} className="h-full overflow-y-auto pt-6">
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
                        <ChatBubbleTool label="Good response">
                          <ThumbsUp />
                        </ChatBubbleTool>
                        <ChatBubbleTool label="Bad response">
                          <ThumbsDown />
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
        </div>
      </div>
      {showScrollButton && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-24 right-8 rounded-full z-20"
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
      <ChatForm handleSubmit={handleSubmit} input={input} setInput={setInput} />
    </section>
  );
}
