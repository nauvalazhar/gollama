import { db } from './database';
import { Chat, Message } from './types';

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
    return db.prepare('SELECT * FROM Chat').all();
  } catch (error) {
    console.error('Failed to get chats:', error);
    throw new Error(
      `Failed to get chats: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export function getChatsGroupedByDate() {
  try {
    const results = db
      .prepare(
        `
        SELECT 
          id,
          title
        FROM Chat
        ORDER BY COALESCE(updatedAt, createdAt) DESC
      `
      )
      .all();

    return results;
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
