import { getChatsGroupedByDate } from '@/database/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  const chats = getChatsGroupedByDate();

  if (!chats) {
    return NextResponse.json({ error: 'No chats found' }, { status: 404 });
  }

  return NextResponse.json(chats);
}
