import { db } from './database';
import { Chat, ChatHistoryGroup, Message } from './types';

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

export function getChats() {
  try {
    const results = db
      .prepare(
        `
          WITH ChatGroups AS (
            SELECT 
              *,
              CASE 
                WHEN date(updatedAt, 'localtime') = date('now', 'localtime') THEN 'Today'
                WHEN date(updatedAt, 'localtime') = date('now', '-1 day', 'localtime') THEN 'Yesterday'
                WHEN date(updatedAt, 'localtime') BETWEEN date('now', '-7 day', 'localtime') 
                  AND date('now', '-2 day', 'localtime') THEN '7 Days'
                ELSE 'Older'
              END AS time_group,
              CASE 
                WHEN date(updatedAt, 'localtime') = date('now', 'localtime') THEN 1
                WHEN date(updatedAt, 'localtime') = date('now', '-1 day', 'localtime') THEN 2
                WHEN date(updatedAt, 'localtime') BETWEEN date('now', '-7 day', 'localtime') 
                  AND date('now', '-2 day', 'localtime') THEN 3
                ELSE 4
              END AS sort_order
            FROM Chat
          )

          SELECT 
            time_group AS date,
            (
              SELECT json_group_array(
                json_object(
                  'id', id,
                  'title', title,
                  'visibility', visibility,
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
      .all() as {
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
    return db.prepare('SELECT * FROM Chat WHERE id = ?').get(id) as
      | Chat
      | undefined;
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
