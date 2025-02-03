import { getChat } from '@/database/queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  const chat = getChat(id);

  if (!chat)
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

  return NextResponse.json(chat);
}
