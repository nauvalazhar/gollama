/*
note:
- chat can belong to folder or not
- folder can have many chats
- use UUID for id so it should be unique and string
- use timestamp for created_at and updated_at
*/

CREATE TABLE Chat (
    id TEXT PRIMARY KEY NOT NULL,
    title VARCHAR(255) NOT NULL,
    visibility TEXT NOT NULL DEFAULT 'public',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Message (
    id TEXT PRIMARY KEY NOT NULL,
    chatId TEXT NOT NULL,
    content TEXT NOT NULL,
    role TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chatId) REFERENCES Chat(id) ON DELETE CASCADE
);

CREATE TABLE Folder (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    visibility TEXT NOT NULL DEFAULT 'public',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ChatFolder (
    id TEXT PRIMARY KEY NOT NULL,
    chatId TEXT NOT NULL,
    folderId TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chatId) REFERENCES Chat(id) ON DELETE CASCADE,
    FOREIGN KEY (folderId) REFERENCES Folder(id) ON DELETE CASCADE
);
