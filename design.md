# Design

## API Design

### Chat

#### GET /api/chat

List all chats.

#### POST /api/chat

Create a new chat.

#### DELETE /api/chat

Delete a chat.

#### GET /api/chat/:id

Get a chat by id.

#### PATCH /api/chat/:id/rename

Rename chat title.

#### PATCH /api/chat/:id/folder

Update a chat's folder.

### Folder

#### GET /api/folder

List all folders.

#### POST /api/folder

Create a new folder.

#### DELETE /api/folder/:id

Delete a folder.

#### PATCH /api/folder/:id/rename

Rename a folder.

## Store Design

### App Store

Store global app state. For example:

- Sidebar selected folder id

### Chat Store

Store chat state. For example:

- Chat id
- Chat messages
- Chat input
- Chat is loading
- Other chat props

### Others

For persistent state, use cookies instead of local storage to avoid glitch and layout-shift.
