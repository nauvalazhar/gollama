import { getChats } from '@/database/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  const chats = getChats();

  if (chats.length === 0) {
    return NextResponse.json({ error: 'No chats found' }, { status: 404 });
  }

  return NextResponse.json(chats);
}
