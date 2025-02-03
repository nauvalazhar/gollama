import { getChats } from '@/database/queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const folderId = params.get('folderId');

  const chats = getChats(folderId ?? undefined);

  return NextResponse.json(chats);
}
