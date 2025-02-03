import {
  deleteFolder,
  getChat,
  getFolderByChatId,
  getFolderByName,
  getFolders,
  insertFolder,
  updateFolder,
} from '@/database/queries';
import { Folder } from '@/database/types';
import { generateUUID } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { name } = await req.json();

  const folder = getFolderByName(name);

  if (folder) {
    return NextResponse.json(
      { error: 'Folder already exists' },
      { status: 400 }
    );
  }

  insertFolder({ id: generateUUID(), name });

  return NextResponse.json({ name });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId');
  let currentFolder: Folder | undefined;

  if (chatId) {
    const folder = getFolderByChatId(chatId);

    if (!folder) return NextResponse.json([], { status: 404 });

    currentFolder = folder;
  }

  const folders = getFolders();

  return NextResponse.json({ folders, currentFolder });
}

export async function PATCH(req: Request) {
  const { id, name } = await req.json();

  const folder = getFolderByName(name);

  if (folder) {
    return NextResponse.json(
      { error: 'Folder already exists' },
      { status: 400 }
    );
  }

  updateFolder(id, name);

  return NextResponse.json({ id, name });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  const defaultFolders = ['archived', 'bookmark', 'general'];

  if (defaultFolders.includes(id)) {
    return NextResponse.json(
      { error: 'Cannot delete default folder' },
      { status: 400 }
    );
  }

  deleteFolder(id);

  return NextResponse.json({ id });
}
