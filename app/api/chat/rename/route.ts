import { NextRequest } from 'next/server';
import { updateChatTitle } from 'database/queries';

export async function PATCH(req: NextRequest) {
  const { id, title } = await req.json();
  await updateChatTitle(id, title);
  return new Response(null, { status: 200 });
}
