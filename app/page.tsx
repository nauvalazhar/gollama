import { Chat } from '@/components/chat/chat';
import { generateUUID } from '@/lib/utils';

export default function Page() {
  const id = generateUUID();

  return <Chat id={id} key={id} initialMessages={[]} />;
}
