import { Message } from 'ai';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Message as MessageDb } from '../database/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getLastUserMessage(messages: Message[]) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

export function parseMessageContent(content: string): string | object {
  try {
    return JSON.parse(content);
  } catch (error) {
    return content;
  }
}

export function convertMessagesToUi(messages: MessageDb[]): Message[] {
  return messages.reduce((acc: Message[], message) => {
    let textContent = '';
    const content = parseMessageContent(message.content);

    if (typeof content === 'string') {
      textContent = message.content;
    } else if (Array.isArray(content)) {
      for (const item of content) {
        if (item.type === 'text') {
          textContent += item.text;
        }
      }
    }

    acc.push({
      id: message.id,
      role: message.role as Message['role'],
      content: textContent,
    });

    return acc;
  }, []);
}

export function fetcher(url: string, options: RequestInit) {
  return fetch(url, options).then((res) => res.json());
}
