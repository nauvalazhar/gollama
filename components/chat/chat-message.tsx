import { Bot } from 'lucide-react';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleContent,
  ChatBubbleDetail,
  ChatBubbleName,
} from './chat-bubble';
import { Message as MessageAi } from 'ai';
import { memo } from 'react';
import { ChatActions } from '@/components/chat/chat-actions';

function Message({
  message,
  isLoading,
}: {
  message: MessageAi;
  isLoading: boolean;
}) {
  console.log('message re-render', message.id);
  return (
    <ChatBubble
      key={message.id}
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
        <ChatActions message={message} isLoading={isLoading} />
      </ChatBubbleDetail>
    </ChatBubble>
  );
}

export const ChatMessage = memo(Message, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.message.content !== nextProps.message.content) return false;

  return true;
});
