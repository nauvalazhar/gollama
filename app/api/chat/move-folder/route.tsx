import { updateChatFolder } from '@/database/queries';

export async function PATCH(req: Request) {
  const { chatId, folderId } = await req.json();

  updateChatFolder(chatId, folderId);

  return new Response(null, { status: 200 });
}
