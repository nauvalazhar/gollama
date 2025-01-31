import { Quote, RefreshCw } from 'lucide-react';

import { ChatBubbleDivider } from '@/components/chat/chat-bubble';
import { Maximize2, Pencil } from 'lucide-react';

import { ChatBubbleTool } from '@/components/chat/chat-bubble';

import { ChatBubbleTools } from '@/components/chat/chat-bubble';
import { Copy } from 'lucide-react';
import { memo } from 'react';
import { Message } from 'ai';

function Actions({
  message,
  isLoading,
}: {
  message: Message;
  isLoading: boolean;
}) {
  if (isLoading) return null;

  return (
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
  );
}

export const ChatActions = memo(Actions, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;

  return true;
});
