import { Chat } from '@/components/chat/chat';
import { getChat, getMessagesByChatId } from '@/database/queries';
import { convertMessagesToUi } from '@/lib/utils';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chat = await getChat(id);

  return {
    title: chat?.title || 'Untitled Chat',
  };
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const chat = getChat(id);

  if (!chat) {
    notFound();
  }

  const messages = await getMessagesByChatId(id);
  const uiMessages = convertMessagesToUi(messages);

  return <Chat id={id} initialMessages={uiMessages} title={chat.title} />;
}
