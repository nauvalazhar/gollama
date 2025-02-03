import { db } from './database';
import { Chat, ChatHistoryGroup, Folder, Message } from './types';

export function insert<T extends Record<string, unknown>>(
  table: string,
  data: T
) {
  const columns = Object.keys(data).join(', ');
  const placeholders = Object.keys(data)
    .map(() => '?')
    .join(', ');
  const statement = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
  console.log('RUN QUERY:', statement, Object.values(data));
  return db.prepare(statement).run(Object.values(data));
}

export function insertChat(chat: Chat) {
  try {
    return insert('Chat', chat);
  } catch (error) {
    throw new Error(
      `Failed to insert chat: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export function insertChatFolder({
  chatId,
  folderId,
}: {
  chatId: string;
  folderId: string;
}) {
  try {
    return insert('ChatFolder', { chatId, folderId });
  } catch (error) {
    throw new Error(
      `Failed to insert chat folder: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export function getChats(folderId?: string) {
  try {
    let whereClause = '';

    if (folderId) {
      whereClause = 'WHERE c.folderId = ?';
    }

    const results = db
      .prepare(
        `
          WITH ChatGroups AS (
            SELECT 
              c.*,
              f.id as folderId,
              f.name as folderName,
              CASE 
                WHEN date(c.updatedAt, 'localtime') = date('now', 'localtime') THEN 'Today'
                WHEN date(c.updatedAt, 'localtime') = date('now', '-1 day', 'localtime') THEN 'Yesterday'
                WHEN date(c.updatedAt, 'localtime') BETWEEN date('now', '-7 day', 'localtime') 
                  AND date('now', '-2 day', 'localtime') THEN '7 Days'
                ELSE 'Older'
              END AS time_group,
              CASE 
                WHEN date(c.updatedAt, 'localtime') = date('now', 'localtime') THEN 1
                WHEN date(c.updatedAt, 'localtime') = date('now', '-1 day', 'localtime') THEN 2
                WHEN date(c.updatedAt, 'localtime') BETWEEN date('now', '-7 day', 'localtime') 
                  AND date('now', '-2 day', 'localtime') THEN 3
                ELSE 4
              END AS sort_order
            FROM Chat c
            LEFT JOIN Folder f ON c.folderId = f.id
            ${whereClause}
          )

          SELECT 
            time_group AS date,
            (
              SELECT json_group_array(
                json_object(
                  'id', id,
                  'title', title,
                  'visibility', visibility,
                  'folderId', folderId,
                  'folderName', folderName,
                  'createdAt', datetime(createdAt, 'localtime'),
                  'updatedAt', datetime(updatedAt, 'localtime')
                )
              )
              FROM (
                SELECT *
                FROM ChatGroups c2
                WHERE c2.time_group = c1.time_group
                ORDER BY c2.updatedAt DESC
              )
            ) AS chats
          FROM ChatGroups c1
          GROUP BY time_group, sort_order
          ORDER BY sort_order;
        `
      )
      .all(folderId ? [folderId] : []) as {
      date: string;
      chats: string;
    }[];

    return results.map((result) => ({
      date: result.date,
      chats: JSON.parse(result.chats),
    })) as ChatHistoryGroup[];
  } catch (error) {
    console.error('Failed to get grouped chats:', error);
    throw new Error(
      `Failed to get grouped chats: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export function getChat(id: string) {
  try {
    return db
      .prepare(
        `
      SELECT 
        c.*,
        f.name as folderName,
        f.id as folderId
      FROM Chat c
      LEFT JOIN Folder f ON c.folderId = f.id 
      WHERE c.id = ?
    `
      )
      .get(id) as (Chat & { folderName: string; folderId: string }) | undefined;
  } catch (error) {
    console.error('Failed to get chat:', error);
    throw new Error(
      `Failed to get chat: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export function updateChatDate(id: string) {
  return db
    .prepare('UPDATE Chat SET updatedAt = CURRENT_TIMESTAMP WHERE id = ?')
    .run(id);
}

export function updateChatTitle(id: string, title: string) {
  return db.prepare('UPDATE Chat SET title = ? WHERE id = ?').run(title, id);
}

export function deleteChat(id: string) {
  return db.prepare('DELETE FROM Chat WHERE id = ?').run(id);
}

export function updateChatFolder(chatId: string, folderId: string) {
  return db
    .prepare('UPDATE Chat SET folderId = ? WHERE id = ?')
    .run(folderId, chatId);
}

export function deleteMessagesByChatId(chatId: string) {
  return db.prepare('DELETE FROM Message WHERE chatId = ?').run(chatId);
}

export function insertMessage(message: Message) {
  try {
    return insert('Message', message);
  } catch (error) {
    throw new Error(
      `Failed to insert message: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export function insertMessages(messages: Message[]) {
  try {
    const transaction = db.transaction((messages) => {
      for (const message of messages) {
        insert('Message', message);
      }
    });

    transaction(messages);
  } catch (error) {
    console.error('Failed to insert messages:', error);
    throw new Error(
      `Failed to insert messages: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export function getMessagesByChatId(chatId: string) {
  return db
    .prepare('SELECT * FROM Message WHERE chatId = ?')
    .all(chatId) as Message[];
}

export function getFolderByName(name: string) {
  return db
    .prepare('SELECT * FROM Folder WHERE LOWER(name) = LOWER(?)')
    .get(name) as Folder | undefined;
}

export function getFolderByChatId(chatId: string) {
  return db
    .prepare(
      'SELECT * FROM Folder WHERE id = (SELECT folderId FROM Chat WHERE id = ?)'
    )
    .get(chatId) as Folder | undefined;
}

export function deleteFolder(id: string) {
  return db.prepare('DELETE FROM Folder WHERE id = ?').run(id);
}

export function updateFolder(id: string, name: string) {
  return db.prepare('UPDATE Folder SET name = ? WHERE id = ?').run(name, id);
}

export function insertFolder(folder: Folder) {
  try {
    return insert('Folder', folder);
  } catch (error) {
    throw new Error(
      `Failed to insert folder: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export function getFolders({ excludeIds }: { excludeIds?: string[] } = {}) {
  const query = excludeIds?.length
    ? `SELECT * FROM Folder WHERE id NOT IN (${excludeIds
        .map((id) => `'${id}'`)
        .join(',')})`
    : 'SELECT * FROM Folder';

  return db.prepare(query).all() as Folder[];
}
