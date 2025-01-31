import { Message, streamText } from 'ai';
import { ollama } from 'ollama-ai-provider';
import {
  deleteChat,
  deleteMessagesByChatId,
  getChat,
  insertChat,
  insertMessage,
  insertMessages,
  updateChatDate,
} from '@/database/queries';
import { getLastUserMessage } from '@/lib/utils';
import { systemPrompt } from '@/lib/prompt/system';
import { generateTitleFromUserMessage } from '@/app/actions';

export const maxDuration = 30;

const model = ollama('llama3.2');

export async function POST(req: Request) {
  const {
    id,
    messages,
  }: {
    id: string;
    messages: Message[];
  } = await req.json();

  const chat = getChat(id);
  const lastUserMessage = getLastUserMessage(messages);

  if (!lastUserMessage) {
    return new Response('No user message found', { status: 400 });
  }

  if (!chat) {
    const title = await generateTitleFromUserMessage({
      message: lastUserMessage,
    });

    insertChat({
      id,
      title,
      visibility: 'public',
    });
  } else {
    updateChatDate(id);
  }

  insertMessage({
    ...lastUserMessage,
    chatId: id,
    createdAt: Date.now(),
  });

  const result = streamText({
    model,
    messages,
    system: systemPrompt,
    onFinish: ({ response }) => {
      insertMessages(
        response.messages.map((message) => ({
          content: JSON.stringify(message.content),
          id: message.id,
          chatId: id,
          createdAt: Date.now(),
          role: message.role,
        }))
      );
    },
  });

  return result.toDataStreamResponse();
}

export async function DELETE(req: Request) {
  const { id }: { id: string } = await req.json();

  deleteChat(id);
  deleteMessagesByChatId(id);

  return new Response('Chat deleted', { status: 200 });
}
