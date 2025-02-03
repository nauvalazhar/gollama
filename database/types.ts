export type Visibility = 'public' | 'private';

export type Chat = {
  id: string;
  title: string;
  visibility: Visibility;
  createdAt?: number;
  updatedAt?: number;
};

export type Message = {
  id: string;
  chatId: string;
  content: string;
  role: string;
  createdAt?: number;
  updatedAt?: number;
};

export type Folder = {
  id: string;
  name: string;
  visibility?: Visibility;
  createdAt?: number;
  updatedAt?: number;
};

export type ChatHistoryGroup = {
  date: string;
  chats: Chat[];
};
