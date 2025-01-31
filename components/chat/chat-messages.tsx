import { Message } from 'ai';
import { Bot, Info, Loader } from 'lucide-react';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleContent,
  ChatBubbleDetail,
  ChatBubbleName,
} from './chat-bubble';
import { memo } from 'react';
import equal from 'fast-deep-equal';
import { ChatMessage } from './chat-message';

function Messages({
  messages,
  isLoading,
}: {
  messages: Message[];
  isLoading: boolean;
}) {
  console.log('messages re-render');
  return (
    <>
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} isLoading={isLoading} />
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
    </>
  );
}

export const ChatMessages = memo(Messages, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLoading && nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;

  return true;
});
