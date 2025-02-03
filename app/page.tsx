import { Chat } from '@/components/chat/chat';
import { generateUUID } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gollama',
};

export default function Page() {
  const id = generateUUID();

  return <Chat id={id} key={id} initialMessages={[]} hideHeader />;
}
